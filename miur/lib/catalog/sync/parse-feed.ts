import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import sax from "sax";

/**
 * Streaming parsers for the erotizo XML feeds.
 *
 * WHY STREAMING
 * The full catalogue is ~69 MB. Reading it into a string and handing it to a
 * DOM-style parser needs several times that in memory — fine on a laptop,
 * fatal in a serverless function. A SAX parser instead walks the document and
 * emits events ("tag opened", "text", "tag closed") so only one product is ever
 * held in memory. Both parsers below yield one record at a time.
 *
 * FEEDS
 *   products.xml  ~69 MB, regenerated daily  — full catalogue, <item> records
 *   basic.xml     ~5 MB,  regenerated hourly — stock + prices, <product> records
 *
 * Note the two feeds use different element names for the same product, and
 * different names for the same fields. That's the supplier's design, not ours.
 */

export type FeedProduct = {
  /** Supplier product id — the join key between both feeds. */
  externalId: string;
  sku: string;
  name: string;
  description: string;
  /** Net wholesale price, i.e. what we pay, excluding VAT. */
  wholesalePriceNet: number;
  vatRate: number;
  stock: number;
  weightKg: number | null;
  ean: string | null;
  brand: string | null;
  categoryPath: string | null;
  images: string[];
  supplierUrl: string | null;
  responsibleId: number | null;
  /** Supplier asked for this product to be hidden from listings. */
  hidden: boolean;
};

export type FeedResponsible = {
  id: number;
  name: string;
  street: string | null;
  postCode: string | null;
  city: string | null;
  countryCode: string | null;
  email: string | null;
  phone: string | null;
};

export type StockRow = {
  externalId: string;
  stock: number;
  wholesalePriceNet: number;
  vatRate: number;
};

function toNumber(value: string | undefined, fallback = 0): number {
  if (!value) return fallback;
  const n = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
}

function nullIfEmpty(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

type SaxSource = string | Readable;

function toStream(source: SaxSource): Readable {
  return typeof source === "string" ? createReadStream(source, { encoding: "utf8" }) : source;
}

/**
 * Walk an XML stream and yield one object per `recordTag` element.
 *
 * Collects the text of every direct child element into a flat record. Nested
 * structure is flattened, which is fine here because both feeds are flat apart
 * from <prod_img>, whose repeated <img> children are collected separately by
 * the caller via `onChildTag`.
 */
async function* streamRecords(
  source: SaxSource,
  recordTag: string,
  onChildTag?: (tag: string, text: string, record: Record<string, string>) => void,
): AsyncGenerator<Record<string, string>> {
  const parser = sax.createStream(true, { trim: true, position: false });

  let current: Record<string, string> | null = null;
  let path: string[] = [];
  let text = "";

  const queue: Array<Record<string, string>> = [];
  let done = false;
  let failure: Error | null = null;
  /** Resolver for a consumer awaiting the next record. */
  let wake: (() => void) | null = null;

  const nudge = () => {
    const w = wake;
    wake = null;
    w?.();
  };

  parser.on("opentag", (node) => {
    if (node.name === recordTag) {
      current = {};
      path = [];
    } else if (current) {
      path.push(node.name);
    }
    text = "";
  });

  // CDATA and plain text arrive through different events; both are content.
  parser.on("text", (t) => { text += t; });
  parser.on("cdata", (t) => { text += t; });

  parser.on("closetag", (name) => {
    if (name === recordTag) {
      if (current) queue.push(current);
      current = null;
      nudge();
      return;
    }
    if (current) {
      const value = text.trim();
      if (onChildTag) onChildTag(name, value, current);
      // Only record the first occurrence of a repeated tag here; repeats are
      // the caller's business via onChildTag (see <img>).
      if (!(name in current)) current[name] = value;
      path.pop();
    }
    text = "";
  });

  parser.on("error", (err) => {
    failure = err instanceof Error ? err : new Error(String(err));
    // sax halts on error unless explicitly resumed; we want to fail loudly.
    nudge();
  });

  parser.on("end", () => { done = true; nudge(); });

  toStream(source).pipe(parser);

  while (true) {
    if (failure) throw failure;
    if (queue.length > 0) {
      yield queue.shift()!;
      continue;
    }
    if (done) return;
    await new Promise<void>((resolve) => { wake = resolve; });
  }
}

/** Yield every product in products.xml. */
export async function* parseCatalogFeed(source: SaxSource): AsyncGenerator<FeedProduct> {
  // <prod_img> holds repeated <img> children; collect them per record.
  const imagesByRecord = new WeakMap<Record<string, string>, string[]>();

  const collectImages = (tag: string, value: string, record: Record<string, string>) => {
    if (tag !== "img" || !value) return;
    const list = imagesByRecord.get(record) ?? [];
    list.push(value);
    imagesByRecord.set(record, list);
  };

  for await (const raw of streamRecords(source, "item", collectImages)) {
    const externalId = raw.prod_id?.trim();
    if (!externalId) continue;

    yield {
      externalId,
      sku: raw.prod_symbol?.trim() || externalId,
      name: raw.prod_name?.trim() ?? "",
      description: raw.prod_desc ?? "",
      wholesalePriceNet: toNumber(raw.prod_price_net),
      vatRate: Math.round(toNumber(raw.taxpercent, 23)),
      stock: Math.max(0, Math.floor(toNumber(raw.prod_amount))),
      weightKg: raw.prod_weight ? toNumber(raw.prod_weight) : null,
      ean: nullIfEmpty(raw.prod_ean),
      brand: nullIfEmpty(raw.prd_name),
      categoryPath: nullIfEmpty(raw.cat_path),
      images: imagesByRecord.get(raw) ?? [],
      supplierUrl: nullIfEmpty(raw.prod_link),
      responsibleId: raw.responsible_id ? Math.round(toNumber(raw.responsible_id)) || null : null,
      // Respect both flags even though the supplier currently sets neither —
      // they can start using them at any time and we'd rather not find out by
      // listing something we shouldn't.
      hidden: raw.prod_hidden === "1" || raw.prod_search_hidden === "1",
    };
  }
}

/** Yield every responsible operator in products.xml (the GPSR block). */
export async function* parseResponsibles(source: SaxSource): AsyncGenerator<FeedResponsible> {
  for await (const raw of streamRecords(source, "responsible")) {
    const id = Math.round(toNumber(raw.id, -1));
    if (id < 0 || !raw.name?.trim()) continue;
    yield {
      id,
      name: raw.name.trim(),
      street: nullIfEmpty(raw.street),
      postCode: nullIfEmpty(raw.post_code),
      city: nullIfEmpty(raw.city),
      countryCode: nullIfEmpty(raw.country_code),
      email: nullIfEmpty(raw.email),
      phone: nullIfEmpty(raw.phone),
    };
  }
}

/** Yield stock + price rows from the hourly basic.xml feed. */
export async function* parseStockFeed(source: SaxSource): AsyncGenerator<StockRow> {
  for await (const raw of streamRecords(source, "product")) {
    const externalId = raw.id?.trim();
    if (!externalId) continue;
    yield {
      externalId,
      stock: Math.max(0, Math.floor(toNumber(raw.store))),
      wholesalePriceNet: toNumber(raw.price_net),
      vatRate: Math.round(toNumber(raw.vat_value, 23)),
    };
  }
}
