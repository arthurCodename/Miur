// Miur/miur/components/layout/Footer.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative isolate flex flex-col items-center overflow-hidden border-t border-zinc-100 bg-white px-6 pb-12 pt-24 font-sans text-zinc-900 lg:px-12">
      <div className="mb-24 flex w-full max-w-xl flex-col items-center text-center">
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 md:text-[11px]">
          Mamy dla Ciebie bonus
        </h3>
        <p className="mb-8 text-sm text-zinc-600 md:text-base">
          Zapisz się do newslettera i odbierz 10zł zniżki na pierwsze zakupy
        </p>

        <form className="group relative mb-6 flex w-full max-w-sm items-center border-b border-zinc-400 pb-2 transition-colors duration-500 hover:border-black">
          <input
            type="email"
            placeholder="Twój adres e-mail:"
            required
            className="w-full bg-transparent text-[12px] tracking-wide outline-none transition-colors placeholder:text-zinc-500 focus:placeholder:text-zinc-900"
          />
          <button
            type="submit"
            className="text-zinc-500 transition-colors duration-300 group-hover:text-black"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.2} />
          </button>
        </form>

        <p className="max-w-md text-[9px] leading-relaxed text-zinc-500">
          Rabat -10 PLN aktywny w koszyku o wartości produktów min 150zł. Nie martw
          się, nie będziemy Cie spamować, a zrezygnować z newslettera możesz w
          każdej chwili. Sprawdź naszą{" "}
          <Link
            href="/polityka-prywatnosci"
            className="underline transition-colors hover:text-zinc-800"
          >
            politykę prywatności
          </Link>
          .
        </p>
      </div>

      <div className="mb-24 grid w-full max-w-6xl grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="flex flex-col">
          <span className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900">
            Potrzebujesz pomocy?
          </span>
          <span className="mb-2 text-xs text-zinc-500">Pn-Pt 8:00-16:00</span>
          <a
            href="mailto:pomoc@miur.pl"
            className="text-xs font-medium text-zinc-800 transition-colors hover:text-black"
          >
            pomoc@miur.pl
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900">
            Informacje
          </span>
          <Link
            href="/regulamin"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Regulamin
          </Link>
          <Link
            href="/polityka-prywatnosci"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Polityka prywatności
          </Link>
          <Link
            href="/blog"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Blog
          </Link>
          <Link
            href="/program-partnerski"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Program partnerski
          </Link>
          <Link
            href="/opinie"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Opinie o Miur
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900">
            Twoje konto
          </span>
          <Link
            href="/rejestracja"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Rejestracja
          </Link>
          <Link
            href="/logowanie"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Logowanie
          </Link>
          <Link
            href="/moje-konto/edycja"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Edycja konta
          </Link>
          <Link
            href="/lista-zyczen"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Lista życzeń, schowek
          </Link>
          <Link
            href="/moje-zamowienia"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Twoje zamówienia
          </Link>
          <button className="text-left text-xs text-zinc-500 transition-colors hover:text-black">
            Wyloguj
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900">
            Obsługa klienta
          </span>
          <Link
            href="/kontakt"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Kontakt
          </Link>
          <Link
            href="/dostawa-platnosc"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Dostawa / Płatność
          </Link>
          <Link
            href="/dyskretna-paczka"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Dyskretna paczka
          </Link>
          <Link
            href="/zwroty-reklamacje"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Zwroty i reklamacje
          </Link>
        </div>
      </div>

      <div className="mb-8 flex w-full items-center justify-center overflow-visible">
        <span className="select-none pr-4 pl-6 font-[family-name:var(--font-logo)] text-[10vw] font-bold leading-none tracking-tighter text-zinc-900 md:pl-10 md:text-[6vw]">
          Miur
        </span>
      </div>

      <div className="text-[9px] uppercase tracking-widest text-zinc-400">
        © {new Date().getFullYear()} MIUR. WSZELKIE PRAWA ZASTRZEŻONE.
      </div>
    </footer>
  );
}
