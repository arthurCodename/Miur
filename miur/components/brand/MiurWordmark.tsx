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
        // leading-[1.25] zapewnia miejsce na wysokie ascendery Wild Loops
        // (pętle nad „M", „i", „u"). Safari obcina glify gdy leading < ~1.2;
        // Chrome/Firefox renderują je poza line-boxem, ale jednolity leading
        // = identyczny układ we wszystkich przeglądarkach.
        "brand-logo-wordmark inline-block shrink-0 overflow-visible font-bold leading-[1.25] tracking-normal text-current",
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
