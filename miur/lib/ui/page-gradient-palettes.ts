/**
 * Palety tła dla {@link PageGradientHero}: komplementarne, analogowe, monochromatyczne.
 * Losowany indeks po montażu na kliencie (patrz komponent).
 */
export type GradientSchemeKind = "complementary" | "analogous" | "monochromatic";

export type PageGradientPalette = {
  kind: GradientSchemeKind;
  /** Główny gradient liniowy (HSL). */
  linear: string;
  /** Opcjonalny radial „glow” (HSL), blend multiply. */
  glow?: { color: string; opacity: number };
};

export const PAGE_GRADIENT_PALETTES: PageGradientPalette[] = [
  /* — Komplementarne (wysoki kontrast) — */
  {
    kind: "complementary",
    linear:
      "linear-gradient(128deg, hsl(218 72% 34%) 0%, hsl(218 55% 28%) 38%, hsl(28 92% 52%) 72%, hsl(18 90% 46%) 100%)",
    glow: { color: "hsl(52 100% 62%)", opacity: 0.22 },
  },
  {
    kind: "complementary",
    linear:
      "linear-gradient(135deg, hsl(265 58% 38%) 0%, hsl(200 70% 36%) 45%, hsl(38 96% 54%) 100%)",
    glow: { color: "hsl(330 85% 72%)", opacity: 0.18 },
  },
  {
    kind: "complementary",
    linear:
      "linear-gradient(118deg, hsl(168 65% 32%) 0%, hsl(152 50% 28%) 40%, hsl(8 82% 48%) 85%, hsl(350 75% 42%) 100%)",
    glow: { color: "hsl(95 90% 58%)", opacity: 0.2 },
  },
  /* — Analogowe (sąsiednie barwy) — */
  {
    kind: "analogous",
    linear:
      "linear-gradient(125deg, hsl(212 70% 38%) 0%, hsl(198 65% 40%) 35%, hsl(185 58% 42%) 70%, hsl(172 52% 38%) 100%)",
    glow: { color: "hsl(230 100% 75%)", opacity: 0.2 },
  },
  {
    kind: "analogous",
    linear:
      "linear-gradient(130deg, hsl(285 55% 36%) 0%, hsl(305 48% 40%) 38%, hsl(325 52% 44%) 72%, hsl(340 48% 40%) 100%)",
    glow: { color: "hsl(270 90% 70%)", opacity: 0.16 },
  },
  {
    kind: "analogous",
    linear:
      "linear-gradient(122deg, hsl(42 88% 46%) 0%, hsl(32 90% 48%) 34%, hsl(22 88% 50%) 68%, hsl(12 85% 46%) 100%)",
    glow: { color: "hsl(55 100% 68%)", opacity: 0.18 },
  },
  /* — Monochromatyczne (jedna barwa, różna jasność) — */
  {
    kind: "monochromatic",
    linear:
      "linear-gradient(135deg, hsl(240 45% 22%) 0%, hsl(240 38% 32%) 45%, hsl(240 32% 44%) 100%)",
    glow: { color: "hsl(240 55% 58%)", opacity: 0.25 },
  },
  {
    kind: "monochromatic",
    linear:
      "linear-gradient(125deg, hsl(160 42% 20%) 0%, hsl(160 38% 32%) 50%, hsl(160 35% 46%) 100%)",
    glow: { color: "hsl(165 50% 55%)", opacity: 0.22 },
  },
  {
    kind: "monochromatic",
    linear:
      "linear-gradient(130deg, hsl(320 42% 24%) 0%, hsl(320 38% 36%) 48%, hsl(320 32% 48%) 100%)",
    glow: { color: "hsl(315 55% 62%)", opacity: 0.2 },
  },
];
