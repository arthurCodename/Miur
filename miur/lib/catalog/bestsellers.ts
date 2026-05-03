import type { BestsellerProduct } from "@/lib/catalog/types";

/**
 * Mock catalog — replace payload via `getBestsellers` once XML/API is wired.
 * Typical integration:
 * - Server: fetch XML → parse → map nodes to `BestsellerProduct`
 * - Or: fetch JSON API → map response DTO → `BestsellerProduct`
 */
export const MOCK_BESTSELLERS: BestsellerProduct[] = [
  {
    id: "1",
    slug: "aura-silk",
    name: "Aura Silk",
    category: "Wibratory",
    price: "349,00 zł",
    oldPrice: "420,00 zł",
    omnibus: "349,00 zł",
    image:
      "https://images.unsplash.com/photo-1583445095369-9c651e7e5d30?q=80&w=800&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1556229167-7313a29606fd?q=80&w=800&auto=format&fit=crop",
    tag: "Bestseller",
  },
  {
    id: "2",
    slug: "luna-essence",
    name: "Luna Essence",
    category: "Drogeria",
    price: "129,00 zł",
    oldPrice: null,
    omnibus: null,
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop",
    tag: "Nowość",
  },
  {
    id: "3",
    slug: "duo-pulse",
    name: "Duo Pulse",
    category: "Dla Par",
    price: "499,00 zł",
    oldPrice: "599,00 zł",
    omnibus: "499,00 zł",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1614859324967-bdf471bba55b?q=80&w=800&auto=format&fit=crop",
    tag: "Limited Edition",
  },
  {
    id: "4",
    slug: "velvet-touch",
    name: "Velvet Touch",
    category: "Akcesoria",
    price: "89,00 zł",
    oldPrice: null,
    omnibus: null,
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=800&auto=format&fit=crop",
    tag: null,
  },
  {
    id: "5",
    slug: "nori-bloom",
    name: "Nori Bloom",
    category: "Dla Niej",
    price: "219,00 zł",
    oldPrice: "259,00 zł",
    omnibus: "219,00 zł",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3c77a2c?q=80&w=800&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
    tag: "Promocja",
  },
  {
    id: "6",
    slug: "steel-form",
    name: "Steel Form",
    category: "Dla Niego",
    price: "179,00 zł",
    oldPrice: null,
    omnibus: null,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
    tag: null,
  },
  {
    id: "7",
    slug: "calm-line",
    name: "Calm Line",
    category: "Seksualne zdrowie",
    price: "59,00 zł",
    oldPrice: null,
    omnibus: null,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
    tag: "Nowość",
  },
  {
    id: "8",
    slug: "pure-mist",
    name: "Pure Mist",
    category: "Drogeria",
    price: "99,00 zł",
    oldPrice: "119,00 zł",
    omnibus: "99,00 zł",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
    tag: "Bestseller",
  },
];

/**
 * Single entry point for the homepage block.
 * Later: `fetch` from API, read XML from disk or blob, cache via `unstable_cache`, etc.
 */
export async function getBestsellers(): Promise<BestsellerProduct[]> {
  return MOCK_BESTSELLERS;
}
