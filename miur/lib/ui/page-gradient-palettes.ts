/**
 * Palety tła dla {@link PageGradientHero}: jasne, mało nasycone pastele (referencja UI).
 * Losowany indeks po montażu na kliencie — bez mismatch hydracji z SSR.
 */
export type GradientSchemeKind = "pastel" | "complementary" | "analogous" | "monochromatic";

export type PageGradientPalette = {
  kind: GradientSchemeKind;
  /** Główny gradient liniowy (jasne HSL, niska saturacja). */
  linear: string;
  /** Opcjonalny delikatny radial „wash” (normal blend). */
  glow?: { color: string; opacity: number };
};

export const PAGE_GRADIENT_PALETTES: PageGradientPalette[] = [
  /* — Pastel: błękit → biel → chłodny róż (diagonal jak w referencji) — */
  {
    kind: "pastel",
    linear:
      "linear-gradient(135deg, hsl(210 28% 94%) 0%, hsl(210 12% 98%) 32%, hsl(0 0% 100%) 52%, hsl(330 18% 97%) 78%, hsl(330 22% 95%) 100%)",
    glow: { color: "hsl(225 35% 93%)", opacity: 0.55 },
  },
  {
    kind: "pastel",
    linear:
      "linear-gradient(128deg, hsl(265 16% 95%) 0%, hsl(240 10% 98%) 38%, hsl(0 0% 100%) 55%, hsl(25 20% 96%) 100%)",
    glow: { color: "hsl(300 22% 94%)", opacity: 0.45 },
  },
  {
    kind: "pastel",
    linear:
      "linear-gradient(142deg, hsl(195 22% 94%) 0%, hsl(180 10% 97%) 40%, hsl(0 0% 100%) 58%, hsl(340 16% 96%) 100%)",
    glow: { color: "hsl(200 28% 93%)", opacity: 0.5 },
  },
  /* — Bardzo blade lawenda / brzoskwinia (jak lewy panel referencji) — */
  {
    kind: "pastel",
    linear:
      "linear-gradient(155deg, hsl(250 14% 96%) 0%, hsl(0 0% 100%) 45%, hsl(28 18% 96%) 100%)",
    glow: { color: "hsl(270 18% 95%)", opacity: 0.4 },
  },
  /* — Lawenda → róż → delikatna cytryna (mesh w jednym linear, nasycone tylko lekko) — */
  {
    kind: "pastel",
    linear:
      "linear-gradient(118deg, hsl(270 22% 94%) 0%, hsl(320 18% 96%) 35%, hsl(0 0% 100%) 52%, hsl(45 28% 96%) 88%, hsl(35 22% 95%) 100%)",
    glow: { color: "hsl(330 24% 94%)", opacity: 0.42 },
  },
  {
    kind: "pastel",
    linear:
      "linear-gradient(125deg, hsl(160 14% 95%) 0%, hsl(200 12% 97%) 42%, hsl(0 0% 100%) 62%, hsl(310 14% 96%) 100%)",
    glow: { color: "hsl(175 20% 93%)", opacity: 0.38 },
  },
];
