import type { SVGProps } from "react";
import { MIUR_WORDMARK_PATH_D, MIUR_WORDMARK_VIEWBOX } from "@/lib/brand/miur-wordmark-path";
import { cn } from "@/lib/utils";

export type MiurWordmarkProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "children"> & {
  /** Accessible name when the mark carries meaning (ignored if `decorative`). */
  title?: string;
  /** Omit from the accessibility tree (parent provides the name, e.g. link `aria-label`). */
  decorative?: boolean;
};

/**
 * Vector wordmark “Miur” (outlines from Wild Loops Bold). Uses `fill: currentColor`
 * so `text-*` / `text-white` on an ancestor controls the paint — no webfont loading.
 */
export function MiurWordmark({
  className,
  title = "Miur",
  decorative = false,
  ...props
}: MiurWordmarkProps) {
  return (
    <svg
      viewBox={MIUR_WORDMARK_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0 fill-current", className)}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      {...props}
    >
      {!decorative ? <title>{title}</title> : null}
      <path d={MIUR_WORDMARK_PATH_D} />
    </svg>
  );
}
