import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tighter text-zinc-900">Nie znaleziono strony</h1>
      <p className="mt-3 text-sm text-zinc-600">
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
  );
}
