"use client";

import { useEffect, useState } from "react";
import {
  PAGE_GRADIENT_PALETTES,
  type PageGradientPalette,
} from "@/lib/ui/page-gradient-palettes";
import { cn } from "@/lib/utils";

export type PageGradientHeroProps = {
  /** Widoczny nagłówek strony (jedyny <h1> na stronie). */
  title: string;
  /** Opcjonalna etykieta nad tytułem (np. „Katalog”). */
  eyebrow?: string;
  className?: string;
  titleClassName?: string;
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
}: PageGradientHeroProps) {
  const [palette, setPalette] = useState<PageGradientPalette>(PAGE_GRADIENT_PALETTES[0]);

  useEffect(() => {
    const list = PAGE_GRADIENT_PALETTES;
    setPalette(list[Math.floor(Math.random() * list.length)] ?? list[0]);
  }, []);

  return (
    <section
      className={cn(
        "relative isolate w-full max-w-full overflow-hidden pt-24 md:pt-28",
        "min-h-[min(42vh,20rem)] md:min-h-[min(40vh,26rem)]",
        className,
      )}
      aria-labelledby="page-gradient-hero-title"
    >
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{ background: palette.linear }}
      />
      {palette.glow ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-1"
          style={{
            backgroundImage: `radial-gradient(ellipse 85% 70% at 25% 15%, ${palette.glow.color}, transparent 62%)`,
            opacity: palette.glow.opacity,
            mixBlendMode: "multiply",
          }}
        />
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-2 bg-linear-to-t from-black/55 via-black/20 to-black/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-3"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 80% 90%, rgba(255,255,255,0.12), transparent 55%)",
          mixBlendMode: "soft-light",
        }}
      />
      <div className="relative z-10 flex min-h-[inherit] flex-col justify-end px-6 pb-8 pt-10 md:px-12 md:pb-12 md:pt-14">
        {eyebrow ? (
          <p className="mb-2 max-w-3xl text-[10px] font-bold uppercase tracking-[0.28em] text-white/85 md:text-[11px]">
            {eyebrow}
          </p>
        ) : null}
        <h1
          id="page-gradient-hero-title"
          className={cn(
            "max-w-[min(92vw,56rem)] text-balance text-4xl font-bold uppercase leading-[0.95] tracking-tighter text-white",
            "drop-shadow-[0_2px_28px_rgba(0,0,0,0.42)] md:text-6xl lg:text-7xl",
            titleClassName,
          )}
        >
          {title}
        </h1>
      </div>
    </section>
  );
}
