import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { SiteBreadcrumbBar } from "@/components/layout/SiteBreadcrumbBar";
import type { BestsellerProduct } from "@/lib/catalog/types";
import type { SiteBreadcrumbItem } from "@/lib/navigation/breadcrumb-types";
import { categoryBrowseHrefForProductCategory } from "@/lib/navigation/category-browse-href";

type ProductDetailSectionProps = {
  product: BestsellerProduct;
  breadcrumbTrail: SiteBreadcrumbItem[];
};

const INFO_LINKS = [
  { label: "Dostawa i płatność", href: "/dostawa-platnosc" },
  { label: "Zwroty i reklamacje", href: "/zwroty-reklamacje" },
  { label: "Dyskretna paczka", href: "/dyskretna-paczka" },
] as const;

function ProductInfoDisclosure({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group border-b border-zinc-200">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-900 marker:content-none [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span
          className="text-lg font-normal leading-none text-zinc-400 transition-transform duration-200 group-open:rotate-45"
          aria-hidden
        >
          +
        </span>
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-zinc-700 md:text-[15px] md:leading-[1.7]">
        {children}
      </div>
    </details>
  );
}

export function ProductDetailSection({ product, breadcrumbTrail }: ProductDetailSectionProps) {
  const categoryHref = categoryBrowseHrefForProductCategory(product.category);
  const showOmnibusLine = Boolean(product.oldPrice || product.omnibus);
  const omnibusLine = product.omnibus
    ? `Najniższa cena z 30 dni przed obniżką: ${product.omnibus}`
    : "Najniższa cena z 30 dni przed obniżką: uzupełnij w systemie (wymóg Omnibus).";

  return (
    <section className="border-b border-zinc-200 bg-white pt-24 md:pt-28">
      <div className="mx-auto max-w-6xl px-6 pb-12 md:px-12 md:pb-16 lg:pb-20">
        <SiteBreadcrumbBar items={breadcrumbTrail} className="mb-8 mt-2 md:mb-10 md:mt-6" />

        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="relative md:sticky md:top-28 md:self-start">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-sm bg-zinc-50">
              {product.tag ? (
                <span className="absolute left-4 top-4 z-10 rounded-full border border-zinc-900/10 bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 backdrop-blur-sm">
                  {product.tag}
                </span>
              ) : null}
              <Image
                src={product.image}
                alt={`${product.name} — zdjęcie produktu`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col">
            {categoryHref ? (
              <Link
                href={categoryHref}
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600 transition-colors hover:text-zinc-900"
              >
                {product.category}
              </Link>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">
                {product.category}
              </span>
            )}

            <h1 className="mt-3 text-3xl font-bold tracking-tighter text-zinc-900 uppercase text-balance md:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
              {product.name}
            </h1>

            <div className="mt-8 flex flex-wrap items-end gap-x-4 gap-y-2">
              <p className="text-3xl font-bold tracking-tight text-zinc-900 tabular-nums md:text-4xl">
                {product.price}
              </p>
              {product.oldPrice ? (
                <del className="pb-1 text-lg font-medium text-zinc-500 line-through md:text-xl">
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

            <div className="mt-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900">Opis</p>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-700 md:text-[15px] md:leading-[1.7]">
                Pełny opis tego produktu pojawi się tutaj po podpięciu CMS-a / katalogu produktów. W
                tym miejscu znajdzie się charakterystyka, materiały i wskazówki dotyczące pielęgnacji.
              </p>
            </div>

            <AddToCartButton
              className="mt-8 md:mt-10"
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
              }}
            />

            <div className="mt-10 md:mt-12">
              <ProductInfoDisclosure title="Pakowanie i prywatność">
                <p>
                  Wszystkie nasze produkty są pakowane dyskretnie, w neutralny karton bez logo Miur.
                  Przesyłki nadawane są pod nazwą &bdquo;Salgo&rdquo; — Twoja prywatność jest dla nas
                  priorytetem.
                </p>
              </ProductInfoDisclosure>

              {INFO_LINKS.map((item) => (
                <details key={item.href} className="group border-b border-zinc-200">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-900 marker:content-none [&::-webkit-details-marker]:hidden">
                    <span>{item.label}</span>
                    <span
                      className="text-lg font-normal leading-none text-zinc-400 transition-transform duration-200 group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <div className="pb-5">
                    <Link
                      href={item.href}
                      className="text-sm font-medium text-zinc-900 underline underline-offset-4 transition-colors hover:text-zinc-600"
                    >
                      Przejdź do strony: {item.label}
                    </Link>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
