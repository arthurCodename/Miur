import type { Metadata } from "next";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { MOCK_BESTSELLERS, MOCK_WYPRZEDAZ_PRODUCTS } from "@/lib/catalog/data/mock-products";
import type { BestsellerProduct } from "@/lib/catalog/types";

export const metadata: Metadata = {
  title: "Wszystkie produkty — Miur",
  description: "Pełny katalog produktów w sklepie Miur.",
};

function dedupeById(products: BestsellerProduct[]): BestsellerProduct[] {
  const seen = new Map<string, BestsellerProduct>();
  for (const p of products) {
    if (!seen.has(p.id)) seen.set(p.id, p);
  }
  return [...seen.values()];
}

export default function ProduktyPage() {
  const products = dedupeById([...MOCK_BESTSELLERS, ...MOCK_WYPRZEDAZ_PRODUCTS]);

  return (
    <main className="min-h-[50vh] bg-white">
      <PageGradientHero title="Wszystkie produkty" eyebrow="Katalog" />
      <div className="px-6 py-12 md:px-12 md:py-16">
      <header className="mx-auto mb-10 max-w-7xl md:mb-14">
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-700 md:text-base">
          Pełna oferta produktów Miur. Wybierz kategorię w menu lub przeglądaj wszystko poniżej.
        </p>
      </header>

      <div
        className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-16 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-20"
        aria-label="Pełny katalog produktów"
      >
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}
      </div>
      </div>
    </main>
  );
}
