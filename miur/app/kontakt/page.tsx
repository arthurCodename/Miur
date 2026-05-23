import type { Metadata } from "next";
import Link from "next/link";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { SellerDataBlock } from "@/components/legal/SellerDataBlock";
import { ODR_URL, sellerLegal } from "@/lib/legal/seller";

export const metadata: Metadata = {
  title: "Kontakt | Miur",
  description: "Dane kontaktowe sklepu Miur oraz platforma ODR.",
};

export default function ContactPage() {
  return (
    <main className="bg-white">
      <PageGradientHero title="Kontakt" eyebrow="Obsługa klienta" />
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <p className="mt-4 text-sm text-zinc-600">
        Godziny pracy obsługi: poniedziałek–piątek, 8:00–16:00 (czas polski).
      </p>

      <div className="mt-10 space-y-4 text-sm text-zinc-700">
        <p>
          E-mail:{" "}
          <a className="font-semibold underline" href={`mailto:${sellerLegal.email}`}>
            {sellerLegal.email}
          </a>
        </p>
        {sellerLegal.phone ? (
          <p>
            Telefon:{" "}
            <a className="font-semibold underline" href={`tel:${sellerLegal.phone}`}>
              {sellerLegal.phone}
            </a>
          </p>
        ) : null}
      </div>

      <div id="dane-sprzedawcy" className="mt-10 scroll-mt-28">
        <h2 className="text-lg font-bold text-zinc-900">Dane sprzedawcy (UŚUDE art. 5)</h2>
        <div className="mt-4">
          <SellerDataBlock />
        </div>
      </div>

      <section className="mt-12 rounded-sm border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-700">
        <h2 className="text-lg font-bold text-zinc-900">Platforma ODR (UE)</h2>
        <p className="mt-2">
          Konsument ma możliwość skorzystania z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia
          roszczeń, w tym z unijnej platformy ODR:{" "}
          <a className="font-medium underline" href={ODR_URL}>
            {ODR_URL}
          </a>
          .
        </p>
      </section>

      <p className="mt-12 text-center text-xs text-zinc-500">
        <Link href="/" className="underline underline-offset-2">
          Strona główna
        </Link>
      </p>
    </div>
    </main>
  );
}
