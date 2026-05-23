import type { HTMLAttributes } from "react";
import { wildloopsWordmark } from "@/lib/brand/wildloops-wordmark-font";
import { cn } from "@/lib/utils";

export type MiurWordmarkProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Accessible name when the mark carries meaning (ignored if `decorative`). */
  title?: string;
  /** Omit from the accessibility tree (parent provides the name, e.g. link `aria-label`). */
  decorative?: boolean;
};

/**
 * Wordmark „Miur” w Wild Loops (self-host). Tekst zamiast SVG z opentype.js — ten sam kształt
 * co w pliku czcionki we wszystkich przeglądarkach.
 */
export function MiurWordmark({
  className,
  title = "Miur",
  decorative = false,
  ...props
}: MiurWordmarkProps) {
  return (
    <span
      className={cn(
        wildloopsWordmark.className,
        // Kompaktowy leading dla zwykłych przeglądarek; w Safari (WebKit)
        // jest podbijany do 1.3 przez @supports w app/globals.css.
        // Powód: Wild Loops ma bardzo wysokie pętle wykraczające poza
        // typoAscender, a WebKit klipuje glify do line-boxu. Bumpujemy
        // line-height tylko w Safari, żeby nie roznosić navbara/hero
        // na mobile w Chrome/Firefox/Androidzie.
        "brand-logo-wordmark inline-block shrink-0 overflow-visible font-bold leading-[1.08] tracking-normal text-current",
        className,
      )}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
      {...props}
    >
      <span aria-hidden={decorative ? undefined : true}>Miur</span>
    </span>
  );
}
