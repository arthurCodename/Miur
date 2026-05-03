// Miur/miur/components/layout/CategoryGrid.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const seeAllLinkClass =
  "inline-block text-[10px] font-bold uppercase tracking-widest text-zinc-900 hover:opacity-50 focus-visible:opacity-50 transition-opacity duration-500 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 rounded-sm";

const carouselArrowBtnClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-900 transition-all duration-500 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white";

const categories = [
  {
    title: "Dla Niej",
    href: "/dla-niej",
    image: "https://images.unsplash.com/photo-1616012480717-fd9867059ca2?q=80&w=1200&auto=format&fit=crop",
    desc: "Odkryj swoją zmysłowość",
  },
  {
    title: "Dla Niego",
    href: "/dla-niego",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
    desc: "Męska strefa wellness",
  },
  {
    title: "Dla Par",
    href: "/dla-par",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    desc: "Wspólne chwile",
  },
  {
    title: "Zdrowie Seksualne",
    href: "/zdrowie-seksualne",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop",
    desc: "Zadbaj o siebie",
  },
  {
    title: "Drogeria",
    href: "/drogeria",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1200&auto=format&fit=crop",
    desc: "Pielęgnacja i wellness",
  },
  {
    title: "Akcesoria",
    href: "/akcesoria",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1200&auto=format&fit=crop",
    desc: "Dodatki i akcesoria",
  },
];

function useCarouselScrub(itemCount: number) {
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
  }, [updateScrollMetrics, itemCount]);

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
    el.scrollBy({ left: direction === "right" ? cardWidth + 24 : -(cardWidth + 24), behavior: "smooth" });
  };

  return { scrollerRef, canScroll, scrollPct, handleScrubChange, scrollBy };
}

export function CategoryGrid() {
  const { scrollerRef, canScroll, scrollPct, handleScrubChange, scrollBy } =
    useCarouselScrub(categories.length);

  return (
    <section className="w-full bg-white px-6 md:px-12 py-24 md:py-32">
      <div className="mb-10 md:mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">
            Kolekcje
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-zinc-900 uppercase">
            Wybierz swoją ścieżkę
          </h2>
        </div>
        <div className="flex items-center gap-4 self-start md:self-auto">
          {/* Стрілки навігації */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy("left")}
              aria-label="Poprzednia kategoria"
              className={carouselArrowBtnClass}
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              aria-label="Następna kategoria"
              className={carouselArrowBtnClass}
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <Link href="/produkty" className={seeAllLinkClass}>
            Zobacz wszystko
          </Link>
        </div>
      </div>

      <div
        ref={scrollerRef}
        role="region"
        aria-label="Kategorie produktów"
        className="flex gap-4 md:gap-6 overflow-x-auto overscroll-x-contain snap-x snap-mandatory snap-always touch-pan-x pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
      >
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            data-carousel-card
            className="group relative aspect-[3/4] overflow-hidden bg-zinc-100 flex shrink-0 snap-start w-[min(72vw,280px)] md:w-[min(28vw,320px)] lg:w-[min(22vw,300px)]"
          >
            <img
              src={category.image}
              alt={category.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-80" />
            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col">
              <span className="text-white/70 text-[9px] uppercase tracking-widest mb-2 font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                {category.desc}
              </span>
              <h3 className="text-white text-2xl uppercase tracking-[0.15em] font-bold">
                {category.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {canScroll && (
        <div className="mt-8">
          <label htmlFor="category-carousel-scrub" className="sr-only">
            Suwak przewijania kategorii
          </label>
          <input
            id="category-carousel-scrub"
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
    </section>
  );
}