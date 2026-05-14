/**
 * Palety tła dla {@link PageGradientHero}: pastele z wyraźniejszą chromą
 * (wyższa saturacja niż wcześniej, nadal jasne tło — kategorie, podstrony).
 * Losowany indeks po montażu na kliencie — bez mismatch hydracji z SSR.
 */
export type GradientSchemeKind = "pastel" | "complementary" | "analogous" | "monochromatic";

export type PageGradientPalette = {
  kind: GradientSchemeKind;
  /** Główny gradient liniowy (HSL: pastele z wyższą saturacją). */
  linear: string;
  /** Opcjonalny delikatny radial „wash”. */
  glow?: { color: string; opacity: number };
};

export const PAGE_GRADIENT_PALETTES: PageGradientPalette[] = [
  {
    kind: "pastel",
    linear:
      "linear-gradient(135deg, hsl(210 46% 90%) 0%, hsl(212 32% 94%) 28%, hsl(265 18% 97%) 48%, hsl(330 40% 92%) 76%, hsl(335 44% 90%) 100%)",
    glow: { color: "hsl(220 52% 88%)", opacity: 0.52 },
  },
  {
    kind: "pastel",
    linear:
      "linear-gradient(128deg, hsl(265 38% 91%) 0%, hsl(275 28% 94%) 34%, hsl(320 14% 97%) 52%, hsl(25 40% 92%) 100%)",
    glow: { color: "hsl(295 45% 89%)", opacity: 0.48 },
  },
  {
    kind: "pastel",
    linear:
      "linear-gradient(142deg, hsl(195 42% 89%) 0%, hsl(182 32% 93%) 38%, hsl(210 12% 98%) 56%, hsl(342 38% 91%) 100%)",
    glow: { color: "hsl(200 48% 87%)", opacity: 0.5 },
  },
  {
    kind: "pastel",
    linear:
      "linear-gradient(155deg, hsl(252 34% 91%) 0%, hsl(280 20% 96%) 42%, hsl(32 36% 92%) 100%)",
    glow: { color: "hsl(268 40% 90%)", opacity: 0.44 },
  },
  {
    kind: "pastel",
    linear:
      "linear-gradient(118deg, hsl(272 44% 89%) 0%, hsl(318 40% 91%) 32%, hsl(330 18% 97%) 50%, hsl(48 46% 90%) 86%, hsl(38 42% 89%) 100%)",
    glow: { color: "hsl(325 48% 90%)", opacity: 0.46 },
  },
  {
    kind: "pastel",
    linear:
      "linear-gradient(125deg, hsl(162 36% 90%) 0%, hsl(198 34% 92%) 40%, hsl(270 16% 96%) 58%, hsl(312 38% 91%) 100%)",
    glow: { color: "hsl(175 42% 88%)", opacity: 0.42 },
  },
];
