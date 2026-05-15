import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductReviews } from "@/components/catalog/ProductReviews";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { getProductBySlug } from "@/lib/api/products";
import { findMockProductBySlug } from "@/lib/catalog/find-mock-product";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = findMockProductBySlug(slug);
  if (!product) {
    return { title: "Produkt — Miur" };
  }
  return {
    title: `${product.name} — Miur`,
    description: `${product.category}: ${product.name}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const showOmnibusLine = Boolean(product.oldPrice || product.omnibus);
  const omnibusLine = product.omnibus
    ? `Najniższa cena z 30 dni przed obniżką: ${product.omnibus}`
    : "Najniższa cena z 30 dni przed obniżką: uzupełnij w systemie (wymóg Omnibus).";

  return (
    <main className="min-h-[50vh] bg-white">
      <PageGradientHero
        title={product.name}
        eyebrow={product.category}
        titleClassName="line-clamp-3 text-6xl md:text-8xl lg:text-[7.5rem]"
      />
      <div className="px-6 py-12 md:px-12 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-14 lg:gap-16">
        <div className="relative aspect-4/5 w-full overflow-hidden rounded-sm bg-zinc-50">
          <Image
            src={product.image}
            alt={`${product.name} — zdjęcie produktu`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">
            {product.category}
          </span>
          <p className="mt-3 text-3xl font-bold tracking-tighter text-zinc-900 uppercase md:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {product.name}
          </p>

          <div className="mt-8 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">{product.price}</span>
            {product.oldPrice ? (
              <del className="text-lg font-medium text-zinc-500 line-through md:text-xl">
                <span className="sr-only">Poprzednia cena: </span>
                {product.oldPrice}
              </del>
            ) : null}
          </div>

          {showOmnibusLine ? (
            <p className="mt-3 max-w-xl text-[10px] font-medium uppercase leading-relaxed tracking-tighter text-zinc-600 md:text-[11px]">
              {omnibusLine}
            </p>
          ) : null}

          <AddToCartButton
            className="mt-10 md:mt-12"
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category,
            }}
          />

          <section className="mt-12 border-t border-zinc-100 pt-10 md:mt-14 md:pt-12" aria-labelledby="product-description-heading">
            <h2 id="product-description-heading" className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900">
              Opis
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-700 md:text-[15px] md:leading-[1.7]">
              <p>
                Pełny opis tego produktu pojawi się tutaj po podpięciu CMS-a / katalogu produktów. W tym miejscu
                znajdzie się charakterystyka, materiały, instrukcja użytkowania i wskazówki dotyczące pielęgnacji.
              </p>
              <p>
                Wszystkie nasze produkty są pakowane dyskretnie, w neutralny karton bez logo Miur. Przesyłki nadawane
                są pod nazwą &bdquo;Salgo&rdquo; — Twoja prywatność jest dla nas priorytetem.
              </p>
            </div>
          </section>
        </div>
      </div>

      <ProductReviews slug={slug} />
      </div>
    </main>
  );
}
