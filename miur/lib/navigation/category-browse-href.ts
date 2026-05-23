import { categories } from "@/lib/catalog/data/categories";

function slugFromCategoryHref(href: string): string {
  return href.replace(/^\//, "");
}

/**
 * Adres listingu kategorii dla etykiety produktu (`product.category`).
 * Część etykiet (np. „Wibratory”) ma dedykowane strony-stuby, a nie wpis w `categories`.
 */
export function categoryBrowseHrefForProductCategory(categoryTitle: string): string | undefined {
  const fromCatalog = categories.find((c) => c.title === categoryTitle);
  if (fromCatalog) {
    return `/kategorie/${slugFromCategoryHref(fromCatalog.href)}`;
  }
  const navSlugs: Record<string, string> = {
    Wibratory: "/wibratory",
    Masturbatory: "/masturbatory",
    Wyprzedaż: "/wyprzedaz",
    Bestsellery: "/bestsellery",
  };
  return navSlugs[categoryTitle];
}
