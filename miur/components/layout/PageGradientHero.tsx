"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  PAGE_GRADIENT_PALETTES,
  type PageGradientPalette,
} from "@/lib/ui/page-gradient-palettes";
import type { SiteBreadcrumbItem } from "@/lib/navigation/breadcrumb-types";
import { inferBreadcrumbTrailFromPathname } from "@/lib/navigation/infer-breadcrumb-trail";
import { SiteBreadcrumbBar } from "@/components/layout/SiteBreadcrumbBar";
import { cn } from "@/lib/utils";

export type PageGradientHeroProps = {
  /** Widoczny nagłówek strony (jedyny <h1> na stronie). */
  title: string;
  /** Opcjonalna etykieta nad tytułem (np. „Katalog”). */
  eyebrow?: string;
  className?: string;
  titleClassName?: string;
  /**
   * Okruszki: jawna ścieżka albo wyłączenie (`null`).
   * Gdy `undefined`, próba heurystyki z URL (bez `/produkt/[slug]` i `/blog/[slug]` — tam podaj jawnie).
   */
  breadcrumbTrail?: SiteBreadcrumbItem[] | null;
};

/**
 * Pełnoszerokowy baner jak na referencyjnym sklepie: gradient zamiast zdjęcia,
 * duży tytuł w dolnym lewym rogu. Paleta losowana po montażu (SSR = pierwsza paleta,
 * potem los na kliencie — bez mismatch hydracji).
 */
export function PageGradientHero({
  title,
  eyebrow,
  className,
  titleClassName,
  breadcrumbTrail,
}: PageGradientHeroProps) {
  const pathname = usePathname();
  const [palette, setPalette] = useState<PageGradientPalette>(PAGE_GRADIENT_PALETTES[0]);

  useEffect(() => {
    const list = PAGE_GRADIENT_PALETTES;
    setPalette(list[Math.floor(Math.random() * list.length)] ?? list[0]);
  }, []);

  const resolvedBreadcrumbs = useMemo(() => {
    if (breadcrumbTrail === null) return null;
    if (breadcrumbTrail && breadcrumbTrail.length > 0) return breadcrumbTrail;
    return inferBreadcrumbTrailFromPathname(pathname);
  }, [breadcrumbTrail, pathname]);

  return (
    <section
      className={cn(
        "relative w-full max-w-full overflow-hidden border-b border-black pt-24 md:pt-28",
        "min-h-[min(42vh,20rem)] md:min-h-[min(44vh,28rem)]",
        className,
      )}
      aria-labelledby="page-gradient-hero-title"
    >
      {/* Bazowy gradient — zawsze; WebKit źle interpoluje do słowa „transparent” (czarne smugi). */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 transform-gpu"
        style={{ background: palette.linear }}
      />
      {palette.glow ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-1 hidden md:block"
          style={{
            backgroundImage: `radial-gradient(ellipse 92% 72% at 22% 18%, ${palette.glow.color}, rgba(255,255,255,0) 68%)`,
            opacity: palette.glow.opacity,
          }}
        />
      ) : null}
      {/* Jedna prosta warstwa na mobile (WebKit) — bez radial + wielu blendów */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-1 md:hidden"
        style={{
          opacity: 0.4,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 52%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-2 hidden md:block"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 45%, rgba(24,24,27,0.035) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-3 hidden md:block"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 75% 55% at 85% 88%, rgba(255,255,255,0.42), rgba(255,255,255,0) 58%)",
        }}
      />
      <div className="relative z-10 flex min-h-[inherit] flex-col px-6 pb-8 pt-10 md:px-12 md:pb-12 md:pt-14">
        {resolvedBreadcrumbs && resolvedBreadcrumbs.length > 0 ? (
          <div className="mb-8 shrink-0 md:mb-10">
            <SiteBreadcrumbBar items={resolvedBreadcrumbs} />
          </div>
        ) : null}
        <div className="mt-auto">
          {eyebrow ? (
            <p className="mb-2 max-w-3xl text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-600 md:text-[11px]">
              {eyebrow}
            </p>
          ) : null}
          <h1
            id="page-gradient-hero-title"
            className={cn(
              "max-w-[min(92vw,56rem)] text-balance text-4xl font-bold uppercase leading-[0.95] tracking-tighter text-zinc-900",
              "md:text-7xl lg:text-[9rem]",
              titleClassName,
            )}
          >
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
