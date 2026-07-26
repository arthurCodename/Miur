Miur Wellness Store — Project Status & Roadmap
Last updated: 2026-07-26
Current phase: End of Phase 7.6 (order creation) + 7.7 (transactional emails).
Next up: Phase 7.4 (InPost ShipX) and Phase 7.5 (payments — SKIPPED so far, see below).
Branch: integration.

IMPORTANT — 7.5 was deliberately skipped. Orders are created directly on
checkout submit and stay in `pending`; no money is taken. The confirmation
email is sent from createOrder(). When payments land, move the
notifyOrderCreated() call into the payment webhook so confirmations only go
out for orders that were actually paid.

What's fully done
Foundation (Stages 1-2 in the original stack doc)
Next.js 16 (App Router, Turbopack, TypeScript, Tailwind, ESLint) — from Bogdan's Stage 1.
shadcn/ui components + design tokens.
CSP headers with per-request nonces — implemented in proxy.ts (formerly middleware.ts, renamed by Bogdan's Next.js 16 migration).
Neon Postgres + Drizzle ORM (db/index.ts, db/schema.ts).
pg_trgm extension + GIN indexes for search.
Seed script (db/seed.ts).
Cookie consent + legal footer with BDO/NIP/REGON.
SEO scaffolding: sitemap.xml, robots.txt, OrganizationJsonLd, OpenGraph images.
Authentication (Phase 1-2)
Schema:

users: text UUID id, nullable password_hash, name, image, email_verified, role.
accounts table (for OAuth linking — Google OAuth wired in auth.config.ts but no UI button yet).
password_reset_tokens table.
Backend:

auth.config.ts — Edge-safe config with Google provider.
auth.ts — Credentials provider with bcrypt (cost 12), DrizzleAdapter, JWT sessions, cart-merge signIn callback.
app/api/auth/[...nextauth]/route.ts — Auth.js catch-all handler.
app/api/auth/register/route.ts — POST endpoint, zod-validated, bcrypt-hashed.
types/next-auth.d.ts — session.user.id + session.user.role types.
Frontend wiring (Phase 3-4-5):

SessionProvider at the root of app/layout.tsx.
Login page uses signIn("credentials", ...).
Register page POSTs to /api/auth/register then auto-signIn.
Profile page = server component with auth() guard.
Protected pages /moje-zamowienia and /lista-zyczen have auth() guards.
Navbar (AuthNavLink) + Footer (FooterLogoutButton) + Profile (ProfileLogoutButton) all use useSession() / client-side signOut().
LoginFailureReason collapsed to single "invalid_credentials" (security: no email enumeration).
Deleted (zustand mocks):

lib/store/useAuthStore.ts
lib/hooks/useAuthHydrated.ts
lib/store/useAccountsStore.ts (after forgot-password real backend replaced its purpose)
lib/auth/password-reset-session.ts
Forgot password (real)
app/api/auth/forgot-password/route.ts — always-200 response, generates 32-byte token, hashes with SHA-256, stores in password_reset_tokens, sends email via Resend.
app/api/auth/reset-password/route.ts — validates hashed token (not expired, not consumed), bcrypt-hashes new password, invalidates all sibling tokens.
lib/email/send-password-reset.ts — Resend SDK wrapper, Polish subject + text + HTML.
RESEND_API_KEY + RESEND_FROM env vars.
Frontend pages rewired to real endpoints; token now flows via URL search params, not sessionStorage.
Cart (Phase 7.1 + 7.2)
Schema changes:

orders.userId nullable + guestEmail, shippingAddress, billingAddress columns (guest checkout ready).
products.deletedAt — soft delete for products with linked orders.
carts.sessionId nullable + unique constraint on carts.userId (three states: anon, user, merged).
Backend:

lib/cart/cookie.ts — anonymous session cookie helper (miur-cart-session, HttpOnly, 1-year TTL).
lib/cart/zod.ts — server-side item validation (don't trust the browser).
lib/cart/merge.ts — pure merge function (dedup by id, sum quantities, cap at 99).
lib/cart/merge-on-signin.ts — swallows errors, deletes anon row, clears cookie.
app/api/cart/route.ts — GET + POST with routing by session.user.id or cookie.
Frontend:

components/cart/CartSync.tsx — hydrates from server, debounce-syncs mutations, instant-clears on logout transition.
Waits for zustand persist rehydration before setState to avoid race.
Auth.js integration:

signIn callback in auth.ts calls mergeAnonymousCartIntoUserCart(user.id) on every successful login.
Checkout UI (Phase 7.3)
app/checkout/page.tsx — full checkout page:

Contact form (name, e-mail, phone) with zod validation (PL phone + postal-code regexes).
Delivery method toggle: Paczkomat InPost (geowidget modal picker) or courier (street/city/postal form).
Order summary panel (components/checkout/OrderSummary.tsx) driven by useCartStore — line items, subtotal, delivery cost reacting to selected method, free-shipping hint, total, "Ceny zawierają podatek VAT" note.
Shipping rates in lib/checkout/shipping.ts — v1 display values (paczkomat 12,99 zł / kurier 16,99 zł, free ≥ 199 zł). Authoritative pricing must be recomputed server-side in Phase 7.6 — keep in sync.
Guest checkout: no auth guard; banner offers /login?callbackUrl=/checkout. Logged-in users get name/e-mail prefilled from session (only into empty fields).
Empty-cart guard: after hydration, empty cart renders "Twój koszyk jest pusty" + link to /produkty instead of the form.
Consents: Regulamin (required), Polityka prywatności (required), newsletter opt-in (unchecked by default, RODO).
Submit button "Przejdź do płatności" — currently simulates and redirects to /checkout/success; will become the order-create + payment redirect in Phase 7.5/7.6.
Verified end-to-end in browser: empty state, summary math, delivery switch, validation errors, successful submit.
Order creation (Phase 7.6)
app/api/orders/route.ts — POST, zod-validated (lib/orders/zod.ts).
lib/orders/create.ts — resolves the cart server-side, pulls authoritative prices from the products table (never trusts the client cart), snapshots line items, deletes the cart to prevent double-submit.
/checkout/success is now a server component reading the real order, guarded so authenticated orders are only visible to their owner. Guest orders are viewable by URL — order IDs are serial ints, so swap to an opaque token before this becomes an order-history page.
scripts/seed-mock-products.ts — local test data.
Transactional emails (Phase 7.7)
lib/email/templates/ — React Email templates in Polish:
  BaseLayout.tsx — shared shell. Sender brand is "Salgo", never "Miur" (discretion). Seller identity lines are omitted rather than rendered empty when NEXT_PUBLIC_SELLER_* is unset.
  OrderConfirmation.tsx — itemised lines, shipping, total, delivery details, 14-day withdrawal notice. Doubles as the durable-medium confirmation required by ustawa o prawach konsumenta art. 21 — do not strip the legal sections.
  ShippingNotification.tsx — tracking number + carrier link when available.
lib/email/send-order-confirmation.ts + send-shipping-notification.ts — Resend wrappers, same shape as send-password-reset.ts.
lib/orders/notify.ts — notifyOrderCreated() swallows send failures so a Resend outage can't fail a committed order; describeDelivery() is the single source of delivery wording.
scripts/preview-emails.tsx — renders both templates to .email-preview/ (gitignored) with assertions on money math, legal blocks, and brand discretion. Run: npx tsx scripts/preview-emails.tsx
NOT yet wired: the shipping notification has no caller — hook it up in the admin "mark as shipped" action (8.2) or the ShipX label callback (7.4).
Dependency note: @react-email/components@1.0.12 is flagged deprecated on npm despite being the latest published version. Revisit before launch.
InPost widget fix (side-quest)
easyPack.init() was being called on every "Wybierz Paczkomat" click. Called with a single argument it resets easyPack.pointsToSearch to [] and re-runs the full bootstrap; modalMap() then ran synchronously on the next line, racing the async re-fetch of ~534 locker points. Fast connection = fine, slow connection = empty map. That was the intermittent "map doesn't render" bug.
Fix: init() runs exactly once from the Script onReady handler; SDK load moved lazyOnload → afterInteractive; the button now reflects SDK state (loading / ready / error) instead of firing a "try again" toast.
Side-quest fixes done along the way
Safari CSP fix — nonce in style-src, unsafe-inline on style-src-attr.
Node 20 → 22 upgrade (pnpm 11 requires Node 22.13+).
Bogdan's git workflow set up: arthur (team repo) + origin (his fork) with proper fetch-merge-push loop.
Big merge integrating Bogdan's frontend + our auth backend without losing either side.
Type collapse LoginFailureReason (security: don't leak email existence).
Critical path remaining (before a sellable store)
Phase 7.4 — InPost paczkomaty integration
Embed InPost geowidget.
InPost ShipX API account + key.
Function that creates a shipping label when order is paid.
Bottleneck: InPost ShipX merchant account approval (1-2 business days).
Estimated: 2-3 days of code once account is live.

Phase 7.5 — Payments — DECISION PENDING: Stripe or Przelewy24?
Recommendation: Stripe. Better DX, supports BLIK + Przelewy24 as routes under the hood.
Sandbox account (1-3 business days to verify).
Payment session creation (redirect flow).
Payment webhook handler — must be idempotent (Stripe retries).
Payment state machine: pending → paid → failed.
Estimated: 3-5 days.

Phase 7.6 — Order creation
Function creating orders + order_items from cart + address + paid payment session.
Status enum: pending → paid → shipped → cancelled (already in schema).
(Optional) Redis-backed 15-min stock reservation during checkout — skip for v1.
Estimated: 1-2 days.

Phase 7 total: ~10-15 days of focused work. After this, you can sell.

Phase 8 — Operational readiness
8.1 — XML catalog sync from erotizo.pl (~3-5 days)

Vercel Cron daily job (/api/cron/sync-catalog).
Download XML, parse with fast-xml-parser.
Batch upsert (100 at a time) by external_id.
Mark missing products as deleted_at = now() (soft delete).
Log every run to audit_logs.
Bottleneck: getting the feed URL + format docs from erotizo.pl. Call/email them ASAP — this could be a week of negotiation.
8.2 — Admin panel skeleton (~3-5 days)

Route group app/(admin)/ guarded by session.user.role === "admin" (currently unused — see deferred items).
Order list + detail + status transitions.
Product list (read-only, driven by XML sync).
"Mark as shipped" + refund actions.
8.3 — Polish VAT receipts (~2-3 days)

DECISION PENDING: iFirma, wFirma, or manual PDF for soft launch?
Ask your accountant what they use.
8.4 — Recurring jobs (~3-4 days)

Omnibus price tracker — daily cron: snapshot prices into price_history, update products.lowest_price_30_days. Polish/EU legal requirement.
Abandoned cart recovery — find carts inactive >1h, send Resend email.
RODO anonymization — monthly job hashing old IPs in audit_logs.
Phase 9 — Pre-launch hardening
9.1 Rate limiting on auth endpoints (login, register, forgot-password). Upstash Redis + @upstash/ratelimit. (~1 day)
9.2 Sentry for error tracking. (~half a day)
9.3 Real DB migrations — switch from drizzle-kit push to drizzle-kit generate + migrate. (~1 day)
9.4 Code quality hooks — Husky pre-commit, lint-staged, eslint-plugin-jsx-a11y, npm run typecheck script. (~1 day)
9.5 GitHub Actions CI — lint + typecheck + audit on every PR. (~1 day)
9.6 Real product images — Uploadthing / S3 / proxy through erotizo's CDN. (~1-2 days)
9.7 Right-to-be-forgotten (RODO) — admin action anonymizing users while preserving financial records. (~1-2 days)
9.8 Legal + accessibility final pass — walk EU_PL_Compliance/, screen-reader test, Lighthouse >95. (~3-4 days)
Deferred items (not obligatory when we found them, but flagged)
Auth-adjacent (Phase 10)
Google OAuth UI button — provider is wired, needs Google Cloud credentials + a button calling signIn("google").
Email verification at signup — copy the forgot-password token pattern.
Account management on /profile — change email, change password, delete account.
Admin role enforcement — session.user.role is set but nothing reads it yet. Becomes required for Phase 8.2.
Storefront polish (Phase 10)
Wishlist — /lista-zyczen is a stub. Wire to new wishlist_items table.
Reviews — reviews table exists. Build "leave a review" flow after delivery, with is_verified_purchase badge.
Server-side catalog filters with searchParams + cursor pagination.
schema.org/Product JsonLd on product pages.
Canonical URLs on filter pages (avoid duplicate-content SEO).
Marketing feeds (Phase 11, after real catalog exists)
Google Merchant Center feed — XML for Google Shopping ads.
Ceneo.pl feed — for the biggest PL price comparison site.
Facebook Catalog feed — for IG/FB dynamic product ads.
Code hygiene (do whenever)
Delete feat/auth-phase-1-2 branch — its commits are in integration.
Create .gitignore at the git root (one level above miur/) with .DS_Store to stop macOS noise in git status.
Remove pnpm-workspace.yaml if it's still the placeholder ("set this to true or false").
Old test users in users table — cleanup with DELETE FROM users WHERE email LIKE 'smoke+%' OR email='test@example.com';.
Old anon cart rows — DELETE FROM carts WHERE user_id IS NULL AND updated_at < NOW() - INTERVAL '1 day'; (will be replaced by Phase 8.4 abandoned-cart cron).
Redundant PATH line in ~/.zshrc for node@20 (was added during upgrade, now hardcodes to an unlinked version).
Post-launch backlog
Search improvements (relevance, filters, unaccent extension for Polish).
Recommendation engine ("często kupowane razem").
Loyalty program / promo codes.
Multi-currency / multi-region.
Analytics dashboards.
A/B testing infrastructure.
Decisions still open
Payments: Stripe vs Przelewy24 direct. Recommendation: Stripe.
Receipts: iFirma, wFirma, or manual PDF. Ask accountant.
Product images: Uploadthing, S3, or proxy through erotizo's CDN.
Background jobs runner: Inngest vs Vercel Cron. Recommendation: Vercel Cron for v1.
Redis (Upstash) — for hot carts + atomic stock reservation. Recommendation: skip for v1.
Production DB host — CLAUDE.md says DigitalOcean Frankfurt but we're on Neon. Which is prod?
Session/verification_tokens tables — skipped for now (JWT sessions, no email verify). Add if we ever need database sessions or verification tokens.
Fork workflow vs direct push — Bogdan uses fork + PR. Arthur has been pushing direct. Decide if Arthur should also open PRs for review consistency.
External bottlenecks (get started in parallel with dev work)
erotizo.pl XML feed — call/email now, blocks Phase 8.1.
Stripe or Przelewy24 sandbox — 1-3 business days to verify.
InPost ShipX merchant account — 1-2 business days.
iFirma/wFirma account — 1-2 business days.
Google Cloud OAuth credentials — 10 minutes if you have the account.
Resend domain verification for miur.pl — 10 minutes once DNS is accessible.
DNS access to miur.pl — needed for Resend verification.
Estimated calendar time to launch
Depending on mode and time commitment:

Scenario Time to launch
Hybrid mode + near-full-time + external deps resolved early 4-6 weeks
Realistic (part-time, teach-mode for some) 8-12 weeks
Sporadic time + erotizo XML access delays 3-5 months
Key file locations reference
DB schema: db/schema.ts + db/index.ts + db/seed.ts
Auth config: auth.config.ts + auth.ts + types/next-auth.d.ts
Auth API routes: app/api/auth/[...nextauth]/route.ts + app/api/auth/register/route.ts + app/api/auth/forgot-password/route.ts + app/api/auth/reset-password/route.ts
Cart: app/api/cart/route.ts + lib/cart/ + components/cart/CartSync.tsx + lib/store/useCartStore.ts
Email: lib/email/send-password-reset.ts
Security headers / CSP: proxy.ts
Environment: .env.example + .env.local (never commit real values)
Env validation (prod): lib/env/server-env.ts
Required env vars (reference)
Required in production (from lib/env/server-env.ts):

NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SELLER_LEGAL_NAME, NEXT_PUBLIC_SELLER_ADDRESS_LINE1, NEXT_PUBLIC_SELLER_NIP, NEXT_PUBLIC_SELLER_REGON, NEXT_PUBLIC_SELLER_EMAIL
Required for functionality:

DATABASE_URL (Neon)
AUTH_SECRET (Auth.js session signing — generate with openssl rand -base64 32)
RESEND_API_KEY, RESEND_FROM (transactional email)
Optional for now:

AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET (Google OAuth — not surfaced in UI yet)
NEXT_PUBLIC_GTM_ID (Google Tag Manager)
NEXT_PUBLIC_SELLER_ADDRESS_LINE2, NEXT_PUBLIC_SELLER_KRS, NEXT_PUBLIC_SELLER_PHONE
Frequently used commands

# Type-check

npx tsc --noEmit

# Push schema changes (dev only — use generate+migrate in prod)

npx drizzle-kit push

# Inspect DB

npx drizzle-kit studio

# Dev server

npm run dev

# Sync fork (Bogdan's workflow)

git fetch arthur && git merge arthur/integration && git push origin main

# Type check + build

npm run build
End of status doc. Save as MIUR_PROJECT_STATUS.md in the repo (or personal notes). Update at end of each phase or when a major decision lands. If handing off to a fresh session, this doc + CLAUDE.md + AGENTS.md is enough context to resume.
