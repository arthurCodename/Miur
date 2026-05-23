import type { BestsellerProduct } from "@/lib/catalog/types";
import type { SiteBreadcrumbItem } from "@/lib/navigation/breadcrumb-types";
import { categoryBrowseHrefForProductCategory } from "@/lib/navigation/category-browse-href";

const HOME: SiteBreadcrumbItem = { label: "Strona główna", href: "/" };

export function productBreadcrumbTrail(product: BestsellerProduct): SiteBreadcrumbItem[] {
  const categoryHref = categoryBrowseHrefForProductCategory(product.category);
  const trail: SiteBreadcrumbItem[] = [HOME];
  if (categoryHref) {
    trail.push({ label: product.category, href: categoryHref });
  } else {
    trail.push({ label: product.category });
  }
  trail.push({ label: product.name });
  return trail;
}
