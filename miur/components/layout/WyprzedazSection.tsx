// Miur/miur/components/layout/WyprzedazSection.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, ShoppingBag } from "lucide-react";
import type { BestsellerProduct } from "@/lib/catalog/types";
import type { SaleCategoryTile } from "@/lib/catalog/wyprzedaz";

const seeAllLinkClass =
  "inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-white outline-none rounded-sm transition-colors duration-500 hover:text-zinc-400 focus-visible:text-white focus-visible:underline focus-visible:underline-offset-4";

const carouselArrowBtnDarkClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-500 hover:border-white hover:bg-white hover:text-zinc-950";

type Props = {
  tiles: SaleCategoryTile[];
  products: BestsellerProduct[];
};

function useCarouselScrub(deps: unknown[]) {
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
    updateScrollMetrics();
    el.addEventListener("scroll", updateScrollMetrics, { passive: true });
    const ro = new ResizeObserver(updateScrollMetrics);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollMetrics);
      ro.disconnect();
    };
  }, [updateScrollMetrics, ...deps]);

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
    const cardWidth = el.querySelector("[data-carousel-card]")?.clientWidth ?? 300;
    const gap = 24;
    el.scrollBy({
      left: direction === "right" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  };

  return { scrollerRef, canScroll, scrollPct, handleScrubChange, scrollBy };
}

