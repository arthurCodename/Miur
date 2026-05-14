// Miur/miur/components/layout/Footer.tsx
import Link from "next/link";
import { CookieSettingsLink } from "@/components/legal/CookieSettingsLink";
import { FooterLogoutButton } from "@/components/layout/FooterLogoutButton";
import { FooterNewsletter } from "@/components/layout/FooterNewsletter";
import { MiurWordmark } from "@/components/brand/MiurWordmark";
import { ODR_URL, sellerLegal } from "@/lib/legal/seller";

export function Footer() {
  return (
    <footer className="relative isolate flex min-w-0 max-w-full flex-col items-center overflow-x-clip border-t border-zinc-100 bg-white px-6 pb-12 pt-24 font-sans text-zinc-900 lg:px-12">
      <div className="mb-24 flex w-full max-w-xl flex-col items-center text-center">
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 md:text-[11px]">
          Mamy dla Ciebie bonus
        </h3>
        <p className="mb-8 text-sm text-zinc-600 md:text-base">
          Zapisz się do newslettera i odbierz 10zł zniżki na pierwsze zakupy
        </p>

        <FooterNewsletter />
      </div>

      <div className="mb-24 grid w-full max-w-6xl grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="flex flex-col">
          <span className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900">
            Potrzebujesz pomocy?
          </span>
          <span className="mb-2 text-xs text-zinc-500">Pn-Pt 8:00-16:00</span>
          <a
            href={`mailto:${sellerLegal.email}`}
            className="text-xs font-medium text-zinc-800 transition-colors hover:text-black"
          >
            {sellerLegal.email}
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
          <Link href="/dostepnosc" className="text-xs text-zinc-500 transition-colors hover:text-black">
            Deklaracja dostępności
          </Link>
          <Link href="/blog" className="text-xs text-zinc-500 transition-colors hover:text-black">
            Blog
          </Link>
          <Link
            href="/program-partnerski"
            className="text-xs text-zinc-500 transition-colors hover:text-black"
          >
            Program partnerski
          </Link>
          <Link href="/opinie" className="text-xs text-zinc-500 transition-colors hover:text-black">
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
          <Link href="/logowanie" className="text-xs text-zinc-500 transition-colors hover:text-black">
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
          <FooterLogoutButton />
        </div>

        <div className="flex flex-col gap-3">
          <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900">
            Obsługa klienta
          </span>
          <Link href="/kontakt" className="text-xs text-zinc-500 transition-colors hover:text-black">
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

      <p className="mb-10 max-w-2xl px-4 text-center text-[10px] leading-relaxed text-zinc-500 md:mb-14">
        <span className="text-zinc-600">Dane sprzedawcy (m.in. NIP, REGON):</span>{" "}
        <Link href="/kontakt#dane-sprzedawcy" className="font-medium text-zinc-700 underline underline-offset-2 hover:text-zinc-900">
          Kontakt
        </Link>
        {" · "}
        <Link href="/regulamin#dane-sprzedawcy" className="font-medium text-zinc-700 underline underline-offset-2 hover:text-zinc-900">
          Regulamin §2
        </Link>
        {" · "}
        <a href={ODR_URL} className="font-medium text-zinc-700 underline underline-offset-2 hover:text-zinc-900">
          ODR (UE)
        </a>
        {" · "}
        <CookieSettingsLink className="inline text-[10px] font-medium text-zinc-700 underline underline-offset-2 hover:opacity-80" />
      </p>

      <div className="flex w-full max-w-full flex-col items-center overflow-x-clip px-2 py-12 md:py-20">
        <span className="inline-flex max-w-full select-none px-4 text-zinc-900 md:px-10">
          <MiurWordmark title="Miur" className="text-[min(10.7vw,14.75rem)] leading-none md:text-[min(6.55vw,9.85rem)]" />
        </span>
      </div>

      <div className="mt-6 px-4 pb-2 text-center text-[9px] uppercase leading-relaxed tracking-widest text-zinc-500 md:mt-10">
        © {new Date().getFullYear()} MIUR. WSZELKIE PRAWA ZASTRZEŻONE.
      </div>
    </footer>
  );
}
