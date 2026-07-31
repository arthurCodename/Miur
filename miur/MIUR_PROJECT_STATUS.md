# Miur — Project Status

**Updated:** 2026-07-30 · **Branch:** `integration`, in sync with origin · **Typecheck + lint:** clean

---

## Where we are

The shop can be browsed, filled, and checked out, and it emails a confirmation.
**It cannot take money.** That is the only thing making it unsellable.

Concretely: if a real customer "bought" something today, you'd get an order row,
zero money, and no parcel would ever ship. Everything else in Phase 7 is done
except InPost's label side.

---

## What works today

| Area | State | Notes |
|---|---|---|
| Foundation | Done | Next.js 16, Neon Postgres, Drizzle. CSP with per-request nonces (`proxy.ts`), cookie consent, age gate, Polish legal pages, SEO scaffolding. |
| Search (database) | Done | Accent- and typo-tolerant query in `lib/catalog/search-products-db.ts`, backed by `db/sql/001_search_unaccent.sql`. |
| Search (storefront) | **Still mock** | `/search` calls `searchProducts()` in `lib/api/products.ts`, which filters a hard-coded array of 8 mock products in JavaScript and never queries the database. See below. |
| Accounts | Done | Register, login, password reset with expiring single-use tokens over Resend. Google OAuth is wired but has no UI button. |
| Cart | Done | Server-backed. Anonymous cart merges into the account on sign-in instead of being lost. |
| Checkout UI (7.3) | Done | Contact + address form, PL phone/postcode validation, delivery picker, live summary, guest checkout, RODO consents. |
| InPost locker picker (7.4) | Partial | Map works. Missing: ShipX account and label creation. |
| Payments (7.5) | **Skipped** | The blocker. See below. |
| Orders (7.6) | Done | Prices looked up server-side from the products table — a tampered cart can't change what a customer is charged. Line items snapshotted at order time. |
| Emails (7.7) | Done | Order confirmation + shipping notification, Polish, React Email. Shipping mail has no caller yet. |
| Operations (8) | Not started | Catalog sync, admin panel, receipts, Omnibus price history. |
| Hardening (9) | Not started | Rate limiting, Sentry, real migrations, CI, accessibility. |

---

## The blocker: Phase 7.5 — "The Golden Flow"

Payments and fulfilment in one flow. Provider: **Przelewy24**. Background jobs:
**Inngest**. Online payment only, no cash on delivery.

**1. Schema first.** The current status enum (`pending → paid → shipped →
cancelled`) is too coarse. Needs at least `PENDING`, `P24_PAID`,
`WAREHOUSE_RESERVED`, `INVOICE_GENERATED`, `COMPLETED`, `CANCELLED_REFUNDED`.
Rename `orders.stripeSessionId` → `p24OrderId` (unique — it's the idempotency
key). Add the margin columns from 7.5b at the same time.

**2. Live stock check** against the supplier feed immediately before the payment
redirect, so we don't take money for something already gone.

**3. Stock buffer.** If supplier stock is under 3 units, report "Brak w
magazynie". Cheap protection against paid-but-unavailable. Costs ~2,134 products
(see feed section) — worth it.

**4. `POST /api/webhooks/p24`** — the most important endpoint in the system:

| Step | What | Why it matters |
|---|---|---|
| 0 | **Idempotency check.** Look up `p24OrderId`; if already paid, return 200 and stop. | P24 retries webhooks. Without this we double-ship and double-invoice. Do this before anything else. |
| A | Verify the P24 CRC signature. Set `P24_PAID`. | The endpoint is public — anyone could POST "order 123 paid" and get free product. |
| B | **Grace period.** Inngest sleeps 15 min (`step.sleep` / `step.waitForEvent`). Customer sees a live "Anuluj zamówienie" button. Cancel → P24 refund → `CANCELLED_REFUNDED` → end. | Sealed intimate goods lose the 14-day return right once opened, so a pre-shipment exit is how buyer's remorse gets handled without a return we don't have to accept. |
| C | After the window: POST to the dropshipper, `discreet_packaging: true`. | |
| D | **Out of stock → P24 refund → apology email → `CANCELLED_REFUNDED`.** | We don't own stock. Half the catalogue is unavailable at any moment. This will happen routinely, not rarely. |
| E | Success → `generateInvoice()` via the accounting adapter (two lines: goods, and delivery as a service) → send confirmation with PDF attached. | This is where `notifyOrderCreated()` moves to. |

