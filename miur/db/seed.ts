import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import { categories, products } from "./schema";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  console.log("Starting database seeding...");

  // --- THE FIX: Wipe old data so we start fresh every time ---
  await db.delete(products);
  await db.delete(categories);
  console.log("Cleared old data.");

  // 1. Create Categories
  const newCategories = await db.insert(categories).values([
    { slug: "wellness", name: "Wellness & Health" },
    { slug: "home", name: "Home Accessories" }
  ]).returning();
  
  console.log(`Added ${newCategories.length} categories.`);

  // 2. Create Products
  await db.insert(products).values([
    {
      slug: "aura-silk-pillowcase",
      externalId: "mock_ext_001", 
      sku: "MIUR-SILK-001",
      name: "Jedwabna Poszewka Aura Silk",
      description: "100% naturalny jedwab morwowy najwyższej jakości. Zapobiega puszeniu się włosów i zmarszczkom.",
      price: "249.00",
      comparePrice: "299.00",
      lowestPrice30Days: "249.00", 
      stock: 50,
      isActive: true,
    },
    {
      slug: "matcha-ceremonial-set",
      externalId: "mock_ext_002", 
      sku: "MIUR-MAT-002",
      name: "Ceremonialny Zestaw do Matchy",
      description: "Tradycyjny japoński zestaw z bambusową trzepaczką (chasen) i ceramiczną misą.",
      price: "189.00",
      comparePrice: null, 
      lowestPrice30Days: "189.00",
      stock: 12,
      isActive: true,
    }
  ]);

  console.log("Added mock products.");
  console.log("Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});