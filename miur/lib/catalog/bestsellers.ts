import type { BestsellerProduct } from "@/lib/catalog/types";
import { MOCK_BESTSELLERS } from "@/lib/catalog/data/mock-products";

/**
 * Single entry point for the homepage block.
 * Later: `fetch` from API, read XML from disk or blob, cache via `unstable_cache`, etc.
 */
export async function getBestsellers(): Promise<BestsellerProduct[]> {
  return MOCK_BESTSELLERS;
}