**5. Server-side Purchase event** to Google Measurement Protocol after the
invoice — **gated on stored consent** (see the warning below).

**Estimate:** 5–8 days. Blocked on the P24 sandbox (1–3 business days) — start
that first.

### 7.5b — Margin columns (small; do with the 7.5 schema change)

`products`: `wholesale_price`, `margin_multiplier`, `calculated_price`, `vat_rate`.
`orders`: `net_profit`.

The database currently records what the customer paid but not what we paid
erotizo, so "did we make money today" is unanswerable. In dropshipping the
margin *is* the business. Cheap now, miserable to backfill.

---

## Supplier feed (erotizo) — verified 2026-07-30

Two feeds. **The URL contains an access token — treat it as a password.** It
belongs in an env var, never in code or a commit. Anyone holding it can download
the full catalogue including wholesale prices.

| Feed | Size | Regenerated | Contains |
|---|---|---|---|
| `products.xml` | 69 MB | Daily | Full catalogue: names, HTML descriptions, images, categories, EAN, weight, brand |
| `basic.xml` | 5 MB | Hourly | Stock + prices only |

**25,652 products.** Join key is `prod_id` (catalogue) = `id` (stock feed).

### What the real data changed

**Descriptions already exist.** `prod_desc` holds full Polish HTML with `<h3>`
headings and bullet lists — exactly the format the blueprint asked OpenAI to
produce. So the AI job is **rewriting for uniqueness, not generating**: every
other erotizo dropshipper publishes these same texts, and Google penalises
duplicate content. Cheaper and better output, since the model gets real source
material instead of inventing from a product name.

**Sync cadence: hourly and daily, not every 15 minutes.** The blueprint says
poll every 15 min, but the files only regenerate hourly (stock) and daily
(catalogue). Polling faster just re-downloads identical bytes.

**69 MB means streaming, in chunks.** You cannot load this into a serverless
function and upsert 25,652 rows before the timeout. It has to be stream-parsed
across durable steps — which is what Inngest is for, and Vercel Cron isn't.

**VAT is not a constant:** 23% on 25,039 products, 8% on 572, 5% on 41 (books —
we sell education products). Confirms `vat_rate` is required, and invoices need
per-item VAT.

**There is no suggested retail price.** `price_net` equals `price_retail_net` on
all 25,652 rows. Every price is our decision; `margin_multiplier` is the only
thing determining profit.

**Half the catalogue is out of stock:** 12,977 in stock, 12,675 at zero. Of the
14,809 rows under 3 units, 12,675 are already zero — so the stock buffer hides
**2,134 extra products**, about 16% of what's sellable, leaving 10,843 live.

### Fields worth knowing about

- `prod_hidden` / `prod_search_hidden` — **respect these** or we publish products
  erotizo doesn't want listed.
- `responsible_id` → the `<responsibles>` block. This is the **GPSR responsible
  economic operator**, which EU product safety rules require us to show
  consumers per product. Not in the blueprint, not previously in this doc. The
  data is there; we need to display it.
- `prod_weight` — lets us charge real InPost rates instead of the current flat
  12,99 / 16,99.
- `prod_ean` — required for the Google Shopping feed, so Phase 11 gets easier.
- `prod_img` — erotizo URLs. Hotlinking is forbidden, so all 25,652+ images must
  be downloaded, converted to WebP and stored in R2. **That's its own piece of
  work, not a small utility.**

---

## Catalogue sync — built 2026-07-31 (Phase 8.1, partial)

**25,652 real products are now in the database.** 10,843 are buyable; the rest
are below the stock floor. The 8 mock products are soft-deleted.

```bash
npx tsx --env-file=.env.local scripts/sync-catalog.ts            # from the feed URL
npx tsx --env-file=.env.local scripts/sync-catalog.ts --file x.xml  # from a local file
```

Needs `EROTIZO_PRODUCTS_URL` in `.env.local`. **That URL contains an access
token** — anyone holding it can pull the whole catalogue with wholesale prices.

