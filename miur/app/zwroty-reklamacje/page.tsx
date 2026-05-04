import type { Metadata } from "next";
import Link from "next/link";
import { ComplaintForm } from "@/components/legal/ComplaintForm";
import { WithdrawalForm } from "@/components/legal/WithdrawalForm";
import { SellerDataBlock } from "@/components/legal/SellerDataBlock";
import { sellerLegal } from "@/lib/legal/seller";

export const metadata: Metadata = {
  title: "Zwroty i reklamacje | Miur",
  description: "Prawo odstąpienia od umowy, wyjątki higieniczne, reklamacje i rękojmia.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tighter text-zinc-900">Zwroty i reklamacje</h1>
      <p className="mt-3 text-sm text-zinc-600">
        Poniżej znajdziesz informacje o prawie odstąpienia (14 dni), wyjątkach oraz reklamacjach i rękojmi.
      </p>

      <section className="mt-12 scroll-mt-24" aria-labelledby="withdrawal-heading">
        <h2 id="withdrawal-heading" className="text-xl font-bold text-zinc-900">
          Prawo odstąpienia od umowy (14 dni)
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-700">
          <p>
            Będąc konsumentem, masz prawo odstąpić od umowy zawartej na odległość w terminie{" "}
            <strong>14 dni kalendarzowych</strong> od objęcia w posiadanie towaru, bez podania przyczyny.
          </p>
          <p>
            Aby skorzystać z prawa odstąpienia, musisz poinformować Sprzedawcę o swojej decyzji jednoznacznym
            oświadczeniu (np. list, e-mail). Możesz użyć formularza poniżej lub wysłać oświadczenie na:{" "}
            <a className="underline" href={`mailto:${sellerLegal.email}`}>
              {sellerLegal.email}
            </a>
            .
          </p>
          <p>
            Zwrot środków nastąpi nie później niż w terminie 14 dni od dnia otrzymania oświadczenia o
            odstąpieniu, pod warunkami wskazanymi w ustawie o prawach konsumenta.
          </p>
        </div>

        <div className="mt-8 rounded-sm border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <h3 className="font-bold">Wyjątki — produkty higieniczne (art. 38 pkt 5 UoPK)</h3>
          <p className="mt-2 leading-relaxed">
            Prawo odstąpienia <strong>nie przysługuje</strong> w odniesieniu do produktów dostarczonych w
            zapieczętowanym opakowaniu, których po otwarciu opakowania nie można zwrócić ze względu na ochronę
            zdrowia lub ze względów higienicznych, jeżeli opakowanie zostało otwarte po dostarczeniu. Dotyczy
            m.in. wielu produktów wellness/intymnych — informacja jest widoczna także przy produktach w sklepie.
          </p>
        </div>

        <div id="formularz-odstapienia" className="scroll-mt-24">
          <h3 className="mt-10 text-lg font-bold text-zinc-900">Formularz odstąpienia (pomocniczy)</h3>
          <WithdrawalForm />
        </div>
      </section>

      <section id="reklamacje" className="mt-16 scroll-mt-24" aria-labelledby="complaints-heading">
        <h2 id="complaints-heading" className="text-xl font-bold text-zinc-900">
          Reklamacje i rękojmia
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-zinc-700">
          Sprzedawca odpowiada wobec konsumenta z tytułu rękojmi za wady fizyczne i prawne towaru na zasadach
          określonych w Kodeksie cywilnym (m.in. domniemanie istnienia wady w okresie roku). Reklamację możesz
          złożyć m.in. na adres e-mail Sprzedawcy.
        </p>
        <SellerDataBlock />
        <ComplaintForm />
      </section>

      <p className="mt-12 text-center text-xs text-zinc-500">
        <Link href="/kontakt" className="underline underline-offset-2">
          Kontakt
        </Link>{" "}
        ·{" "}
        <Link href="/" className="underline underline-offset-2">
          Strona główna
        </Link>
      </p>
    </div>
  );
}
