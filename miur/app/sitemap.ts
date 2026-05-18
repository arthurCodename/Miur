import type { MetadataRoute } from "next";
import { MOCK_BLOG_POSTS } from "@/lib/blog/posts";
import { categories } from "@/lib/catalog/data/categories";
import { MOCK_BESTSELLERS, MOCK_WYPRZEDAZ_PRODUCTS } from "@/lib/catalog/data/mock-products";
import { getSiteUrl } from "@/lib/site-url";

type SitemapEntry = MetadataRoute.Sitemap[number];
type ChangeFrequency = NonNullable<SitemapEntry["changeFrequency"]>;

/**
 * Generate sitemap.xml at /sitemap.xml.
 *
 * Coverage:
 *   - Home + key landing pages (high priority, weekly)
 *   - All category routes (from categories.ts) + static category aliases
 *   - All product detail pages (mock catalog)
 *   - All blog posts
 *   - Legal / info pages (low priority, yearly)
 *
 * Excluded (handled by robots.ts disallow):
 *   - /checkout, /profile, /login — auth/transactional, no SEO value
 *   - /search — query results, intentionally noindex
 *   - /moje-zamowienia, /lista-zyczen — auth-only
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl().replace(/\/$/, "");
  const now = new Date();

  const entry = (
    path: string,
    priority: number,
    changeFrequency: ChangeFrequency = "monthly",
    lastModified: Date = now,
  ): SitemapEntry => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  // Top-level marketing pages
  const top: SitemapEntry[] = [
    entry("", 1, "weekly"),
    entry("/produkty", 0.9, "daily"),
    entry("/bestsellery", 0.9, "weekly"),
    entry("/wyprzedaz", 0.9, "daily"),
    entry("/blog", 0.8, "weekly"),
    entry("/o-nas", 0.5, "monthly"),
    entry("/kontakt", 0.6, "monthly"),
    entry("/opinie", 0.6, "weekly"),
  ];

  // Static "category-like" aliases (non-canonical category landing pages)
  const aliasCategoryPaths = ["/wibratory", "/masturbatory", "/dyskretna-paczka"];
  const aliases: SitemapEntry[] = aliasCategoryPaths.map((p) => entry(p, 0.7, "weekly"));

  // Canonical category pages — both short URL and /kategorie/{slug}
  const dynamicCategories: SitemapEntry[] = categories.flatMap((c) => {
    const slug = c.href.replace(/^\//, "");
    return [
      entry(c.href, 0.85, "weekly"),
      entry(`/kategorie/${slug}`, 0.6, "weekly"),
    ];
  });

  // Product detail pages — dedupe by slug to avoid duplicates between
  // bestsellery and wyprzedaż mock arrays.
  const productSlugs = new Set<string>();
  for (const p of [...MOCK_BESTSELLERS, ...MOCK_WYPRZEDAZ_PRODUCTS]) {
    productSlugs.add(p.slug);
  }
  const products: SitemapEntry[] = [...productSlugs].map((slug) =>
    entry(`/produkt/${slug}`, 0.75, "weekly"),
  );

  // Blog posts
  const blog: SitemapEntry[] = MOCK_BLOG_POSTS.map((post) =>
    entry(`/blog/${post.slug}`, 0.6, "monthly"),
  );

  // Legal / info — low priority, rarely changed
  const legal: SitemapEntry[] = [
    entry("/regulamin", 0.4, "yearly"),
    entry("/polityka-prywatnosci", 0.4, "yearly"),
    entry("/zwroty-reklamacje", 0.4, "yearly"),
    entry("/dostepnosc", 0.4, "yearly"),
    entry("/dostawa-platnosc", 0.5, "monthly"),
    entry("/program-partnerski", 0.4, "monthly"),
  ];

  return [...top, ...aliases, ...dynamicCategories, ...products, ...blog, ...legal];
}
