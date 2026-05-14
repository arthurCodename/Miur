import type { Metadata } from "next";
import Link from "next/link";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { sellerLegal } from "@/lib/legal/seller";

export const metadata: Metadata = {
  title: "Deklaracja dostępności | Miur",
  description: "Deklaracja dostępności cyfrowej sklepu Miur (WCAG 2.1 poziom AA, EAA).",
};

const REVIEW = "2026-05-03";

export default function AccessibilityStatementPage() {
  return (
    <main className="bg-white">
      <PageGradientHero title="Deklaracja dostępności" eyebrow="WCAG · EAA" />
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <p className="text-sm text-zinc-600">Ostatni przegląd: {REVIEW}</p>

      <article className="mt-10 space-y-6 text-sm leading-relaxed text-zinc-700">
        <section>
          <h2 className="text-lg font-bold text-zinc-900">Zakres</h2>
          <p>
            Sklep internetowy Miur (frontend Next.js) dąży do zapewnienia dostępności cyfrowej na poziomie{" "}
            <strong>WCAG 2.1 poziom AA</strong> oraz wymagań wynikających z europejskich przepisów o
            dostępności (m.in. EAA dla usług e-commerce).
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-zinc-900">Stan zgodności</h2>
          <p>
            Trwają prace audytowe nad pełną zgodnością. W kodzie wdrożono m.in.: język strony{" "}
            <code className="rounded bg-zinc-100 px-1">lang=&quot;pl&quot;</code>, link pomijania nawigacji,
            etykiety formularzy, widoczny fokus klawiatury, baner cookies z atrybutami ARIA, deklarację
            zgody na newsletter z checkboxem, podstawowe strony prawne w HTML.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-zinc-900">Znane ograniczenia</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>osadzone widżety płatności (np. Przelewy24) — dostępność zależy od dostawcy,</li>
            <li>część materiałów zewnętrznych (np. zdjęcia dostawcy) — uzupełniane o opisy alternatywne.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold text-zinc-900">Zgłaszanie problemów</h2>
          <p>
            Prosimy o kontakt:{" "}
            <a className="font-medium underline" href={`mailto:${sellerLegal.email}`}>
              {sellerLegal.email}
            </a>
            . Postaramy się odpowiedzieć i zaproponować rozwiązanie.
          </p>
        </section>
      </article>

      <p className="mt-12 text-center text-xs text-zinc-500">
        <Link href="/" className="underline underline-offset-2">
          Strona główna
        </Link>
      </p>
    </div>
    </main>
  );
}
