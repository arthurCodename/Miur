import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SortSelect } from "@/components/catalog/SortSelect";
import { Skeleton } from "@/components/ui/skeleton";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { getCategoryProducts } from "@/lib/api/products";
import { getCategoryBySlug } from "@/lib/catalog/category-by-slug";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return { title: "Kategoria — Miur" };
  }
  return {
    title: `${category.title} — Miur`,
    description: category.desc,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const result = await getCategoryProducts(slug, sort);
  if (!result) {
    notFound();
  }

  const { category, products } = result;

  return (
    <main className="min-h-[50vh] bg-white">
      <PageGradientHero title={category.title} eyebrow="Kategoria" />
      <div className="px-6 py-12 md:px-12 md:py-16">
      <header className="mx-auto mb-10 max-w-6xl md:mb-14">
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-700 md:text-base">{category.desc}</p>
      </header>

      {products.length === 0 ? (
        <p className="mx-auto max-w-6xl text-sm text-zinc-600">
          Brak produktów w tej kategorii (dane demo). Wróć później lub przejdź na stronę główną.
        </p>
      ) : (
        <>
          <div className="mx-auto mb-8 flex max-w-7xl justify-end md:mb-10">
            <Suspense
              fallback={<Skeleton className="h-11 w-[220px] max-w-full rounded-full" aria-hidden />}
            >
              <SortSelect />
            </Suspense>
          </div>
          <div
            className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-16 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-20"
            aria-label={`Produkty w kategorii ${category.title}`}
          >
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        </>
      )}
      </div>
    </main>
  );
}
