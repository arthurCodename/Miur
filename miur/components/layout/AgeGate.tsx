"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

const STORAGE_KEY = "miur_age_verified";

/**
 * Reads the "age verified" flag from localStorage via useSyncExternalStore so
 * we don't need a setState-in-effect pattern.
 *  - Server snapshot: `null` (we don't know the value during SSR)
 *  - Client snapshot: `true` if user previously confirmed, otherwise `false`
 *
 * The `null` value is what lets us hide the gate on first paint instead of
 * flashing it for a frame before the localStorage read completes.
 */
function readVerifiedFromStorage(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function subscribeToStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function useAgeVerified(): boolean | null {
  return useSyncExternalStore(
    subscribeToStorage,
    readVerifiedFromStorage,
    () => null,
  );
}

export function AgeGate() {
  const verified = useAgeVerified();

  // During SSR or first paint: render nothing so the gate never flashes for users
  // who already confirmed their age.
  if (verified !== false) return null;

  const confirm = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore — Safari private mode etc. */
    }
    // Force re-render: dispatch a storage event so useSyncExternalStore picks it up.
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  };

  const leave = () => {
    window.location.href = "https://www.google.pl";
  };

  return (
    <div
      className="fixed inset-0 z-400 flex items-center justify-center bg-zinc-950 px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      <div className="max-w-md text-center">
        <h1 id="age-gate-title" className="brand-logo-wordmark mb-4 text-2xl font-bold font-(family-name:--font-logo) text-white">
          Miur
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-zinc-300">
          Sklep jest przeznaczony wyłącznie dla osób pełnoletnich (18+). Korzystając z serwisu potwierdzasz,
          że masz ukończone 18 lat.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={confirm}
            className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-zinc-200"
          >
            Mam 18 lat lub więcej
          </button>
          <button
            type="button"
            onClick={leave}
            className="rounded-full border border-zinc-600 px-6 py-3 text-sm text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white"
          >
            Nie — opuszczam stronę
          </button>
        </div>
        <p className="mt-8 text-[10px] text-zinc-500">
          Kontynuując akceptujesz{" "}
          <Link href="/regulamin" className="underline underline-offset-2 hover:text-zinc-300">
            Regulamin
          </Link>{" "}
          sklepu.
        </p>
      </div>
    </div>
  );
}
