import type { Metadata } from "next";
import Link from "next/link";
import { PageGradientHero } from "@/components/layout/PageGradientHero";

export const metadata: Metadata = {
  title: "Opinie o Miur",
  description: "Zasady publikacji opinii zgodnie z przepisami o transparentności cen i recenzji.",
};

export default function ReviewsPage() {
  return (
    <main className="bg-white">
      <PageGradientHero title="Opinie o Miur" eyebrow="Transparentność" />
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <p className="mt-4 text-sm leading-relaxed text-zinc-600">
        Opinie o produktach publikujemy wyłącznie po weryfikacji, że pochodzą od osób, które dokonały
        zakupu w sklepie Miur (np. po powiązaniu opinii z numerem zamówienia). Nie usuwamy opinii negatywnych,
        jeśli są zgodne z prawdą i nie naruszają prawa.
      </p>
      <p className="mt-4 text-sm text-zinc-600">
        Wdrożenie listy opinii nastąpi po uruchomieniu modułu zamówień — ta strona określa zasady zgodne z
        dyrektywą Omnibus i wytycznymi UOKiK.
      </p>
      <p className="mt-10 text-center text-sm">
        <Link href="/" className="underline underline-offset-2">
          Strona główna
        </Link>
      </p>
    </div>
    </main>
  );
}
