// Miur/miur/components/layout/BestSellers.tsx
"use client";

import { useRef } from "react";
import { ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MOCK_BESTSELLERS } from "@/lib/catalog/data/mock-products";
import type { BestsellerProduct } from "@/lib/catalog/types";

const seeAllLinkClass =

  "inline-flex flex-col items-stretch gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-900 hover:opacity-50 focus-visible:opacity-50 transition-opacity duration-500 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 rounded-sm";

const carouselArrowBtnClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-900 transition-all duration-500 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white";

export function BestSellers({
  products = MOCK_BESTSELLERS,
}: {
  products?: BestsellerProduct[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-carousel-card]")?.clientWidth ?? 260;
    el.scrollBy({ left: direction === "right" ? cardWidth + 32 : -(cardWidth + 32), behavior: "smooth" });
  };

  return (
    <section
      className="w-full bg-white px-6 md:px-12 py-24 md:py-32 border-t border-zinc-100"
      aria-labelledby="bestsellers-heading"
    >
      <div className="mb-10 md:mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-700 mb-4">
            Top Choice
          </span>
          <h2
            id="bestsellers-heading"
            className="text-3xl md:text-4xl font-bold tracking-tighter text-zinc-900 uppercase"
          >
            Nasze Bestsellery
          </h2>
        </div>
        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy("left")}
              aria-label="Poprzedni produkt"
              className={carouselArrowBtnClass}
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              aria-label="Następny produkt"
              className={carouselArrowBtnClass}
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          <Link href="/bestsellery" className={seeAllLinkClass}>
            Zobacz wszystko
            <span className="h-px w-full shrink-0 bg-zinc-900" aria-hidden />
          </Link>
        </div>
      </div>

      <div
        ref={scrollerRef}
        role="region"
        aria-label="Bestsellery, przewijana lista produktów"
        className="flex gap-4 md:gap-8 overflow-x-auto overscroll-x-contain snap-x snap-mandatory snap-always touch-pan-x pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
      >
        {products.map((product, index) => (
          <article
            key={product.id}
            data-carousel-card
            className="group flex shrink-0 snap-start snap-always flex-col w-[min(72vw,240px)] sm:w-[min(46vw,260px)] md:w-[240px] lg:w-[260px]"
          >
            <div className="relative aspect-3/4 overflow-hidden bg-zinc-50 mb-6">
              {product.tag && (
                <div className="absolute top-4 left-4 z-10 bg-white px-3 py-1 rounded-full shadow-sm">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-black">
                    {product.tag}
                  </span>
                </div>
              )}
              <Image
                src={product.image}
                alt={`${product.name} — zdjęcie produktu`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 2}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
              />
              <Image
                src={product.hoverImage}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
              <button
                type="button"
                className="absolute bottom-4 left-4 right-4 z-10 bg-black text-white py-3 min-h-11 rounded-full translate-y-12 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label={`Dodaj ${product.name} do koszyka`}
              >
                <span className="flex items-center justify-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Do koszyka</span>
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-700">
                {product.category}
              </span>
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight mb-1">
                {product.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold text-black">{product.price}</span>
                {product.oldPrice && (
                  <del className="text-xs font-medium text-zinc-600 line-through">
                    <span className="sr-only">Poprzednia cena: </span>
                    {product.oldPrice}
                  </del>
                )}
              </div>
              {product.oldPrice ? (
                <span className="mt-1 text-[8px] uppercase tracking-tighter text-zinc-600">
                  {product.omnibus
                    ? `Najniższa cena z 30 dni przed obniżką: ${product.omnibus}`
                    : "Najniższa cena z 30 dni przed obniżką: uzupełnij w systemie (wymóg Omnibus)."}
                </span>
              ) : null}
              {product.hygieneReturnExcluded !== false ? (
                <p className="mt-2 rounded-sm border border-amber-200/80 bg-amber-50/90 p-2 text-[8px] font-medium leading-snug text-amber-950">
                  Po otwarciu opakowania zwrot może być wykluczony ze względów higienicznych (art. 38 pkt 5
                  ustawy o prawach konsumenta). Szczegóły:{" "}
                  <a className="underline underline-offset-1" href="/zwroty-reklamacje">
                    Zwroty i reklamacje
                  </a>
                  .
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-6 text-center text-[10px] text-zinc-700 uppercase tracking-[0.25em] sm:hidden">
        Przesuń palcem, aby zobaczyć więcej
      </p>
    </section>
  );
}