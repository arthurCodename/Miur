import { and, isNull, lt, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { products, responsibles } from "@/db/schema";
import {
  parseCatalogFeed,
  parseResponsibles,
  type FeedProduct,
} from "./parse-feed";

/**
 * BUSINESS DECISION, NOT A TECHNICAL ONE.
 *
 * erotizo supplies no suggested retail price — price_net and price_retail_net
 * are identical on all 25,652 rows — so every selling price is ours to set.
 * This multiplier is applied to the NET wholesale price, then VAT is added on
 * top. 2.0 means a product costing 22.12 net sells for 22.12 * 2 * 1.23 =
 * 54.42 zł gross.
 *
 * This is a placeholder chosen to produce sane numbers, not a researched
 * margin. Set it deliberately before launch. Individual products can override
 * it via products.marginMultiplier, which the sync never overwrites once set.
 */
export const DEFAULT_MARGIN_MULTIPLIER = 2.0;

/**
 * Below this stock level a product is not offered for sale.
 *
 * The supplier holds the inventory, so there is always a window between a
 * customer paying us and erotizo confirming they can ship. Hiding the last
 * couple of units closes most of that risk cheaply. Measured against the real
 * feed this hides roughly 2,134 products beyond those already at zero.
 */
export const MIN_STOCK_FOR_SALE = 3;

/** Rows per INSERT. Postgres caps a statement at 65535 bound parameters. */
const BATCH_SIZE = 500;

const POLISH_TRANSLITERATION: Record<string, string> = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
};

/**
 * URL-safe slug from a Polish product name.
 *
 * The supplier id is appended deliberately: 25,652 products produce genuine
 * name collisions (same toy, different colour), and a slug must be unique.
 * erotizo's own URLs do the same thing.
 */
export function slugifyProduct(name: string, externalId: string): string {
  const base = name
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (c) => POLISH_TRANSLITERATION[c] ?? c)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");

  return base ? `${base}-${externalId}` : `produkt-${externalId}`;
}

/** Gross retail price: net wholesale, marked up, then VAT applied. */
export function calculateRetailPrice(
  wholesaleNet: number,
  margin: number,
  vatRate: number,
): number {
  return Math.round(wholesaleNet * margin * (1 + vatRate / 100) * 100) / 100;
}

export type SyncResult = {
  responsiblesUpserted: number;
  productsSeen: number;
  productsUpserted: number;
  skippedHidden: number;
  skippedInvalid: number;
  softDeleted: number;
  availableForSale: number;
  durationMs: number;
};

type SyncOptions = {
  /** Local path or a readable stream of products.xml. */
  source: string;
  /** Soft-delete products that are in the DB but absent from the feed. */
  softDeleteMissing?: boolean;
  onProgress?: (seen: number) => void;
};

function toProductRow(p: FeedProduct, syncedAt: Date) {
  const margin = DEFAULT_MARGIN_MULTIPLIER;
  return {
    externalId: p.externalId,
    sku: p.sku,
    slug: slugifyProduct(p.name, p.externalId),
    name: p.name,
    description: p.description,
    price: calculateRetailPrice(p.wholesalePriceNet, margin, p.vatRate).toFixed(2),
    wholesalePriceNet: p.wholesalePriceNet.toFixed(2),
    marginMultiplier: margin.toFixed(3),
    vatRate: p.vatRate,
    stock: p.stock,
    isActive: p.stock >= MIN_STOCK_FOR_SALE,
    images: p.images,
    categoryPath: p.categoryPath,
    brand: p.brand,
    ean: p.ean,
    weightKg: p.weightKg === null ? null : p.weightKg.toFixed(3),
    responsibleId: p.responsibleId,
    supplierUrl: p.supplierUrl,
    syncedAt,
    deletedAt: null,
  };
}

/**
 * Import the full erotizo catalogue.
 *
 * Order matters: responsibles first, because products carry a foreign key to
 * them and the insert would be rejected otherwise.
 *
 * Products absent from the feed are soft-deleted rather than removed — orders
 * and price history reference them, and a product that vanishes for a day
 * should come back rather than lose its id.
 */
