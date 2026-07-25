/**
 * One-shot seed: insert the numeric-ID mock catalog products into the DB so
 * the checkout flow can create orders against them. Idempotent via
 * ON CONFLICT DO NOTHING on id.
 *
 * When Phase 8.1 (erotizo.pl XML sync) lands, delete this script and remove
 * these rows — they'll be replaced by the real supplier catalog.
 *
 * Usage: npx tsx scripts/seed-mock-products.ts
 */
import "dotenv/config";
import { sql } from "drizzle-orm";

import { db } from "@/db";
import { products } from "@/db/schema";
import { MOCK_BESTSELLERS } from "@/lib/catalog/data/mock-products";
import { parsePlPriceStringToNumber } from "@/lib/cart/parse-pl-price";

async function main() {
  const rows = MOCK_BESTSELLERS
    .map((p) => ({
      id: Number.parseInt(p.id, 10),
      slug: p.slug,
      externalId: `mock-${p.id}`,
      sku: `MIUR-MOCK-${p.id}`,
      name: p.name,
      description: `${p.name} — seeded from mock catalog for pre-XML-sync testing.`,
      price: parsePlPriceStringToNumber(p.price).toFixed(2),
      comparePrice: p.oldPrice ? parsePlPriceStringToNumber(p.oldPrice).toFixed(2) : null,
      lowestPrice30Days: p.omnibus ? parsePlPriceStringToNumber(p.omnibus).toFixed(2) : null,
      stock: 100,
      isActive: true,
    }))
    .filter((r) => Number.isFinite(r.id) && r.id > 0);

  if (rows.length === 0) {
    console.log("Nothing to seed.");
    return;
  }

  console.log(`Seeding ${rows.length} mock products…`);
  await db.insert(products).values(rows).onConflictDoNothing({ target: products.id });

  // Serial sequence isn't advanced by explicit-id inserts. Bump it so the
  // next non-explicit insert doesn't collide.
  await db.execute(
    sql`SELECT setval(pg_get_serial_sequence('products', 'id'), (SELECT MAX(id) FROM products))`,
  );

  const seeded = await db.select({ id: products.id, name: products.name }).from(products);
  console.log("Products in DB:");
  for (const p of seeded) console.log(`  [${p.id}] ${p.name}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
