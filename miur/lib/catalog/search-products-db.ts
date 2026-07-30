import { sql } from "drizzle-orm";

import { db } from "@/db";

export type ProductSearchHit = {
  id: number;
  slug: string;
  name: string;
  price: string;
  stock: number;
  /** Trigram word-similarity of the query to the best-matching part of the name, 0–1. */
  score: number;
};

const DEFAULT_LIMIT = 40;

/**
 * Accent-insensitive, typo-tolerant product search against the database.
 *
 * Requires db/sql/001_search_unaccent.sql to have been applied — it creates the
 * immutable_unaccent() function and the trigram indexes this query relies on.
 *
 * NOT YET WIRED TO THE STOREFRONT. The /search page renders ProductCard, which
 * needs category, image, hoverImage and tag — none of which exist as columns on
 * `products` yet. They arrive with the Phase 8.1 catalogue sync; wire this in
 * then. Until that lands, lib/api/products.ts still serves mock data.
 */
export async function searchProductsInDb(
  query: string,
  limit: number = DEFAULT_LIMIT,
): Promise<ProductSearchHit[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const result = await db.execute(sql`
    SELECT
      p.id,
      p.slug,
      p.name,
      p.price::text AS price,
      p.stock,
      word_similarity(immutable_unaccent(${trimmed}), immutable_unaccent(p.name)) AS score
    FROM products p
    WHERE
      p.deleted_at IS NULL
      -- is_active is nullable (declared .default(true) without .notNull()), so
      -- a plain "AND p.is_active" would silently drop NULL rows as well as
      -- false ones. IS NOT FALSE treats "unset" as active, which is what the
      -- default implies.
      AND p.is_active IS NOT FALSE
      AND (
        -- Substring match, the common case. gin_trgm_ops makes ILIKE usable
        -- with a leading wildcard, which a normal B-tree index cannot do.
        immutable_unaccent(p.name) ILIKE '%' || immutable_unaccent(${trimmed}) || '%'
        OR immutable_unaccent(p.description) ILIKE '%' || immutable_unaccent(${trimmed}) || '%'
        -- Typo tolerance.
        --
        -- Deliberately word_similarity (<%) and NOT plain similarity (%).
        -- similarity() compares the two strings as wholes, so a short query is
        -- penalised for every trigram in the long product name it doesn't
        -- share. Measured against real rows: "matcha" vs "Ceremonialny Zestaw
        -- do Matchy" scores 0.156 on similarity — under the 0.3 cutoff, so no
        -- hit — but 0.714 on word_similarity. Likewise "poszewke" vs "Jedwabna
        -- Poszewka Aura Silk": 0.233 vs 0.778.
        --
        -- word_similarity finds the best-matching *portion* of the name, which
        -- is what a search box wants. <% is the index-accelerated form; a bare
        -- word_similarity(...) > x would force a full scan. Left operand is the
        -- query, right is the target — the order is not interchangeable.
        -- Fires above pg_trgm.word_similarity_threshold, 0.6 by default.
        OR immutable_unaccent(${trimmed}) <% immutable_unaccent(p.name)
      )
    ORDER BY score DESC, p.name ASC
    LIMIT ${limit}
  `);

  const rows = (result.rows ?? result) as Array<Record<string, unknown>>;

  return rows.map((row) => ({
    id: Number(row.id),
    slug: String(row.slug),
    name: String(row.name),
    price: String(row.price),
    stock: Number(row.stock),
    score: Number(row.score),
  }));
}
