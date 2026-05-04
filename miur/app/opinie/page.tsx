import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Opinie o Miur",
  description: "Zasady publikacji opinii zgodnie z przepisami o transparentności cen i recenzji.",
};

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tighter text-zinc-900">Opinie o Miur</h1>
      <p className="mt-6 text-sm leading-relaxed text-zinc-600">
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
  );
}
