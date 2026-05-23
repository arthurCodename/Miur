"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import { MiurWordmark } from "@/components/brand/MiurWordmark";

const STORAGE_KEY = "miur_age_verified";

/** Treści prawne muszą być dostępne bez potwierdzenia wieku (RODO / przejrzystość). */
const AGE_GATE_EXEMPT_PREFIXES = ["/polityka-prywatnosci", "/regulamin", "/dostepnosc"] as const;

function isAgeGateExemptPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return AGE_GATE_EXEMPT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Reads the "age verified" flag from localStorage via useSyncExternalStore.
 *  - Server snapshot: `null` (SSR — AgeGate i tak nie renderuje warstwy do czasu `useIsMounted`)
 *  - Client snapshot: `true` tylko po zapisie potwierdzenia 18+ w localStorage, inaczej `false`
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
  const pathname = usePathname();
  const isMounted = useIsMounted();

  // Brak warstwy 18+ w HTML SSR — po hydracji czytamy localStorage i pathname klienta.
  if (!isMounted) return null;

  // Tylko jawne `true` w localStorage = pełnoletni.
  if (verified === true) return null;

  // Strony wyłączone z weryfikacji wieku (regulamin, polityka, deklaracja dostępności).
  if (isAgeGateExemptPath(pathname)) return null;

  // verified === false | null — nawigacja po sklepie (także po wyjściu z /regulamin) wymaga 18+.

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
        <h1 id="age-gate-title" className="mb-10 flex justify-center pb-4 text-white">
          <MiurWordmark title="Miur" className="text-[clamp(1.48rem,5.3vw,2.12rem)]" />
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