export async function syncCatalog({
  source,
  softDeleteMissing = true,
  onProgress,
}: SyncOptions): Promise<SyncResult> {
  const startedAt = Date.now();
  // Every row this run touches is stamped with the same timestamp. Step 3 then
  // retires anything left carrying an older stamp — which is how we find
  // products the supplier dropped, without shipping 25k ids back to Postgres.
  const runTimestamp = new Date();

  // --- 1. Responsible operators (GPSR) ------------------------------------
  const responsibleRows = [];
  for await (const r of parseResponsibles(source)) responsibleRows.push(r);

  if (responsibleRows.length > 0) {
    await db
      .insert(responsibles)
      .values(responsibleRows)
      .onConflictDoUpdate({
        target: responsibles.id,
        set: {
          name: sql`excluded.name`,
          street: sql`excluded.street`,
          postCode: sql`excluded.post_code`,
          city: sql`excluded.city`,
          countryCode: sql`excluded.country_code`,
          email: sql`excluded.email`,
          phone: sql`excluded.phone`,
        },
      });
  }

  // --- 2. Products --------------------------------------------------------
  let productsSeen = 0;
  let productsUpserted = 0;
  let skippedHidden = 0;
  let skippedInvalid = 0;
  let availableForSale = 0;

  let batch: ReturnType<typeof toProductRow>[] = [];

  const flush = async () => {
    if (batch.length === 0) return;
    await db
      .insert(products)
      .values(batch)
      .onConflictDoUpdate({
        target: products.externalId,
        set: {
          sku: sql`excluded.sku`,
          slug: sql`excluded.slug`,
          name: sql`excluded.name`,
          description: sql`excluded.description`,
          wholesalePriceNet: sql`excluded.wholesale_price_net`,
          vatRate: sql`excluded.vat_rate`,
          // Never clobber a margin someone set by hand. COALESCE keeps the
          // existing value when there is one and takes the feed's default only
          // for rows that have none.
          marginMultiplier: sql`coalesce(${products.marginMultiplier}, excluded.margin_multiplier)`,
          // Price is derived, so it must be recomputed from the margin that
          // actually survived the line above — not from the feed's default.
          price: sql`round(
            excluded.wholesale_price_net
            * coalesce(${products.marginMultiplier}, excluded.margin_multiplier)
            * (1 + excluded.vat_rate::numeric / 100), 2)`,
          stock: sql`excluded.stock`,
          isActive: sql`excluded.is_active`,
          images: sql`excluded.images`,
          categoryPath: sql`excluded.category_path`,
          brand: sql`excluded.brand`,
          ean: sql`excluded.ean`,
          weightKg: sql`excluded.weight_kg`,
          responsibleId: sql`excluded.responsible_id`,
          supplierUrl: sql`excluded.supplier_url`,
          syncedAt: sql`excluded.synced_at`,
          // A product that reappears in the feed is undeleted.
          deletedAt: sql`null`,
        },
      });
    productsUpserted += batch.length;
    batch = [];
  };

  for await (const product of parseCatalogFeed(source)) {
    productsSeen++;
    if (onProgress && productsSeen % 2000 === 0) onProgress(productsSeen);

    if (product.hidden) {
      skippedHidden++;
      continue;
    }
    if (!product.name || product.wholesalePriceNet <= 0) {
      skippedInvalid++;
      continue;
    }

    if (product.stock >= MIN_STOCK_FOR_SALE) availableForSale++;

    batch.push(toProductRow(product, runTimestamp));
    if (batch.length >= BATCH_SIZE) await flush();
  }
  await flush();

  // --- 3. Retire products the supplier no longer lists ---------------------
  let softDeleted = 0;
  if (softDeleteMissing && productsUpserted > 0) {
    // Built through the query builder, not raw SQL, on purpose.
    //
    // `synced_at` is a `timestamp` (no time zone) and Drizzle's column type
    // converts a JS Date to UTC when writing it. A Date interpolated into a
    // raw sql`` template does NOT go through that conversion — it is sent as
    // local time. On a machine at GMT+0200 the two representations differ by
    // two hours, so every row just written looked older than the run and the
    // first version of this retired the entire catalogue it had imported.
    // Going through lt(products.syncedAt, ...) applies the same conversion to
    // both sides.
    const retired = await db
      .update(products)
      .set({ deletedAt: new Date(), isActive: false })
      .where(
        and(
          isNull(products.deletedAt),
          or(isNull(products.syncedAt), lt(products.syncedAt, runTimestamp)),
        ),
      )
      .returning({ id: products.id });
    softDeleted = retired.length;
  }

  return {
    responsiblesUpserted: responsibleRows.length,
    productsSeen,
    productsUpserted,
    skippedHidden,
    skippedInvalid,
    softDeleted,
    availableForSale,
    durationMs: Date.now() - startedAt,
  };
}