| Piece | What it does |
|---|---|
| `lib/catalog/sync/parse-feed.ts` | Streaming SAX parsers for both feeds. 69 MB parses in ~3s at a flat 32 MB heap — a DOM parser would need several hundred MB and die in a serverless function. |
| `lib/catalog/sync/sync-catalog.ts` | Upserts responsibles then products in batches of 500, computes retail price, retires products the supplier dropped. |
| `scripts/sync-catalog.ts` | CLI. Downloads to a temp file first so a dropped connection can't leave the catalogue half-updated. |

**Pricing is a placeholder.** `DEFAULT_MARGIN_MULTIPLIER = 2.0` applied to net
wholesale, then VAT. A product costing 22,12 net sells for 54,42 gross. That
number was chosen to produce sane figures, **not researched** — set it
deliberately before launch. Per-product overrides in
`products.marginMultiplier` are never overwritten by the sync.

**Retiring uses a run timestamp**, not a list of ids: every row touched gets the
same `syncedAt`, then anything still carrying an older stamp is soft-deleted.
Shipping 25k ids back to Postgres would have meant a ~300 KB statement.

### Two bugs worth remembering

**`drizzle-kit push` drops indexes it doesn't know about.** The unaccent search
indexes were originally created in `db/sql/001_search_unaccent.sql`. The first
`push` after that silently deleted them, and search degraded from 4 ms to 359 ms
with no error anywhere. They now live in `db/schema.ts` so Drizzle manages them.
Extensions and functions stay in the SQL file — Drizzle doesn't touch those.
**Run `scripts/apply-sql.ts` before `drizzle-kit push` on a fresh database**, or
the indexes fail to build for want of `immutable_unaccent()`.

**A JS `Date` serialises differently in raw SQL than through a column type.**
Drizzle converts to UTC when writing a `timestamp` column, but a Date
interpolated into a raw ``sql`` `` template is sent as local time. On a
GMT+0200 machine the two differ by two hours, so the first version of the retire
step decided every row it had just written was stale and soft-deleted the entire
catalogue. Use the query builder (`lt(products.syncedAt, ...)`) so both sides get
the same conversion.

### Still to do here

- Hourly stock sync from `basic.xml` (parser is written, no job wired yet)
- Images still point at erotizo URLs — hotlinking isn't allowed, so the R2
  download/WebP pipeline is still owed. ~25,631 products have images.
- `price_history` isn't written on price change (Omnibus requirement, 8.4)
- GPSR: 72 responsible operators are imported and linked, but no product page
  displays them yet — that display is the actual legal requirement.
- Storefront still reads mock data; see below.

---

## Search — built 2026-07-31

`lib/catalog/search-products-db.ts` — accent-insensitive, typo-tolerant product
search. `db/sql/001_search_unaccent.sql` creates what it needs; apply with
`npx tsx --env-file=.env.local scripts/apply-sql.ts` (idempotent, safe to re-run).

**Not yet wired to the storefront, and can't be.** `/search` renders
`ProductCard`, which needs `category`, `image`, `hoverImage` and `tag` — none of
which exist as columns on `products`. They arrive with the 8.1 catalogue sync;
wire the search in at that point. Until then `lib/api/products.ts` keeps serving
the 8 mock products.

**Two things worth knowing before touching this:**

*`unaccent()` can't be indexed directly.* Postgres only indexes IMMUTABLE
expressions, and the one-argument `unaccent()` is merely STABLE because it looks
the dictionary up at call time. Hence the `immutable_unaccent()` wrapper, which
passes the dictionary explicitly. Without it, `CREATE INDEX` fails outright.

*Use `word_similarity` (`<%`), not `similarity` (`%`).* `similarity()` compares
whole strings, so a short query is penalised for every trigram in a long product
name it doesn't share. Measured on real rows: "matcha" against "Ceremonialny
Zestaw do Matchy" scores **0.156** on similarity — under the 0.3 cutoff, so zero
results — but **0.714** on word_similarity. Same for "poszewke" vs "Jedwabna
Poszewka Aura Silk": 0.233 vs 0.778. Both queries were silently returning
nothing before the switch.

Known limit: heavier typos still miss. "velvt" finds "Velvet Touch" (0.67) but
"mtcha" doesn't reach the 0.6 `word_similarity_threshold`. Lowering that
threshold trades false negatives for false positives — revisit against the real
25,652-product catalogue, not against 8 mock rows.

**Confirmed against the real 25,652-product catalogue:** the planner now uses
Bitmap Index Scans on all three branches and the query runs in **4.5 ms**, down
from 359 ms on a sequential scan. Remember to `ANALYZE products` after a bulk
load — the planner works from statistics, and stale ones keep it on seq scans.

