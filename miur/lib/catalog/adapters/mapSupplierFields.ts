import type { BestsellerProduct } from "@/lib/catalog/types";

/**
 * Example normalisation layer between raw supplier data and `BestsellerProduct`.
 * Wire your XML parser or API client to build this input shape, then map once.
 */
export type SupplierProductLike = {
  externalId: string;
  slug?: string;
  name: string;
  categoryName?: string;
  /** Minor units or decimal — adjust to your feed */
  priceGross: number;
  oldPriceGross?: number | null;
  lowestPrice30dGross?: number | null;
  imageUrl: string;
  secondImageUrl?: string | null;
  label?: string | null;
};

function formatPln(amount: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Slug fallback when the feed has no dedicated slug field */
function slugify(name: string, id: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `item-${id}`;
}

export function mapSupplierProductToBestseller(
  raw: SupplierProductLike
): BestsellerProduct {
  const slug = raw.slug?.trim() || slugify(raw.name, raw.externalId);
  const hover =
    raw.secondImageUrl?.trim() || raw.imageUrl;

  return {
    id: raw.externalId,
    slug,
    name: raw.name,
    category: raw.categoryName ?? "",
    price: formatPln(raw.priceGross),
    oldPrice:
      raw.oldPriceGross != null && raw.oldPriceGross > raw.priceGross
        ? formatPln(raw.oldPriceGross)
        : null,
    omnibus:
      raw.lowestPrice30dGross != null
        ? formatPln(raw.lowestPrice30dGross)
        : null,
    image: raw.imageUrl,
    hoverImage: hover,
    tag: raw.label?.trim() || null,
  };
}
