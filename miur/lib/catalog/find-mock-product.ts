import { MOCK_BESTSELLERS, MOCK_WYPRZEDAZ_PRODUCTS } from "@/lib/catalog/data/mock-products";
import type { BestsellerProduct } from "@/lib/catalog/types";

const MOCK_PRODUCT_SOURCES: readonly BestsellerProduct[][] = [MOCK_BESTSELLERS, MOCK_WYPRZEDAZ_PRODUCTS];

export function findMockProductBySlug(slug: string): BestsellerProduct | undefined {
  for (const list of MOCK_PRODUCT_SOURCES) {
    const match = list.find((p) => p.slug === slug);
    if (match) return match;
  }
  return undefined;
}
