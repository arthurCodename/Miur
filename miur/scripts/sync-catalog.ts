/**
 * Import the erotizo catalogue.
 *
 *   npx tsx --env-file=.env.local scripts/sync-catalog.ts
 *   npx tsx --env-file=.env.local scripts/sync-catalog.ts --file ./products.xml
 *   npx tsx --env-file=.env.local scripts/sync-catalog.ts --keep-missing
 *
 * Needs EROTIZO_PRODUCTS_URL in the environment. That URL contains an access
 * token — anyone holding it can download the full catalogue with wholesale
 * prices — so it lives in .env.local and never in the repo.
 *
 * The feed is downloaded to a temp file first rather than streamed straight
 * from the network. A 69 MB parse that dies two thirds of the way through
 * because the connection blipped would leave the catalogue half-updated; this
 * way the download either completes or the sync never starts.
 */
import { createWriteStream } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

import { syncCatalog, DEFAULT_MARGIN_MULTIPLIER, MIN_STOCK_FOR_SALE } from "@/lib/catalog/sync/sync-catalog";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

async function download(url: string, target: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Feed returned HTTP ${res.status}`);
  if (!res.body) throw new Error("Feed response had no body");
  await pipeline(Readable.fromWeb(res.body as Parameters<typeof Readable.fromWeb>[0]), createWriteStream(target));
}

async function main() {
  const localFile = arg("file");
  const keepMissing = process.argv.includes("--keep-missing");

  let source = localFile;
  let tempDir: string | null = null;

  if (!source) {
    const url = process.env.EROTIZO_PRODUCTS_URL;
    if (!url) {
      console.error(
        "EROTIZO_PRODUCTS_URL is not set.\n" +
          "Add it to .env.local (it contains an access token — never commit it),\n" +
          "or pass a local file with --file ./products.xml",
      );
      process.exit(1);
    }
    tempDir = await mkdtemp(join(tmpdir(), "miur-feed-"));
    source = join(tempDir, "products.xml");
    process.stdout.write("Downloading catalogue… ");
    await download(url, source);
    console.log("done.");
  }

  console.log(
    `Margin ${DEFAULT_MARGIN_MULTIPLIER}x on net wholesale · hiding stock < ${MIN_STOCK_FOR_SALE}`,
  );
  process.stdout.write("Syncing");

  try {
    const result = await syncCatalog({
      source,
      softDeleteMissing: !keepMissing,
      onProgress: () => process.stdout.write("."),
    });

    console.log("\n");
    console.log(`  responsible operators   ${result.responsiblesUpserted}`);
    console.log(`  products in feed        ${result.productsSeen}`);
    console.log(`  imported / updated      ${result.productsUpserted}`);
    console.log(`  skipped (hidden)        ${result.skippedHidden}`);
    console.log(`  skipped (invalid)       ${result.skippedInvalid}`);
    console.log(`  retired (gone from feed) ${result.softDeleted}`);
    console.log(`  available to buy        ${result.availableForSale}`);
    console.log(`  took                    ${(result.durationMs / 1000).toFixed(1)}s`);
  } finally {
    if (tempDir) await rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error("\nSync failed:", err?.message ?? err);
  process.exit(1);
});
