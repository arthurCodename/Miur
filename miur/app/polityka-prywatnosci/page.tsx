import type { Metadata } from "next";
import Link from "next/link";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { CookieSettingsLink } from "@/components/legal/CookieSettingsLink";
import { SellerDataBlock } from "@/components/legal/SellerDataBlock";
import { sellerLegal } from "@/lib/legal/seller";

export const metadata: Metadata = {
  title: "Polityka prywatności | Miur",
  description: "Informacje o przetwarzaniu danych osobowych w sklepie Miur (RODO).",
};

const UPDATED = "2026-05-03";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      <PageGradientHero title="Polityka prywatności" eyebrow="RODO" />
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <header className="mb-12 border-b border-zinc-100 pb-8">
        <p className="text-sm text-zinc-600">Ostatnia aktualizacja: {UPDATED}</p>
        <div className="mt-6">
          <CookieSettingsLink />
        </div>
      </header>

      <nav aria-label="Spis treści" className="mb-12 rounded-sm bg-zinc-50 p-4 text-sm text-zinc-700">
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            <a className="underline underline-offset-2 hover:text-zinc-900" href="#administrator">
              Administrator danych
            </a>
          </li>
          <li>
            <a className="underline underline-offset-2 hover:text-zinc-900" href="#cele">
              Cele i podstawy prawne
            </a>
          </li>
          <li>
            <a className="underline underline-offset-2 hover:text-zinc-900" href="#odbiorcy">
              Odbiorcy danych
            </a>
          </li>
          <li>
            <a className="underline underline-offset-2 hover:text-zinc-900" href="#prawa">
              Prawa osoby, której dane dotyczą
            </a>
          </li>
          <li>
            <a className="underline underline-offset-2 hover:text-zinc-900" href="#cookies">
              Pliki cookies
            </a>
          </li>
          <li>
            <a className="underline underline-offset-2 hover:text-zinc-900" href="#poza-ue">
              Przekazywanie poza UE
            </a>
          </li>
          <li>
            <a className="underline underline-offset-2 hover:text-zinc-900" href="#skarga">
              Skarga do UODO
            </a>
          </li>
        </ol>
      </nav>

      <article className="space-y-10 text-sm leading-relaxed text-zinc-700">
        <section id="administrator" className="scroll-mt-24">
          <h2 className="mb-3 text-lg font-bold text-zinc-900">1. Administrator danych</h2>
          <SellerDataBlock />
          <p className="mt-4">
            W sprawach związanych z ochroną danych osobowych możesz kontaktować się z nami pod adresem:{" "}
            <a className="font-medium underline" href={`mailto:${sellerLegal.email}`}>
              {sellerLegal.email}
            </a>
            .
          </p>
        </section>

        <section id="cele" className="scroll-mt-24">
          <h2 className="mb-3 text-lg font-bold text-zinc-900">2. Cele i podstawy prawne</h2>
          <div className="overflow-x-auto rounded-sm border border-zinc-200">
            <table className="min-w-full text-left text-xs md:text-sm">
              <thead className="bg-zinc-50 text-zinc-900">
                <tr>
                  <th className="p-3 font-semibold">Cel</th>
                  <th className="p-3 font-semibold">Dane</th>
                  <th className="p-3 font-semibold">Podstawa</th>
                  <th className="p-3 font-semibold">Okres</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="p-3">Realizacja zamówienia</td>
                  <td className="p-3">dane do wysyłki, e-mail, telefon</td>
                  <td className="p-3">art. 6 ust. 1 lit. b RODO (umowa)</td>
                  <td className="p-3">do czasu przedawnienia roszczeń / wymogi podatkowe</td>
                </tr>
                <tr>
                  <td className="p-3">Newsletter</td>
                  <td className="p-3">e-mail</td>
                  <td className="p-3">art. 6 ust. 1 lit. a RODO (zgoda)</td>
                  <td className="p-3">do cofnięcia zgody</td>
                </tr>
                <tr>
                  <td className="p-3">Cookies analityczne / marketingowe</td>
                  <td className="p-3">identyfikatory, IP (wg narzędzia)</td>
                  <td className="p-3">art. 6 ust. 1 lit. a RODO (zgoda)</td>
                  <td className="p-3">wg ustawień przeglądarki / do cofnięcia zgody</td>
                </tr>
                <tr>
                  <td className="p-3">Konto użytkownika</td>
                  <td className="p-3">login, historia zamówień</td>
                  <td className="p-3">art. 6 ust. 1 lit. b RODO</td>
                  <td className="p-3">do usunięcia konta</td>
                </tr>
                <tr>
                  <td className="p-3">Reklamacje / rękojmia</td>
                  <td className="p-3">dane zamówienia, korespondencja</td>
                  <td className="p-3">art. 6 ust. 1 lit. c RODO</td>
                  <td className="p-3">okres przechowywania dokumentów</td>
                </tr>
                <tr>
                  <td className="p-3">Kontakt</td>
                  <td className="p-3">e-mail, treść wiadomości</td>
                  <td className="p-3">art. 6 ust. 1 lit. f RODO (kontakt)</td>
                  <td className="p-3">do ustawienia wewnętrznie (np. 3 lata)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="odbiorcy" className="scroll-mt-24">
          <h2 className="mb-3 text-lg font-bold text-zinc-900">3. Odbiorcy danych</h2>
          <p>Dane mogą być przekazywane podmiotom wspierającym działanie sklepu, w tym m.in.:</p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Przelewy24 (DialCom24) — płatności,</li>
            <li>InPost — dostawy (ShipX),</li>
            <li>erotizo.pl — realizacja zamówień (dropshipping),</li>
            <li>Resend — wiadomości e-mail,</li>
            <li>Vercel — hosting frontendu,</li>
            <li>DigitalOcean — hosting bazy danych (UE),</li>
            <li>dostawcy analityki / reklamy — wyłącznie po wyrażeniu zgody w banerze cookies.</li>
          </ul>
        </section>

        <section id="prawa" className="scroll-mt-24">
          <h2 className="mb-3 text-lg font-bold text-zinc-900">4. Prawa</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>dostęp do danych (art. 15),</li>
            <li>sprostowanie (art. 16),</li>
            <li>usunięcie (art. 17),</li>
            <li>ograniczenie przetwarzania (art. 18),</li>
            <li>przenoszenie danych (art. 20),</li>
            <li>sprzeciw (art. 21),</li>
            <li>cofnięcie zgody w dowolnym momencie (art. 7 ust. 3),</li>
            <li>wniesienie skargi do Prezesa UODO.</li>
          </ul>
        </section>

        <section id="cookies" className="scroll-mt-24">
          <h2 className="mb-3 text-lg font-bold text-zinc-900">5. Pliki cookies</h2>
          <p>
            Używamy plików cookies niezbędnych oraz — po zgodzie — analitycznych i marketingowych. Szczegóły
            zapisu zgody (wersja, czas) przechowywane są lokalnie w przeglądarce. Możesz zmienić decyzję:
          </p>
          <p className="mt-4">
            <CookieSettingsLink />
          </p>
        </section>

        <section id="poza-ue" className="scroll-mt-24">
          <h2 className="mb-3 text-lg font-bold text-zinc-900">6. Przekazywanie poza Europejski Obszar Gospodarczy</h2>
          <p>
            Jeżeli dostawca przetwarza dane poza EOG (np. USA), stosujemy instrumenty zgodne z RODO (m.in.
            standardowe klauzule umowne lub decyzję Komisji o adekwatności, w tym EU–US Data Privacy Framework
            — w zależności od dostawcy i aktualnej dokumentacji).
          </p>
        </section>

        <section id="skarga" className="scroll-mt-24">
          <h2 className="mb-3 text-lg font-bold text-zinc-900">7. Skarga do organu nadzorczego</h2>
          <p>
            Urząd Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa,{" "}
            <a className="underline" href="https://uodo.gov.pl">
              uodo.gov.pl
            </a>
            .
          </p>
        </section>
      </article>

      <p className="mt-12 text-center text-xs text-zinc-500">
        <Link href="/" className="underline underline-offset-2">
          Strona główna
        </Link>
      </p>
    </div>
    </div>
  );
}