---

## What's ahead, in order

1. **7.5 Golden Flow** — 5–8 days. The blocker.
2. **7.5b margin columns** — same schema change.
3. **7.4 InPost labels** — 2–3 days once the ShipX account is live.
4. **8.1 Catalog sync** — 3–5 days. No longer blocked; the feed works.
5. **8.2 Admin panel** — order list, status transitions, "mark as shipped"
   (which finally gives the shipping email a caller). Needs
   `session.user.role === "admin"` enforcement, which nothing reads yet.
6. **8.3 Invoicing** via the CRM adapter.
7. **8.4 Recurring jobs** — Omnibus price history (legally required), abandoned
   cart recovery, RODO log anonymisation.
8. **Phase 9 hardening** — see gaps below.

---

## Decisions

### Resolved 2026-07-30 (from the external architecture blueprint)

| Topic | Decision |
|---|---|
| Payments | **Przelewy24.** Supersedes the earlier Stripe recommendation; the Golden Flow depends on P24's CRC signature and refund API. |
| Background jobs | **Inngest.** Reverses the earlier "Vercel Cron for v1" call — the grace period needs a workflow that sleeps and can wake on an event, and the 69 MB feed needs chunked durable steps. |
| Product images | **Cloudflare R2.** Download, convert to WebP, host ourselves. Sync compares a photo hash and only re-uploads on change. |
| Search | **Stay on Postgres.** Done 2026-07-31 — see the search section below. |
| Invoicing | **A CRM will handle it.** Still build the `AccountingProvider` interface so the core doesn't hardwire a vendor. |

### Two blueprint items to NOT implement as written

**Server-side tracking must respect consent.** The blueprint says to send
Purchase events "ignoring browser blockers". The technique is right — most
buyers will be in private browsing, so browser analytics will badly undercount
— but firing events for a visitor who declined in our own cookie banner
bypasses our own consent mechanism, and this catalogue's data reveals someone's
sex life (RODO art. 9). Do it server-side, gate it on stored consent.

**Don't send product names to the CRM.** Order number, amounts, tax data — yes.
Line items — no. Once a year of purchase history sits in someone else's system
it can't be undone.

### Still open

- **CRM: which one, and does it issue real VAT invoices** or only track
  customers? If the latter, invoicing is still unsolved. Adding it also adds a
  data processor — must be listed in `polityka-prywatnosci` and covered by a
  processing agreement.
- **Email sender name.** Currently "Salgo", matching the discreet name used on
  parcels. Arguably should be "Miur" — a mail from an unrecognised name reads as
  phishing. One line in `lib/email/templates/BaseLayout.tsx`.
- **Redis (Upstash).** Recommendation: still skip for v1; the stock buffer
  covers the same risk more cheaply.
- **Production DB host.** CLAUDE.md says DigitalOcean Frankfurt, we run on Neon.
  Note `polityka-prywatnosci` currently lists DigitalOcean as the database
  processor — if Neon is prod, that page is **factually wrong about where
  customer data lives**, which is a compliance defect, not a stale doc.

---

## Known gaps

| Gap | Impact |
|---|---|
| No rate limiting anywhere | Login, register and password reset can be hammered without limit; also burns the email quota. |
| Register reveals whether an email has an account | Normally minor; here it lets someone test an address and learn that person shops here. |
| No email verification at signup | Anyone can register with someone else's address. |
| Guest order pages reachable by URL | Order IDs are sequential, so guessable. Fine for a confirmation page, not once it becomes order history — swap to an opaque token first. |
| No accessibility pass | EAA compliance is legally required. |
| No CI, no real migrations | Still on `drizzle-kit push`; no lint/typecheck gate on merge. |
| `@react-email/components@1.0.12` flagged deprecated on npm | Latest published version, but revisit before launch. |

---

## Waiting on other people

Start these now — they're days of someone else's time and they run in parallel
with development.

| Item | Time | Blocks |
|---|---|---|
| **Przelewy24 sandbox** | 1–3 days | 7.5 — i.e. the only thing between us and selling. Do this first. |
| InPost ShipX merchant account | 1–2 days | 7.4 labels |
| CRM name + whether it invoices | — | Golden Flow step D |
| Resend domain verification for miur.pl | 10 min | Needs DNS access. Until then mail sends from a temporary address and some lands in spam. |
| Google Cloud OAuth credentials | 10 min | Only the "sign in with Google" button. Not critical. |

