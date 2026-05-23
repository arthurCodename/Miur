import type { Metadata } from "next";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { getWyprzedazProducts } from "@/lib/catalog/wyprzedaz";

export const metadata: Metadata = {
  title: "Wyprzedaż — Miur",
  description: "Aktualne promocje i wyprzedaże w sklepie Miur.",
};

export default async function WyprzedazPage() {
  const products = await getWyprzedazProducts();

  return (
    <main className="min-h-[50vh] bg-white">
      <PageGradientHero title="Wyprzedaż" eyebrow="Promocje" />
      <div className="px-6 py-12 md:px-12 md:py-16">
      <header className="mx-auto mb-10 max-w-7xl md:mb-14">
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-700 md:text-base">
          Wybrane produkty w obniżonych cenach. Ceny zgodne z dyrektywą Omnibus — przy każdej promocji
          podajemy najniższą cenę z 30 dni przed obniżką.
        </p>
      </header>

      {products.length === 0 ? (
        <p className="mx-auto max-w-7xl text-sm text-zinc-600">
          Aktualnie nie prowadzimy promocji. Wróć tu wkrótce.
        </p>
      ) : (
        <div
          className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-16 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-20"
          aria-label="Produkty w promocji"
        >
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      )}
      </div>
    </main>
  );
}
