import type { BestsellerProduct, SaleCategoryTile } from "@/lib/catalog/types";
import { MOCK_SALE_TILES, MOCK_WYPRZEDAZ_PRODUCTS } from "@/lib/catalog/data/mock-products";

export async function getWyprzedazTiles(): Promise<SaleCategoryTile[]> {
  return MOCK_SALE_TILES;
}

export async function getWyprzedazProducts(): Promise<BestsellerProduct[]> {
  return MOCK_WYPRZEDAZ_PRODUCTS;
}