**erotizo.pl feed — resolved.** Both feeds verified working; this was the
bottleneck with a week of negotiation risk.

---

## Don't accidentally undo these

Things that look wrong but are deliberate:

- **`easyPack.init()` runs exactly once**, from the `Script onReady` handler in
  the checkout page. Called with a single argument it wipes
  `easyPack.pointsToSearch` and restarts the SDK bootstrap; the old code called
  it on every "Wybierz Paczkomat" click and then ran `modalMap()` synchronously,
  racing the async re-fetch of ~534 locker points. Fast connection looked fine,
  slow connection opened an empty map. That was the intermittent "map doesn't
  render" bug.
- **Prices in `createOrder()` come from the products table, never the client
  cart.** This is what stops a tampered cart changing what someone is charged.
- **The order confirmation email's legal sections** (itemised total, delivery
  details, 14-day withdrawal notice) satisfy the durable-medium confirmation
  required by *ustawa o prawach konsumenta* art. 21. Don't strip them for design.
- **`notifyOrderCreated()` swallows send failures** so a Resend outage can't fail
  an order that's already committed.
- **Seller identity lines in emails are omitted, not blank,** when
  `NEXT_PUBLIC_SELLER_*` is unset — otherwise the footer prints "NIP: · REGON:".
- **Safari CSP**: nonce in `style-src`, `unsafe-inline` on `style-src-attr`.
  Safari blocks stylesheets otherwise.

---

## Reference

**Key files**

```
db/schema.ts, db/index.ts, db/seed.ts     database
auth.ts, auth.config.ts                    auth (+ types/next-auth.d.ts)
app/api/auth/*                             register, forgot/reset password
app/api/cart/route.ts, lib/cart/           cart
app/api/orders/route.ts, lib/orders/       orders + notify
lib/email/, lib/email/templates/           transactional mail
lib/checkout/shipping.ts                   shipping rates (flat, v1)
proxy.ts                                   CSP + security headers
lib/env/server-env.ts                      prod env validation
```

**Env vars**

Required in prod: `NEXT_PUBLIC_SITE_URL`, and the seller block
(`NEXT_PUBLIC_SELLER_LEGAL_NAME`, `_ADDRESS_LINE1`, `_NIP`, `_REGON`, `_EMAIL`).
Required to function: `DATABASE_URL`, `AUTH_SECRET`, `RESEND_API_KEY`,
`RESEND_FROM`.
Optional: `AUTH_GOOGLE_ID`/`_SECRET`, `NEXT_PUBLIC_GTM_ID`, seller
`_ADDRESS_LINE2`/`_KRS`/`_PHONE`.
**To add:** the erotizo feed URL (contains a token — env var only).

**Commands**

```bash
npx tsc --noEmit              # typecheck
npx drizzle-kit push          # push schema (dev only)
npx drizzle-kit studio        # inspect DB
npm run dev                   # dev server
npx tsx scripts/preview-emails.tsx   # render emails to .email-preview/
```

**Housekeeping**

- `pnpm-workspace.yaml` is still the placeholder ("set this to true or false") —
  delete or fill in.
- No `.gitignore` at the git root, so `.DS_Store` shows up in every status.
- Test users to clean: `DELETE FROM users WHERE email LIKE 'smoke+%' OR email='test@example.com';`
- Old anon carts: `DELETE FROM carts WHERE user_id IS NULL AND updated_at < NOW() - INTERVAL '1 day';`
- `feat/auth-phase-1-2` branch can be deleted; its commits are in `integration`.

---

## Later

**Phase 10 storefront:** wishlist (stub), reviews (table exists), server-side
catalog filters with cursor pagination, Product JsonLd, canonical URLs on filter
pages, Google OAuth button, account management on `/profile`.

**Phase 11 feeds** (needs the real catalogue first): Google Merchant Center,
Ceneo.pl, Facebook Catalog.

**Post-launch:** search relevance tuning, "często kupowane razem"
recommendations, promo codes, multi-currency, analytics dashboards.

---

*Update this at the end of each phase or when a decision lands. This file plus
CLAUDE.md and AGENTS.md should be enough to resume cold.*
