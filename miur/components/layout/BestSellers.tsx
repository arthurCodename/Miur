// Miur/miur/components/layout/BestSellers.tsx
"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/catalog/ProductCard";
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
        className="flex gap-4 md:gap-8 overflow-x-auto overscroll-x-contain snap-x snap-mandatory snap-always touch-pan-x pb-2 md:pb-24 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            data-carousel-card
            product={product}
            priority={index < 2}
            className="w-[min(72vw,240px)] shrink-0 snap-start snap-always sm:w-[min(46vw,260px)] md:w-[240px] lg:w-[260px]"
          />
        ))}
      </div>

      <p className="mt-6 text-center text-[10px] text-zinc-700 uppercase tracking-[0.25em] sm:hidden">
        Przesuń palcem, aby zobaczyć więcej
      </p>
    </section>
  );
}