export function WyprzedazSection({ tiles, products }: Props) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const {
    scrollerRef: tilesScrollRef,
    canScroll: canScrollTiles,
    scrollPct: scrollPctTiles,
    handleScrubChange: onTilesScrubChange,
    scrollBy: scrollTilesBy,
  } = useCarouselScrub([tiles.length]);
  const {
    scrollerRef: productsScrollRef,
    canScroll: canScrollProducts,
    scrollPct: scrollPctProducts,
    handleScrubChange: onProductsScrubChange,
    scrollBy: scrollProductsBy,
  } = useCarouselScrub([products.length]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const prodScrollClass = reduceMotion ? "" : "scroll-smooth";

  if (tiles.length === 0 && products.length === 0) {
    return null;
  }

  return (
    <section
      className="relative w-full overflow-hidden border-y border-amber-500/25 bg-zinc-950 px-6 py-20 text-zinc-100 md:px-12 md:py-28"
      aria-labelledby="wyprzedaz-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-amber-950/35 via-zinc-950/80 to-zinc-950"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-[1600px]">
        <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col">
            <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-amber-400/90">
              Strefa okazji
            </span>
            <h2
              id="wyprzedaz-heading"
              className="text-3xl font-bold uppercase tracking-tighter text-white md:text-4xl"
            >
              Wyprzedaż
            </h2>
          </div>
          <div className="flex items-center gap-4 self-start md:self-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollTilesBy("left")}
                aria-label="Poprzedni kafelek wyprzedaży"
                className={carouselArrowBtnDarkClass}
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => scrollTilesBy("right")}
                aria-label="Następny kafelek wyprzedaży"
                className={carouselArrowBtnDarkClass}
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <Link href="/wyprzedaz" className={seeAllLinkClass}>
              Zobacz wszystko
            </Link>
          </div>
        </div>

        {tiles.length > 0 && (
          <div className="mb-16 md:mb-20">
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-400">
                Oferty i filtry
              </h3>
            </div>

            <div
              ref={tilesScrollRef}
              role="region"
              aria-label="Kafelki wyprzedaży"
              className="flex gap-5 overflow-x-auto overscroll-x-contain pb-2 snap-x snap-mandatory scroll-smooth touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {tiles.map((tile) => (
                <Link
                  key={tile.title}
                  href={tile.href}
                  data-carousel-card
                  className="group relative aspect-3/4 shrink-0 snap-start overflow-hidden rounded-sm bg-zinc-900 ring-1 ring-white/10 transition-shadow duration-500 hover:ring-amber-500/35 md:aspect-4/5 w-[min(82vw,340px)] md:w-[min(320px,38vw)] lg:w-[min(360px,32vw)]"
                >
                  <img
                    src={tile.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                  <div className="absolute bottom-0 left-0 flex w-full items-end justify-between gap-4 p-6 md:p-8">
                    <div className="min-w-0 flex flex-col">
                      <span className="mb-2 line-clamp-2 translate-y-2 text-[9px] font-medium uppercase tracking-widest text-white/75 transition-transform duration-500 group-hover:translate-y-0">
                        {tile.desc}
                      </span>
                      <span className="text-xl font-bold uppercase tracking-[0.12em] text-white md:text-2xl">
                        {tile.title}
                      </span>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white backdrop-blur-sm transition-all duration-500 group-hover:bg-white group-hover:text-zinc-950 md:h-12 md:w-12">
                      <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {canScrollTiles && (
              <div className="mt-8">
                <label htmlFor="wyprzedaz-tiles-scrub" className="sr-only">
                  Suwak listy kafelków wyprzedaży
                </label>
                <input
                  id="wyprzedaz-tiles-scrub"
                  type="range"
                  min={0}
                  max={100}
                  step={0.25}
                  value={scrollPctTiles}
                  onChange={(e) => onTilesScrubChange(Number(e.target.value))}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(scrollPctTiles)}
                  aria-label="Przewijanie kafelków wyprzedaży"
                  className="sale-carousel-scrub block min-h-11 w-full cursor-pointer py-2"
                />
              </div>
            )}
          </div>
        )}

        {products.length > 0 && (
          <div>
            <div className="mb-8 flex flex-col gap-4 border-t border-white/10 pt-12 sm:flex-row sm:items-center sm:justify-between md:pt-14">
              <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-400">
                Przecenione produkty
              </h3>
              <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollProductsBy("left")}
                    aria-label="Poprzedni produkt wyprzedaży"
                    className={carouselArrowBtnDarkClass}
                  >
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollProductsBy("right")}
                    aria-label="Następny produkt wyprzedaży"
                    className={carouselArrowBtnDarkClass}
                  >
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
                <Link href="/wyprzedaz" className={`${seeAllLinkClass} sm:text-right`}>
                  Zobacz wszystko
                </Link>
              </div>
            </div>

            <div
              id="wyprzedaz-products-carousel"
              ref={productsScrollRef}
              role="region"
              aria-label="Karuzela produktów wyprzedażowych"
              className={`flex gap-4 overflow-x-auto overscroll-x-contain pb-2 snap-x snap-mandatory snap-always touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:gap-8 ${prodScrollClass}`}
            >
              {products.map((product) => (
                <article
                  key={product.id}
                  data-carousel-card
                  className="group flex w-[min(72vw,240px)] shrink-0 snap-start snap-always flex-col sm:w-[min(46vw,260px)] md:w-[240px] lg:w-[260px]"
                >
                  <div className="relative mb-6 aspect-3/4 overflow-hidden rounded-sm bg-white shadow-xl shadow-black/30 ring-1 ring-white/10">
                    {product.tag && (
                      <div className="absolute left-4 top-4 z-10 rounded-full bg-amber-500 px-3 py-1 shadow-md">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-950">
                          {product.tag}
                        </span>
                      </div>
                    )}

                    <Link
                      href={`/produkt/${product.slug}`}
                      className="absolute inset-0 z-0 block focus-visible:z-20 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-400 motion-safe:transition-opacity motion-safe:duration-700"
                      aria-describedby={`wyprzedaz-price-${product.id}`}
                    >
                      <img
                        src={product.image}
                        alt={`${product.name} — zdjęcie produktu`}
                        width={800}
                        height={1067}
                        className="absolute inset-0 h-full w-full object-cover motion-safe:transition-opacity motion-safe:duration-700 group-hover:opacity-0 motion-reduce:group-hover:opacity-100"
                        decoding="async"
                      />
                      <img
                        src={product.hoverImage}
                        alt=""
                        width={800}
                        height={1067}
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 motion-safe:transition-opacity motion-safe:duration-700 group-hover:opacity-100 motion-reduce:opacity-0"
                        decoding="async"
                        aria-hidden
                      />
                    </Link>

                    <button
                      type="button"
                      className="absolute bottom-4 left-4 right-4 z-10 flex min-h-11 translate-y-12 items-center justify-center rounded-full bg-zinc-950 py-3 text-white opacity-0 motion-safe:transition-all motion-safe:duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      aria-label={`Dodaj ${product.name} do koszyka`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingBag className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        <span className="text-[9px] font-bold uppercase tracking-widest">
                          Do koszyka
                        </span>
                      </span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-1 px-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                      {product.category}
                    </span>
                    <h4 className="mb-1 text-sm font-bold tracking-tight text-white">
                      <Link
                        href={`/produkt/${product.slug}`}
                        className="rounded-sm hover:text-amber-200/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                        id={`wyprzedaz-title-${product.id}`}
                      >
                        {product.name}
                      </Link>
                    </h4>

                    <div
                      id={`wyprzedaz-price-${product.id}`}
                      className="flex flex-wrap items-center gap-3"
                    >
                      <span className="text-sm font-bold text-amber-100">{product.price}</span>
                      {product.oldPrice && (
                        <del className="text-xs font-medium text-zinc-500 line-through">
                          <span className="sr-only">Poprzednia cena: </span>
                          {product.oldPrice}
                        </del>
                      )}
                    </div>

                    {product.omnibus && (
                      <span className="mt-1 text-[8px] uppercase tracking-tighter text-zinc-500">
                        Najniższa cena z 30 dni: {product.omnibus}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {canScrollProducts && (
              <div className="mt-8">
                <label htmlFor="wyprzedaz-products-scrub" className="sr-only">
                  Suwak listy produktów wyprzedaży
                </label>
                <input
                  id="wyprzedaz-products-scrub"
                  type="range"
                  min={0}
                  max={100}
                  step={0.25}
                  value={scrollPctProducts}
                  onChange={(e) => onProductsScrubChange(Number(e.target.value))}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(scrollPctProducts)}
                  aria-valuetext={`Przewinięto około ${Math.round(scrollPctProducts)} procent`}
                  aria-label="Pozycja przewijania produktów wyprzedażowych"
                  className="sale-carousel-scrub block min-h-11 w-full cursor-pointer py-2"
                />
              </div>
            )}

            <p className="mt-6 text-center text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:hidden">
              Przesuń palcem lub użyj suwaka
            </p>
          </div>
        )}
      </div>
    </section>
  );
}