import Link from "next/link";
import { PageGradientHero } from "@/components/layout/PageGradientHero";

export default function NotFound() {
  return (
    <div className="bg-white">
      <PageGradientHero title="Nie znaleziono strony" eyebrow="404" />
      <div className="mx-auto flex min-h-[40vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center md:py-20">
        <p className="text-sm text-zinc-600">
          Adres mógł się zmienić albo strona została przeniesiona. Wróć na stronę główną lub skontaktuj się z
          obsługą.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link
            href="/"
            className="rounded-full bg-zinc-900 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-zinc-800"
          >
            Strona główna
          </Link>
          <Link href="/kontakt" className="text-zinc-600 underline underline-offset-4 hover:text-zinc-900">
            Kontakt
          </Link>
          <Link
            href="/zwroty-reklamacje"
            className="text-zinc-600 underline underline-offset-4 hover:text-zinc-900"
          >
            Zwroty i reklamacje
          </Link>
        </div>
      </div>
    </div>
  );
}
