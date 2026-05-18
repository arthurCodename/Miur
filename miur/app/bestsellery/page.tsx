import type { Metadata } from "next";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getBestsellers } from "@/lib/catalog/bestsellers";

export const metadata: Metadata = {
  title: "Bestsellery — Miur",
  description: "Najczęściej wybierane produkty w sklepie Miur.",
};

export default async function BestselleryPage() {
  const products = await getBestsellers();

  return (
    <main className="min-h-[50vh] bg-white px-6 py-12 md:px-12 md:py-16">
      <header className="mx-auto mb-10 max-w-7xl md:mb-14">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Top Choice</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tighter text-zinc-900 uppercase md:text-4xl">
          Bestsellery
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-700 md:text-base">
          Najczęściej wybierane produkty w naszym sklepie — wszystkie z gwarancją autentyczności i dyskretnej
          wysyłki.
        </p>
      </header>

      <div
        className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4 lg:gap-x-8"
        aria-label="Lista bestsellerów"
      >
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}
      </div>
    </main>
  );
}
