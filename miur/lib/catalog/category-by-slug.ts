import { categories } from "@/lib/catalog/data/categories";
import { MOCK_BESTSELLERS } from "@/lib/catalog/data/mock-products";
import type { BestsellerProduct, Category } from "@/lib/catalog/types";

function hrefToSlug(href: string): string {
  return href.replace(/^\//, "");
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const normalized = slug.replace(/^\//, "");
  return categories.find((c) => hrefToSlug(c.href) === normalized);
}

export function getBestsellersForCategory(category: Category): BestsellerProduct[] {
  return MOCK_BESTSELLERS.filter((p) => p.category === category.title);
}
