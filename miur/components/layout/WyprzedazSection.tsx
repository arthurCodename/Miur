"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductCardCartButton } from "@/components/catalog/ProductCardCartButton";
import {
  pillMarkerTypography,
  productImageTagPromo,
  productImageTagShell,
} from "@/lib/ui/pill-marker-classes";
import type { BestsellerProduct, SaleCategoryTile } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const seeAllLinkClass =
  "inline-flex flex-col items-stretch gap-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white outline-none rounded-sm transition-colors duration-500 hover:text-zinc-400 focus-visible:text-white focus-visible:underline focus-visible:underline-offset-4";

const carouselArrowBtnDarkClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-500 hover:border-white hover:bg-white hover:text-zinc-950";

type Props = {
  tiles: SaleCategoryTile[];
  products: BestsellerProduct[];
};

export function WyprzedazSection({ tiles, products }: Props) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const tilesScrollRef = useRef<HTMLDivElement>(null);
  const productsScrollRef = useRef<HTMLDivElement>(null);

  const scrollTilesBy = useCallback((direction: "left" | "right") => {
    const el = tilesScrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-carousel-card]")?.clientWidth ?? 300;
    const gap = 20;
    el.scrollBy({
      left: direction === "right" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  }, []);

  const scrollProductsBy = useCallback((direction: "left" | "right") => {
    const el = productsScrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-carousel-card]")?.clientWidth ?? 300;
    const gap = 24;
    el.scrollBy({
      left: direction === "right" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  }, []);

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
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollTilesBy("right")}
                aria-label="Następny kafelek wyprzedaży"
                className={carouselArrowBtnDarkClass}
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
            <Link href="/wyprzedaz" className={seeAllLinkClass}>
              Zobacz wszystko
              <span className="h-px w-full shrink-0 bg-current" aria-hidden />
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
              className="flex gap-5 overflow-x-auto overscroll-x-contain pb-2 snap-x snap-mandatory scroll-smooth [touch-action:pan-x_pan-y] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {tiles.map((tile, index) => (
                <Link
                  key={tile.title}
                  href={tile.href}
                  data-carousel-card
                  className="group relative aspect-3/4 shrink-0 snap-start overflow-hidden rounded-sm bg-zinc-900 ring-1 ring-white/10 transition-shadow duration-500 hover:ring-amber-500/35 md:aspect-4/5 w-[min(82vw,340px)] md:w-[min(320px,38vw)] lg:w-[min(360px,32vw)]"
                >
                  <Image
                    src={tile.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 2}
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
                      <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

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
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollProductsBy("right")}
                    aria-label="Następny produkt wyprzedaży"
                    className={carouselArrowBtnDarkClass}
                  >
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>
                <Link href="/wyprzedaz" className={`${seeAllLinkClass} sm:text-right`}>
                  Zobacz wszystko
                  <span className="h-px w-full shrink-0 bg-current" aria-hidden />
                </Link>
              </div>
            </div>

            <div
              id="wyprzedaz-products-carousel"
              ref={productsScrollRef}
              role="region"
              aria-label="Karuzela produktów wyprzedażowych"
              className={`flex gap-4 overflow-x-auto overscroll-x-contain pb-2 md:pb-24 snap-x snap-mandatory snap-always [touch-action:pan-x_pan-y] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:gap-8 ${prodScrollClass}`}
            >
              {products.map((product, index) => (
                <article
                  key={product.id}
                  data-carousel-card
                  className="group relative flex w-[min(72vw,240px)] shrink-0 snap-start snap-always flex-col sm:w-[min(46vw,260px)] md:w-[240px] md:hover:z-30 md:focus-within:z-30 lg:w-[260px]"
                >
                  <div className="relative mb-6 aspect-3/4 overflow-hidden rounded-sm bg-white shadow-xl shadow-black/30 ring-1 ring-white/10">
                    {product.tag ? (
                      <div className={cn(productImageTagShell, productImageTagPromo)}>
                        <span className={cn(pillMarkerTypography, "min-w-0 truncate")}>{product.tag}</span>
                      </div>
                    ) : null}

                    <Link
                      href={`/produkt/${product.slug}`}
                      className="absolute inset-0 z-0 block focus-visible:z-20 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-400 motion-safe:transition-opacity motion-safe:duration-700"
                      aria-describedby={`wyprzedaz-price-${product.id}`}
                    >
                      <Image
                        src={product.image}
                        alt={`${product.name} — zdjęcie produktu`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 2}
                        className="absolute inset-0 h-full w-full object-cover motion-safe:transition-opacity motion-safe:duration-700 group-hover:opacity-0 motion-reduce:group-hover:opacity-100"
                      />
                      <Image
                        src={product.hoverImage}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 motion-safe:transition-opacity motion-safe:duration-700 group-hover:opacity-100 motion-reduce:opacity-0"
                        aria-hidden
                      />
                    </Link>

                    <ProductCardCartButton
                      product={{
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        image: product.image,
                        category: product.category,
                        price: product.price,
                      }}
                    />
                  </div>

                  <div className="relative flex flex-col gap-1 px-0.5">
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

                    {product.oldPrice ? (
                      <span className="mt-1 text-[8px] uppercase tracking-tighter text-zinc-300">
                        {product.omnibus
                          ? `Najniższa cena z 30 dni przed obniżką: ${product.omnibus}`
                          : "Najniższa cena z 30 dni przed obniżką: uzupełnij w systemie (wymóg Omnibus)."}
                      </span>
                    ) : null}
                    {product.hygieneReturnExcluded !== false ? (
                      <p
                        className={cn(
                          "mt-2 rounded-sm border border-amber-500/30 bg-amber-500/10 p-2 text-[8px] font-medium leading-snug text-amber-100/95",
                          "transition-opacity duration-200",
                          "md:absolute md:left-0 md:right-0 md:top-full md:z-20 md:mt-1.5 md:shadow-lg md:shadow-black/40",
                          "md:opacity-0 md:invisible md:pointer-events-none",
                          "md:group-hover:visible md:group-hover:opacity-100 md:group-hover:pointer-events-auto",
                          "md:group-focus-within:visible md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto",
                        )}
                      >
                        Po otwarciu opakowania zwrot może być wykluczony (higiena, art. 38 pkt 5 UoPK).{" "}
                        <a className="underline underline-offset-1" href="/zwroty-reklamacje">
                          Więcej
                        </a>
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-6 text-center text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:hidden">
              Przesuń palcem, aby zobaczyć więcej
            </p>
          </div>
        )}
      </div>
    </section>
  );
}