"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore, type CartItem } from "@/lib/store/useCartStore";

const SYNC_DEBOUNCE_MS = 500;

/**
 * Mirrors the zustand cart between the browser and the server.
 *
 * Ordering rules that MATTER (and cost us an hour to nail down):
 *   1. Zustand persist rehydrates asynchronously in v5. If we setState from
 *      a server fetch BEFORE persist finishes rehydrating, persist will
 *      run its `merge` callback afterwards and overwrite our setState with
 *      whatever localStorage had. So we wait for `hasHydrated()` first.
 *   2. On logout we also do an immediate, synchronous clear before the fetch
 *      round-trip. Otherwise the UI would show old items for 50–200ms while
 *      the fetch is in flight. Same principle applies on the anonymous side:
 *      logout means "this browser is no longer you," and its cart identity
 *      resets to the anonymous cookie (which was cleared during the login
 *      merge, so effectively empty).
 *
 * Renders nothing.
 */
export function CartSync() {
  const { status } = useSession();
  const hydratedRef = useRef(false);
  const prevStatusRef = useRef<typeof status | null>(null);

  // (a) Instant clear on logout — no waiting for network.
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = status;
    if (prev === "authenticated" && status === "unauthenticated") {
      useCartStore.setState({ items: [] });
    }
  }, [status]);

  // (b) Server reconciliation: on mount and every session-status change,
  //     fetch /api/cart and set local items to whatever the server says.
  useEffect(() => {
    if (status === "loading") return;

    let cancelled = false;

    (async () => {
      // Wait for zustand persist to finish rehydrating from localStorage.
      // If we don't, its post-hydration `merge` may overwrite our setState
      // with the stale persisted items.
      if (!useCartStore.persist.hasHydrated()) {
        await new Promise<void>((resolve) => {
          const unsub = useCartStore.persist.onFinishHydration(() => {
            unsub();
            resolve();
          });
        });
      }
      if (cancelled) return;

      hydratedRef.current = false;

      try {
        const res = await fetch("/api/cart", { credentials: "same-origin" });
        if (!res.ok) return;
        const { items } = (await res.json()) as { items: CartItem[] };
        if (cancelled) return;
        useCartStore.setState({ items });
      } catch (err) {
        console.error("[cart-sync] hydration failed:", err);
      } finally {
        if (!cancelled) hydratedRef.current = true;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status]);

  // (c) Push local mutations to server (debounced).
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const unsub = useCartStore.subscribe((state, prev) => {
      if (!hydratedRef.current) return;
      if (state.items === prev.items) return;

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        void fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ items: state.items }),
        }).catch((err) => {
          console.error("[cart-sync] POST failed:", err);
        });
      }, SYNC_DEBOUNCE_MS);
    });

    return () => {
      unsub();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}
