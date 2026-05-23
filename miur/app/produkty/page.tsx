import type { Metadata } from "next";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { getAllProducts } from "@/lib/api/products";
import { ProductCard } from "@/components/catalog/ProductCard";

export const metadata: Metadata = {
  title: "Wszystkie produkty — Miur",
  description: "Pełny katalog produktów w sklepie Miur.",
};

export default async function ProduktyPage() {
  const products = await getAllProducts();

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
