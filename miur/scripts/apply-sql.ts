/**
 * Apply the hand-written SQL in db/sql/ that Drizzle's schema can't express —
 * extensions, custom functions, expression indexes.
 *
 *   npx tsx --env-file=.env.local scripts/apply-sql.ts
 *
 * Files run in filename order and every one must be idempotent, because this
 * script has no notion of "already applied" — it just re-runs everything. That
 * is deliberate for now: it keeps the tooling to ~40 lines while the schema is
 * still moving. Phase 9.3 replaces this with real versioned migrations
 * (drizzle-kit generate + migrate), at which point this script goes away.
 *
 * Note on `--env-file`: db/index.ts reads DATABASE_URL at import time, and ES
 * module imports are evaluated before any code in this file runs. So calling
 * dotenv here would be too late — Node has to load the env before the module
 * graph does, which is what --env-file does.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { sql } from "drizzle-orm";

import { db } from "@/db";

const SQL_DIR = "db/sql";

/** Neon's HTTP driver sends one statement per request, so split the file. */
function splitStatements(contents: string): string[] {
  return contents
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !/^(--[^\n]*\n?)+$/.test(s));
}

async function main() {
  const files = readdirSync(SQL_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log(`No .sql files in ${SQL_DIR}/`);
    return;
  }

  for (const file of files) {
    const statements = splitStatements(readFileSync(join(SQL_DIR, file), "utf8"));
    process.stdout.write(`${file} — ${statements.length} statement(s): `);

    for (const statement of statements) {
      await db.execute(sql.raw(statement));
      process.stdout.write("·");
    }

    console.log(" ok");
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("\nFailed:", err?.message ?? err);
  process.exit(1);
});
