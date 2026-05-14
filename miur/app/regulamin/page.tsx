import type { Metadata } from "next";
import Link from "next/link";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { PrintButton } from "@/components/legal/PrintButton";
import { SellerDataBlock } from "@/components/legal/SellerDataBlock";
import { ODR_URL, sellerLegal } from "@/lib/legal/seller";

export const metadata: Metadata = {
  title: "Regulamin sklepu | Miur",
  description: "Regulamin świadczenia usług drogą elektroniczną oraz sprzedaży w sklepie Miur.",
};

const VERSION = "2026-05-03";

export default function TermsPage() {
  return (
    <div className="bg-white">
      <PageGradientHero title="Regulamin" eyebrow="Sklep internetowy Miur" />
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <header className="mb-12 border-b border-zinc-100 pb-8">
        <p className="text-sm text-zinc-600">Wersja z dnia: {VERSION}</p>
        <PrintButton />
      </header>

      <nav aria-label="Spis treści" className="mb-12 text-sm text-zinc-700">
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            <a href="#postanowienia" className="underline underline-offset-2">
              Postanowienia ogólne
            </a>
          </li>
          <li>
            <a href="#dane-sprzedawcy" className="underline underline-offset-2">
              Dane sprzedawcy
            </a>
          </li>
          <li>
            <a href="#wymagania" className="underline underline-offset-2">
              Wymagania techniczne
            </a>
          </li>
          <li>
            <a href="#zamowienia" className="underline underline-offset-2">
              Składanie zamówień
            </a>
          </li>
          <li>
            <a href="#ceny" className="underline underline-offset-2">
              Ceny i płatności
            </a>
          </li>
          <li>
            <a href="#dostawa" className="underline underline-offset-2">
              Dostawa
            </a>
          </li>
          <li>
            <a href="#odstapienie" className="underline underline-offset-2">
              Prawo odstąpienia
            </a>
          </li>
          <li>
            <a href="#wyjatki" className="underline underline-offset-2">
              Wyjątki od odstąpienia
            </a>
          </li>
          <li>
            <a href="#reklamacje" className="underline underline-offset-2">
              Reklamacje i rękojmia
            </a>
          </li>
          <li>
            <a href="#odr" className="underline underline-offset-2">
              ODR
            </a>
          </li>
          <li>
            <a href="#dane-osobowe" className="underline underline-offset-2">
              Ochrona danych
            </a>
          </li>
          <li>
            <a href="#wiek" className="underline underline-offset-2">
              Pełnoletność
            </a>
          </li>
        </ol>
      </nav>

      <article className="space-y-10 text-sm leading-relaxed text-zinc-700 print:text-black">
        <section id="postanowienia" className="scroll-mt-24">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">§1 Postanowienia ogólne</h2>
          <p>
            Sklep internetowy Miur prowadzony jest zgodnie z prawem polskim i prawem Unii Europejskiej.
            Regulamin określa zasady korzystania ze sklepu oraz zawierania umów sprzedaży na odległość.
          </p>
        </section>

        <section id="dane-sprzedawcy" className="scroll-mt-24">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">§2 Dane sprzedawcy</h2>
          <SellerDataBlock />
        </section>

        <section id="wymagania" className="scroll-mt-24">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">§3 Wymagania techniczne</h2>
          <p>
            Do korzystania ze sklepu wymagana jest przeglądarka internetowa obsługująca JavaScript oraz
            włączone pliki cookies (w zakresie niezbędnym). Zabrania się dostarczania treści o charakterze
            bezprawnym.
          </p>
        </section>

        <section id="zamowienia" className="scroll-mt-24">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">§4 Składanie zamówień</h2>
          <p>
            Zamówienie składasz poprzez dodanie produktów do koszyka i kliknięcie przycisku finalizacji
            płatności o treści wskazującej na obowiązek zapłaty (np. „Zamawiam i płacę”). Z chwilą potwierdzenia
            przyjęcia zamówienia przez Sprzedawcę dochodzi do zawarcia umowy (szczegóły w e-mailu
            potwierdzającym — po wdrożeniu backendu).
          </p>
        </section>

        <section id="ceny" className="scroll-mt-24">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">§5 Ceny i płatności</h2>
          <p>
            Ceny podane na stronie są cenami brutto (zawierają podatek VAT). Przy promocji wyświetlana jest
            informacja o najniższej cenie z 30 dni przed obniżką, o ile ma zastosowanie (wymóg Omnibus).
          </p>
        </section>

        <section id="dostawa" className="scroll-mt-24">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">§6 Dostawa</h2>
          <p>
            Koszty i przewidywany czas dostawy są podawane w procesie składania zamówienia przed jego
            złożeniem. Realizacja może odbywać się w modelu dropshipping — towar wysyłany jest pod marką
            nadawcy wskazaną przy checkout.
          </p>
        </section>

        <section id="odstapienie" className="scroll-mt-24">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">§7 Prawo odstąpienia od umowy</h2>
          <p>
            Konsument ma prawo odstąpić od umowy w terminie 14 dni kalendarzowych bez podania przyczyny.
            Wzór oświadczenia oraz instrukcje:{" "}
            <Link href="/zwroty-reklamacje#formularz-odstapienia" className="font-medium underline">
              Zwroty i reklamacje
            </Link>
            .
          </p>
        </section>

        <section id="wyjatki" className="scroll-mt-24">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">§8 Wyjątki od prawa odstąpienia</h2>
          <p>
            Zgodnie z art. 38 ustawy o prawach konsumenta prawo odstąpienia nie przysługuje m.in. w
            odniesieniu do produktów dostarczonych w zapieczętowanym opakowaniu, których po otwarciu nie można
            zwrócić ze względów higieny lub ochrony zdrowia, jeżeli opakowanie zostało otwarte po dostarczeniu.
          </p>
        </section>

        <section id="reklamacje" className="scroll-mt-24">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">§9 Reklamacje i rękojmia</h2>
          <p>
            Reklamacje można zgłaszać na adres:{" "}
            <a className="underline" href={`mailto:${sellerLegal.email}`}>
              {sellerLegal.email}
            </a>
            . Sprzedawca rozpatruje reklamację w terminie 14 dni. Szczegóły:{" "}
            <Link href="/zwroty-reklamacje#reklamacje" className="underline">
              Zwroty i reklamacje
            </Link>
            .
          </p>
        </section>

        <section id="odr" className="scroll-mt-24">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">§10 Pozasądowe sposoby rozpatrywania reklamacji</h2>
          <p>
            Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń,
            w tym z platformy ODR:{" "}
            <a className="font-medium underline" href={ODR_URL}>
              {ODR_URL}
            </a>
            .
          </p>
        </section>

        <section id="dane-osobowe" className="scroll-mt-24">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">§11 Ochrona danych osobowych</h2>
          <p>
            Zasady przetwarzania danych osobowych określa{" "}
            <Link href="/polityka-prywatnosci" className="underline">
              Polityka prywatności
            </Link>
            .
          </p>
        </section>

        <section id="wiek" className="scroll-mt-24">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">§12 Pełnoletność</h2>
          <p>
            Sklep oferuje produkty dla dorosłych. Korzystanie ze sklepu i składanie zamówień jest dozwolone
            wyłącznie dla osób, które ukończyły 18 lat.
          </p>
        </section>
      </article>

      <p className="mt-12 text-center text-xs text-zinc-500 print:hidden">
        <Link href="/" className="underline underline-offset-2">
          Strona główna
        </Link>
      </p>
    </div>
    </div>
  );
}
