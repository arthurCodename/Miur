"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { reportClientError } from "@/lib/observability/report-error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError(error);
  }, [error]);

  return (
    <div className="bg-white">
      <PageGradientHero title="Coś poszło nie tak" eyebrow="Błąd" />
      <div className="mx-auto flex min-h-[40vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center md:py-24">
      <p className="text-sm text-zinc-600">
        Wystąpił nieoczekiwany problem. Spróbuj ponownie lub skontaktuj się z nami, jeśli sytuacja się
        powtarza.
      </p>
      {error.digest ? (
        <p className="mt-2 text-[10px] font-mono text-zinc-400">ID: {error.digest}</p>
      ) : null}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-zinc-900 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Spróbuj ponownie
        </button>
        <Link
          href="/kontakt"
          className="text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-900"
        >
          Kontakt
        </Link>
      </div>
    </div>
    </div>
  );
}
