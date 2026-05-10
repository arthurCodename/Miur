// Miur/miur/components/layout/Footer.tsx
import Link from "next/link";
import { FooterLogoutButton } from "@/components/layout/FooterLogoutButton";
import { FooterNewsletter } from "@/components/layout/FooterNewsletter";
import { CookieSettingsLink } from "@/components/legal/CookieSettingsLink";
import { SellerDataBlock } from "@/components/legal/SellerDataBlock";
import { ODR_URL, sellerLegal } from "@/lib/legal/seller";

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

        <FooterNewsletter />
      </div>

      <div className="mb-16 w-full max-w-6xl rounded-sm border border-zinc-100 bg-zinc-50/60 p-6 md:p-8">
        <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900">
          Dane sprzedawcy (UŚUDE art. 5)
        </h3>
        <div className="text-left text-sm text-zinc-700">
          <SellerDataBlock />
        </div>
        <p className="mt-6 text-xs leading-relaxed text-zinc-600">
          Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji, w tym platformy ODR:{" "}
          <a className="font-medium underline underline-offset-2 hover:text-zinc-900" href={ODR_URL}>
            {ODR_URL}
          </a>
          .
        </p>
        <p className="mt-4 text-xs text-zinc-600">
          Preferencje cookies: <CookieSettingsLink />
        </p>
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

      <div className="mb-8 flex w-full items-center justify-center overflow-visible">
        <span className="brand-logo-wordmark select-none pr-4 pl-6 font-(family-name:--font-logo) text-[10vw] font-bold leading-none text-zinc-900 md:pl-10 md:text-[6vw]">
          Miur
        </span>
      </div>

      <div className="text-[9px] uppercase tracking-widest text-zinc-500">
        © {new Date().getFullYear()} MIUR. WSZELKIE PRAWA ZASTRZEŻONE.
      </div>
    </footer>
  );
}
