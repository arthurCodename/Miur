/**
 * View model for the homepage bestseller carousel.
 * Map fields from your supplier XML / REST API into this shape in one place
 * (see `getBestsellers` and future adapter modules).
 */

export type BestsellerProduct = {
  /** Stable id from your shop or supplier (SKU / offer id) — string for XML safety */
  id: string;
  /** URL segment: `/produkt/[slug]` */
  slug: string;
  name: string;
  category: string;
  /** Already formatted for PL locale, e.g. "129,00 zł" */
  price: string;
  oldPrice: string | null;
  /** Omnibus line or null if not applicable */
  omnibus: string | null;
  /**
   * true = produkt może podlegać wyjątkowi od prawa odstąpienia po otwarciu opakowania (art. 38 pkt 5 UoPK).
   * Domyślnie true dla asortymentu wellness/intymnego Miur.
   */
  hygieneReturnExcluded?: boolean;
  image: string;
  /** Second image for hover; omit or duplicate primary if supplier sends one photo */
  hoverImage: string;
  tag: string | null;
};
