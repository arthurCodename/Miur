"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "miur_age_verified";

export function AgeGate() {
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setVerified(localStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      setVerified(false);
    }
  }, []);

  if (verified !== false) return null;

  const confirm = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore */
    }
    setVerified(true);
  };

  const leave = () => {
    window.location.href = "https://www.google.pl";
  };

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-zinc-950 px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      <div className="max-w-md text-center">
        <h1 id="age-gate-title" className="mb-4 text-2xl font-bold text-white">
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
