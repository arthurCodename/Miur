// Miur/miur/components/layout/BestSellers.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MOCK_BESTSELLERS } from "@/lib/catalog/bestsellers";
import type { BestsellerProduct } from "@/lib/catalog/types";

const seeAllLinkClass =
  "inline-block text-[10px] font-bold uppercase tracking-widest text-zinc-900 hover:opacity-50 focus-visible:opacity-50 transition-opacity duration-500 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 rounded-sm";

const carouselArrowBtnClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-900 transition-all duration-500 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white";

export function BestSellers({
  products = MOCK_BESTSELLERS,
}: {
  products?: BestsellerProduct[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  const updateScrollMetrics = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 1) {
      setCanScroll(false);
      setScrollPct(0);
      return;
    }
    setCanScroll(true);
    setScrollPct((el.scrollLeft / max) * 100);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setTimeout(updateScrollMetrics, 100);
    el.addEventListener("scroll", updateScrollMetrics, { passive: true });
    const ro = new ResizeObserver(updateScrollMetrics);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollMetrics);
      ro.disconnect();
    };
  }, [updateScrollMetrics]);

  const handleScrubChange = (value: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    el.scrollLeft = (value / 100) * max;
    setScrollPct(value);
  };

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
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">
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
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              aria-label="Następny produkt"
              className={carouselArrowBtnClass}
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <Link href="/bestsellery" className={seeAllLinkClass}>
            Zobacz wszystko
          </Link>
        </div>
      </div>

      <div
        ref={scrollerRef}
        role="region"
        aria-label="Bestsellery, przewijana lista produktów"
        className="flex gap-4 md:gap-8 overflow-x-auto overscroll-x-contain snap-x snap-mandatory snap-always touch-pan-x pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
      >
        {products.map((product) => (
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
              <img
                src={product.image}
                alt={`${product.name} — zdjęcie produktu`}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
                decoding="async"
              />
              <img
                src={product.hoverImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                decoding="async"
              />
              <button
                type="button"
                className="absolute bottom-4 left-4 right-4 z-10 bg-black text-white py-3 min-h-11 rounded-full translate-y-12 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label={`Dodaj ${product.name} do koszyka`}
              >
                <span className="flex items-center justify-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" aria-hidden />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Do koszyka</span>
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                {product.category}
              </span>
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight mb-1">
                {product.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold text-black">{product.price}</span>
                {product.oldPrice && (
                  <del className="text-xs text-zinc-400 font-medium line-through">
                    <span className="sr-only">Poprzednia cena: </span>
                    {product.oldPrice}
                  </del>
                )}
              </div>
              {product.omnibus && (
                <span className="text-[8px] text-zinc-400 mt-1 uppercase tracking-tighter">
                  Najniższa cena z 30 dni: {product.omnibus}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      {canScroll && (
        <div className="mt-8">
          <label htmlFor="bestsellers-scrub" className="sr-only">
            Suwak przewijania listy produktów
          </label>
          <input
            id="bestsellers-scrub"
            type="range"
            min={0}
            max={100}
            step={0.25}
            value={scrollPct}
            onChange={(e) => handleScrubChange(Number(e.target.value))}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(scrollPct)}
            className="category-carousel-scrub w-full min-h-11 py-2 cursor-pointer block"
          />
        </div>
      )}

      <p className="mt-6 text-center text-[10px] text-zinc-400 uppercase tracking-[0.25em] sm:hidden">
        Przesuń palcem lub użyj suwaka poniżej
      </p>
    </section>
  );
}