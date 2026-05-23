import type { Metadata } from "next";
import { Frown } from "lucide-react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { SearchPageForm } from "@/components/search/SearchPageForm";
import { searchProducts } from "@/lib/api/products";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

function queryFromSearchParams(q: string | string[] | undefined): string {
  if (Array.isArray(q)) return q[0] ?? "";
  return typeof q === "string" ? q : "";
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const phrase = queryFromSearchParams(q).trim();
  return {
    title: phrase ? `Szukaj: ${phrase} — Miur` : "Szukaj — Miur",
    robots: { index: false, follow: false },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const queryRaw = queryFromSearchParams(q);
  const products = await searchProducts(queryRaw);

  return (
    <main className="min-h-[50vh] bg-white">
      <PageGradientHero title="Wyniki wyszukiwania" eyebrow="Szukaj" />
      <div className="px-6 py-12 md:px-12 md:py-16">
      <div className="mx-auto mb-8 max-w-7xl md:mb-10">
        <SearchPageForm initialQuery={queryRaw} />
      </div>
      <header className="mx-auto mb-10 max-w-7xl md:mb-14">
        {queryRaw.trim() ? (
          <p className="text-sm text-zinc-600">
            Fraza: <span className="font-medium text-zinc-900">&quot;{queryRaw.trim()}&quot;</span>
          </p>
        ) : (
          <p className="text-sm text-zinc-600">Wpisz frazę powyżej, aby zobaczyć wyniki.</p>
        )}
      </header>

      {/*
        Trzy stany:
        1) Brak zapytania w URL → nic nie pokazujemy poniżej (form sam zachęca).
        2) Zapytanie + 0 wyników → empty-state z ikoną.
        3) Zapytanie + wyniki → grid produktów.
      */}
      {!queryRaw.trim() ? null : products.length === 0 ? (
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50/80 px-8 py-14 text-center">
          <div className="rounded-full bg-zinc-200/80 p-4">
            <Frown className="size-12 text-zinc-500" strokeWidth={1.25} aria-hidden />
          </div>
          <p className="text-base font-medium leading-relaxed text-zinc-800">
            Nie znaleziono produktów dla:{" "}
            <span className="font-semibold text-zinc-950">&quot;{queryRaw.trim()}&quot;</span>
          </p>
        </div>
      ) : (
        <div
          className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-16 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-20"
          aria-label="Wyniki wyszukiwania"
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
