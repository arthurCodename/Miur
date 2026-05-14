import localFont from "next/font/local";

/** Wild Loops Bold — ten sam plik co w `/public/fonts`, renderowany przez silnik tekstu (spójny Chrome / Safari). */
export const wildloopsWordmark = localFont({
  src: [
    { path: "../../public/fonts/wildloops-bold_w.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/wildloops-bold_w.woff", weight: "700", style: "normal" },
  ],
  weight: "700",
  style: "normal",
  display: "swap",
  adjustFontFallback: false,
});
