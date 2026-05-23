# Backend Integration Guide — Miur

> **Audience:** backend developer joining the Miur project.
> **Goal:** understand the frontend architecture, find every integration point
> in <30 minutes, and ship the backend without rewriting any UI code.

---

## 1. Project at a glance

- **Product:** Miur — B2C wellness e-commerce store for the Polish market.
- **Model:** dropshipping (no own inventory). Supplier: erotizo.pl.
- **Shipping brand:** "Salgo" (privacy-focused, anonymous sender on labels).
- **Frontend:** Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind 4, shadcn/ui, Zustand, react-hook-form + Zod, framer-motion.
- **Hosting:** Vercel (frontend) + DigitalOcean Frankfurt (PostgreSQL planned).
- **Domain prefix in code:** Polish UI labels everywhere, but data shapes and code are English.

### Repo layout

```
Miur/                          ← git root
  miur/                        ← Next.js project (this folder)
    app/                       ← App Router pages, routes, layouts
    components/                ← React components (server + client)
    lib/
      api/                     ← API layer (THE integration boundary)
      auth/                    ← Auth schemas, types, helpers
      blog/                    ← Blog data + types
      cart/                    ← Price parsing, formatting
      catalog/                 ← Product types + mock data + supplier adapter
      env/                     ← Production env validation
      hooks/                   ← React hooks (auth-hydration, mounted, etc.)
      inpost/                  ← InPost widget TypeScript types
      legal/                   ← Seller data + ODR URL
      navigation/              ← Breadcrumbs
      observability/           ← Error reporting (Sentry stub)
      store/                   ← Zustand stores (cart, auth, accounts)
      ui/                      ← Shared Tailwind class snippets
    public/                    ← Static assets (fonts, video, images)
    proxy.ts                   ← CSP nonce middleware (Next.js 16 convention)
    next.config.ts             ← Redirects, rewrites, security headers
```

### Key files you will edit / replace

| File                                | Purpose                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------- |
| `lib/api/products.ts`               | All product reads (replace mock data with real fetch)                   |
| `lib/blog/posts.ts`                 | Blog reads (replace mock with CMS)                                      |
| `lib/store/useAccountsStore.ts`     | **MOCK ONLY** — full replacement required (see Auth section)            |
| `lib/store/useAuthStore.ts`         | Holds current user; will read from session cookie / API                 |
| `lib/catalog/adapters/mapSupplierFields.ts` | Example mapping from supplier feed → `BestsellerProduct`        |
| `lib/legal/seller.ts`               | Reads seller data from env vars (no DB needed)                          |
| `app/checkout/page.tsx`             | `onSubmit()` is mocked — replace with real order creation               |
| `app/api/...` (does not exist yet)  | **You will create this** for server routes if needed                    |

---

## 2. Architectural principles you must respect

### a) Server Components first

Most pages are React Server Components (RSC). They call `lib/api/*` functions
directly — no `useEffect` for data fetching, no client-side `fetch()` in pages.

Example pattern in `app/produkty/page.tsx`:

```ts
export default async function ProduktyPage() {
  const products = await getAllProducts();  // ← runs on server
  return <ProductsGrid products={products} />;
}
```

**For you:** replace the body of each `lib/api/*` function with `fetch()` to
your backend. Add `cache: "no-store"` or Next.js `revalidate` as appropriate.
**Do not** convert pages to client components — preserve RSC pattern.

### b) Single API entry point per data type

The frontend never imports mock files directly. It always goes through
`lib/api/*` functions. This is enforced by code review.

| Data           | Entry point                                                |
| -------------- | ---------------------------------------------------------- |
| All products   | `getAllProducts()`                                         |
| Single product | `getProductBySlug(slug)`                                   |
| Category page  | `getCategoryProducts(slug, sort?)`                         |
| Bestsellers    | `getBestsellers()`                                         |
| Wyprzedaż      | `getWyprzedazProducts()`, `getWyprzedazTiles()`            |
| Search         | `searchProducts(query)`                                    |
| Reviews        | `getProductReviews(slug)`                                  |
| Blog list      | `getBlogPosts()`                                           |
| Blog post      | `getBlogPostBySlug(slug)`                                  |

When wiring real backend, **keep the same function signatures** — that way no
calling code changes.

### c) Mock latency in dev only

`lib/api/products.ts` injects an artificial 1.5s delay in dev so designers see
skeleton loading states. Controlled by:

```bash
NEXT_PUBLIC_MOCK_DELAY_MS=0   # disable even in dev
```

Production already has zero delay. When you replace mocks with real `fetch`,
remove the `mockDelay()` calls.

### d) Polish currency formatting

Mock prices are stored as formatted strings: `"349,00 zł"`. The cart layer
parses these via `lib/cart/parse-pl-price.ts`. When you switch to real data,
**either** keep formatted strings (simpler) **or** switch to numbers and update
the `BestsellerProduct.price` type + adapter.

Recommended: keep formatted strings on the wire, generate them in the adapter
(`mapSupplierProductToBestseller`) — UI never has to think about locale.

---

## 3. Data contracts (TypeScript types)

These are the contracts you must satisfy. They live in `lib/catalog/types.ts`
and `lib/blog/types.ts`.

### Product (`BestsellerProduct`)

```ts
type BestsellerProduct = {
  id: string;                       // stable backend ID
  slug: string;                     // URL-safe, unique
  name: string;                     // display name (Polish)
  category: string;                 // category title (Polish), matches Category.title
  price: string;                    // "349,00 zł" — formatted PLN
  oldPrice: string | null;          // for discount badge
  omnibus: string | null;           // lowest price in last 30 days (Polish law — Omnibus directive)
  hygieneReturnExcluded?: boolean;  // true → no 14-day return (sealed hygiene products)
  image: string;                    // primary product image (absolute URL)
  hoverImage: string;               // secondary image on hover
  tag: string | null;               // "Bestseller", "Promocja", "-46%" etc.
};
```

**Important:** `omnibus` is legally required for any discounted product in
Poland (Omnibus directive, 2023). If `oldPrice != null` then `omnibus` should
also be set. Adapter handles this in `mapSupplierFields.ts`.

### Blog post (`BlogPost`)

```ts
type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;                    // absolute URL
  category: string;                 // "Edukacja", "Zdrowie", "Wellness" etc.
  readTime: string;                 // pre-formatted, e.g. "5 min"
  publishedAt: string;              // pre-formatted PL date, e.g. "12 marca 2026"
  sponsored?: boolean;              // shows "Materiał sponsorowany" badge — UOKiK compliance
};
```

### Review (`ProductReview`)

```ts
type ProductReview = {
  id: string;
  author: string;                   // display name or initial
  rating: number;                   // 1–5
  comment: string;
  date: string;                     // pre-formatted PL date
  isVerified: boolean;              // shows "Zakup potwierdzony" badge
};
```

### Supplier feed adapter

Already implemented in `lib/catalog/adapters/mapSupplierFields.ts`. Takes raw
supplier data with this shape:

```ts
type SupplierProductLike = {
  externalId: string;
  slug?: string;                    // optional — auto-slugified if missing
  name: string;
  categoryName?: string;
  priceGross: number;               // PLN
  oldPriceGross?: number | null;
  lowestPrice30dGross?: number | null;
  imageUrl: string;
  secondImageUrl?: string | null;
  label?: string | null;
};
```

When you parse the erotizo.pl XML feed, normalise to this shape, then
`mapSupplierProductToBestseller()` returns a ready `BestsellerProduct`.

---

## 4. Integration points (where to wire the backend)

### 4.1 Authentication — full replacement required

**Status:** currently 100% mocked in browser `localStorage`. Passwords stored
in plain text. Marked with `MOCK ONLY` JSDoc warning in
`lib/store/useAccountsStore.ts`. **Must be replaced before any real users.**

#### Current flow

| Action                | Frontend file                                  | Mock behaviour                                       |
| --------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| Register              | `app/(auth)/register/page.tsx`                 | `useAccountsStore.register(email, password)`         |
| Login                 | `app/(auth)/login/page.tsx`                    | `useAuthStore.login(email, password)`                |
| Logout                | `components/layout/FooterLogoutButton.tsx`     | `useAuthStore.logout()` (clears localStorage)        |
| Request reset email   | `app/(auth)/forgot-password/page.tsx`          | Checks if email exists, stores in sessionStorage     |
| Set new password      | `app/(auth)/forgot-password/reset/page.tsx`    | Reads email from sessionStorage, calls `resetPassword` |

#### Result types (already defined)

```ts
type LoginResult =
  | { ok: true }
  | { ok: false; reason: "account_not_found" | "wrong_password" };

type RegisterResult = { ok: true } | { ok: false; reason: "email_taken" };

type ResetPasswordResult = { ok: true } | { ok: false; reason: "account_not_found" };
```

User-facing error messages are centralised in `lib/auth/messages.ts` (Polish).

#### Backend contract — recommended

Replace `useAccountsStore` methods with HTTP calls. **Keep the same function
signatures and Result types**, so login/register/reset pages don't need any
changes.

| Method                                       | Suggested endpoint                                                    |
| -------------------------------------------- | --------------------------------------------------------------------- |
| `register(email, password): Promise<RegisterResult>` | `POST /api/auth/register`                                     |
| `verifyLogin(email, password): Promise<LoginResult>` | `POST /api/auth/login` → sets HttpOnly session cookie         |
| `resetPassword(email, newPassword): Promise<ResetPasswordResult>` | `POST /api/auth/reset-password`                  |
| (new) `requestPasswordReset(email)`          | `POST /api/auth/forgot-password` → sends email with token             |
| (new) `getCurrentUser()`                     | `GET  /api/auth/me` → reads session cookie, returns `User \| null`    |
| (new) `logout()`                             | `POST /api/auth/logout` → clears session cookie                       |

**Password reset:** the frontend currently uses a sessionStorage hack to carry
the email between the two reset steps. In a real backend you would:

1. `/api/auth/forgot-password` sends a **signed token** to email
2. Reset page reads the token from URL query (`/forgot-password/reset?token=...`)
3. Submits `{ token, newPassword }` to `/api/auth/reset-password`

This change requires updating `app/(auth)/forgot-password/reset/page.tsx` to
read `token` from `useSearchParams()` instead of `getPendingPasswordResetEmail()`.
Small change.

#### Session strategy

Recommended: HttpOnly cookie with JWT or session ID. Frontend will then:

- Drop `useAuthStore` `persist` entirely (no localStorage)
- Replace it with a Server Component that reads the cookie via
  `cookies()` from `next/headers` and exposes user data through React context

This is a 1-day refactor. For initial backend ship, you can also keep the
client-side `useAuthStore` and have it call `/api/auth/me` on mount.

#### Auth-related routes (already exist)

- `/login`, `/logowanie` — login page
- `/register`, `/rejestracja` — registration
- `/forgot-password`, `/odzyskaj-haslo` — request reset
- `/forgot-password/reset`, `/odzyskaj-haslo/ustaw` — set new password
- `/profile` — logged-in user only (auto-redirects to `/login` if not auth)

All `/login*`, `/register*`, `/forgot-password*`, `/profile`, `/checkout` are
already `noindex` via layout-level metadata.

---

### 4.2 Products

**Status:** mock data in `lib/catalog/data/mock-products.ts`.

#### Replace these functions in `lib/api/products.ts`

```ts
// before (mock):
export async function getAllProducts(): Promise<BestsellerProduct[]> {
  const merged = dedupeProductsById([...MOCK_BESTSELLERS, ...MOCK_WYPRZEDAZ_PRODUCTS]);
  return merged;
}

// after (real):
export async function getAllProducts(): Promise<BestsellerProduct[]> {
  const res = await fetch(`${API_BASE}/products`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Failed to load products");
  const raw: SupplierProductLike[] = await res.json();
  return raw.map(mapSupplierProductToBestseller);
}
```

#### Suggested endpoints

| Frontend function            | Suggested endpoint                              |
| ---------------------------- | ----------------------------------------------- |
| `getAllProducts()`           | `GET /api/products`                             |
| `getProductBySlug(slug)`     | `GET /api/products/:slug`                       |
| `getCategoryProducts(slug,sort)` | `GET /api/categories/:slug/products?sort=`  |
| `searchProducts(query)`      | `GET /api/products/search?q=`                   |
| `getProductReviews(slug)`    | `GET /api/products/:slug/reviews`               |

#### Caching strategy

Next.js 16 supports `cache: "force-cache"`, `next: { revalidate: 300 }`, and
tag-based invalidation via `next: { tags: ["products"] }`. Use:

- Product list pages → `revalidate: 300` (5 min)
- Single product → `revalidate: 60` (or tag-based invalidation on stock change)
- Reviews → `revalidate: 60`
- Search → `cache: "no-store"`

When you push from CMS, call `revalidateTag("products")` from a webhook route.

---

### 4.3 Cart

**Status:** 100% client-side via Zustand `persist` to localStorage. **This is
intentional and should stay** for guest users.

For logged-in users, you may want to **sync** the cart to the backend so it
follows the user across devices. Strategy:

1. Keep `useCartStore` as-is (single source of truth on client)
2. On login: pull server cart, merge with local, push merged state
3. On every `addItem` / `updateQuantity` / `removeItem`: debounced POST to
   `PUT /api/cart` with the full items array

The cart store already has all the hooks you need. Look at `lib/store/useCartStore.ts`
— it exposes `subscribe()` which you can use to detect changes.

Cart item shape (already in code):

```ts
type CartItem = {
  id: string;        // product ID
  slug: string;
  name: string;
  price: number;     // PLN as float, NOT formatted string
  image: string;
  category: string;
  quantity: number;  // clamped to max 99 client-side
};
```

---

### 4.4 Checkout & Orders — **most important integration**

**Status:** form fully validated client-side; `onSubmit` is mocked with a
`setTimeout(800)` and toast.

#### Where to wire

`app/checkout/page.tsx`, function `onSubmit`. Currently:

```ts
async function onSubmit(_data: CheckoutFormValues) {
  if (process.env.NODE_ENV !== "production") {
    await new Promise((resolve) => setTimeout(resolve, 800));
  }
  toast.success("Zamówienie złożone");
  router.push("/checkout/success");
}
```

Replace with:

```ts
async function onSubmit(data: CheckoutFormValues) {
  const cart = useCartStore.getState().items;
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, items: cart }),
  });
  if (!res.ok) {
    toast.error("Nie udało się złożyć zamówienia. Spróbuj ponownie.");
    return;
  }
  const { paymentUrl, orderId } = await res.json();
  // Clear cart after server confirms order is created
  useCartStore.getState().clearCart();
  // Redirect to Przelewy24
  window.location.href = paymentUrl;
}
```

#### Checkout form data (`CheckoutFormValues`)

Zod schema lives in `app/checkout/page.tsx`. Includes:

- `fullName`, `email`, `phone` (Polish phone regex enforced)
- `deliveryMethod`: `"paczkomat" | "courier"`
- If `paczkomat`: `paczkomatCode` (e.g. "WAW123M"), `paczkomatAddress`
- If `courier`: `addressLine`, `city`, `postalCode` (PL `NN-NNN` format)
- `acceptTerms` (required, GDPR/UoPK)
- `acceptPrivacy` (required, RODO art. 13)
- `marketingOptIn` (optional)

#### Payment flow (Przelewy24)

Decided stack: Przelewy24 supports BLIK, Google Pay, Apple Pay, cards, transfers.
The frontend will redirect to Przelewy24's hosted checkout page after order
creation. After payment:

- Success: P24 redirects to `/checkout/success?p24=...`
- Failure: P24 redirects to `/checkout?p24_error=...` (you'll need to handle)
- Webhook: P24 calls your `POST /api/webhooks/p24` to confirm payment

The `/checkout/success` page already clears the cart and shows a placeholder
order number. Update it to read the real `orderId` from query params.

#### Shipping (InPost ShipX + paczkomaty)

InPost widget is already integrated in `app/checkout/page.tsx`:

- SDK loaded via `<Script>` from `geowidget.easypack24.net`
- When user picks a paczkomat, the form gets `paczkomatCode` + `paczkomatAddress`
- TypeScript types in `lib/inpost/types.ts`

You will need to:

1. Sign up for InPost ShipX API (separate from the widget)
2. Create shipping labels via `POST /v1/organizations/:id/shipments`
3. Webhook to receive tracking updates
4. Email tracking number via Resend

**Important:** all labels must show sender as **"Salgo"**, not "Miur". This is
a hard product requirement (privacy / discrete shipping). Make sure your
ShipX `sender` config is set accordingly.

#### Order data model (suggested)

```ts
type Order = {
  id: string;                     // ORD-XXXXXX
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";
  userId: string | null;          // null for guest checkout
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  delivery:
    | { type: "paczkomat"; code: string; address: string }
    | { type: "courier"; addressLine: string; city: string; postalCode: string };
  items: CartItem[];              // snapshot at order time
  totalGross: number;             // PLN
  payment: {
    provider: "p24";
    sessionId: string;
    paidAt: string | null;
  };
  shipment: {
    provider: "inpost";
    trackingNumber: string | null;
    labelUrl: string | null;
  };
  consents: {
    acceptTerms: boolean;
    acceptPrivacy: boolean;
    marketingOptIn: boolean;
  };
  createdAt: string;
  updatedAt: string;
};
```

---

### 4.5 Newsletter

**Status:** `components/layout/FooterNewsletter.tsx` — toast-only, no backend
call. Has email validation + GDPR consent checkbox.

#### What to add

`POST /api/newsletter` with body `{ email: string, consentGivenAt: string }`.
Use double opt-in: send confirmation email via Resend, only add to list when
user clicks the link.

In the frontend, replace the `toast.success(...)` with a real fetch. The UI
already says "Sprawdź skrzynkę — wyślemy link potwierdzający" so it matches
the double opt-in flow.

---

### 4.6 Reviews

**Status:** `ProductReviewForm` calls `toast.success` only. Reviews are
mocked in `lib/api/products.ts` via `MOCK_REVIEWS_BY_SLUG`.

#### What to add

- `POST /api/products/:slug/reviews` with `{ author, rating, comment }`
- Should require auth (`useAuthStore.user`)
- Server should set `isVerified: true` only if user has actually purchased the
  product (lookup in orders table)
- Reviews should go through moderation (admin panel later) — toast already says
  "Twoja opinia została wysłana do moderacji"

Wire in `components/catalog/ProductReviewForm.tsx`, function `onSubmit`.

---

### 4.7 Search

**Status:** `searchProducts` filters mock products by name/category/slug/tag
substring (case-insensitive).

#### What to add

- Move filtering to backend: `GET /api/products/search?q=`
- Consider Postgres `tsvector` or Algolia / Meilisearch for fuzzy search and
  Polish stemming
- Current frontend already supports `?q=` query param and uses `searchProducts`
  as single entry point — just swap the implementation

---

## 5. Environment variables

`lib/env/server-env.ts` validates these on **Vercel production builds only**
(skipped in dev/preview). Build fails if any are missing.

| Variable                              | Required | Notes                                                     |
| ------------------------------------- | -------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                | ✅       | e.g. `https://miur.pl`                                    |
| `NEXT_PUBLIC_SELLER_LEGAL_NAME`       | ✅       | Registered company / sole-trader name                     |
| `NEXT_PUBLIC_SELLER_ADDRESS_LINE1`    | ✅       | Street + number                                           |
| `NEXT_PUBLIC_SELLER_ADDRESS_LINE2`    | ⚠️       | Postal code + city (recommended for display)              |
| `NEXT_PUBLIC_SELLER_NIP`              | ✅       | Exactly 10 digits, no spaces/dashes                       |
| `NEXT_PUBLIC_SELLER_REGON`            | ✅       | 9 or 14 digits                                            |
| `NEXT_PUBLIC_SELLER_KRS`              | ⚠️       | Only for limited companies (sp. z o.o., S.A.)             |
| `NEXT_PUBLIC_SELLER_EMAIL`            | ✅       | Customer support email (must work for legal notifications)|
| `NEXT_PUBLIC_SELLER_PHONE`            | ⚠️       | Phone for legal contact                                   |

**These are `NEXT_PUBLIC_*` because the seller data is displayed in the
footer, regulamin, privacy policy, withdrawal form, and complaint form.**
Polish law (UŚUDE art. 5) requires these to be visible to every visitor.

#### You will also add (when implementing backend)

| Variable                  | Purpose                                                |
| ------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`            | PostgreSQL connection                                  |
| `JWT_SECRET` / `AUTH_SECRET` | Sign session tokens                                 |
| `P24_MERCHANT_ID`         | Przelewy24                                             |
| `P24_API_KEY`             | Przelewy24                                             |
| `P24_CRC`                 | Przelewy24                                             |
| `INPOST_API_KEY`          | InPost ShipX                                           |
| `INPOST_ORG_ID`           | InPost ShipX                                           |
| `RESEND_API_KEY`          | Transactional email                                    |
| `EROTIZO_FEED_URL`        | Supplier XML feed                                      |

To skip env validation during emergency rebuilds (NOT recommended):
`NEXT_PUBLIC_SKIP_ENV_VALIDATION=1`.

---

## 6. Security model

### CSP nonce

`proxy.ts` generates a fresh nonce per request and sets a strict CSP:

- `script-src 'self' 'nonce-XXX' 'strict-dynamic' <allowed hosts>`
- Production has **no** `'unsafe-inline'` for scripts
- Pages read the nonce via `headers().get("x-nonce")` and pass it to every
  `<Script>` they render

**When you add a new third-party domain** (Sentry, Stripe widget, analytics,
etc.), update the relevant array in `proxy.ts`:

- `SCRIPT_HOSTS` — script sources
- `CONNECT_HOSTS` — `fetch`/`XHR` targets
- `IMG_HOSTS` — image origins
- `STYLE_HOSTS` — external stylesheets
- `FRAME_HOSTS` — `<iframe>` sources

### Cookies & consent

- Google Consent Mode v2 is set to **denied** by default
- GA / GTM / Meta Pixel scripts only load after the user grants consent in
  `<CookieBanner>` (`components/layout/CookieBanner.tsx`)
- For backend cookies: use `HttpOnly`, `Secure`, `SameSite=Lax`
- Session cookie should NOT be accessible to JS — read it server-side only

### Other security headers (in `next.config.ts`)

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- HSTS (Vercel only)

---

## 7. Polish e-commerce compliance (legal hard requirements)

These are **not optional** — they are mandatory under EU and Polish law.

### a) Omnibus directive (2023)

For every discounted product, you must show the lowest price in the last 30
days. Already wired:

- `BestsellerProduct.omnibus: string | null`
- Displayed in `ProductCard`, `ProductDetailSection`

**Backend responsibility:** store price history per product. When you flag
a product as discounted (`oldPrice != null`), compute and store
`lowestPrice30dGross` and include it in the API response.

### b) RODO (GDPR art. 13)

Privacy policy already drafted at `/polityka-prywatnosci`. When users register
or check out, you must:

- Log consent timestamps (`marketingOptIn`, `acceptPrivacy`)
- Provide data export / deletion endpoints (right to be forgotten)
- Notify supervisory authority of any breach within 72h

### c) UoPK — Polish Consumer Rights Act

- 14-day withdrawal right for distance sales (we have `WithdrawalForm` component)
- **Exception:** sealed hygiene products (`hygieneReturnExcluded: true`)
- ODR platform link required in footer (`lib/legal/seller.ts` exports `ODR_URL`)

### d) UoŚUDE art. 5

Seller identification must be visible from every page. Footer reads it from
`sellerLegal` (which reads from env vars). Don't remove the footer block.

### e) EAA — European Accessibility Act

Effective June 2025. The site must be WCAG 2.1 AA compliant. Frontend has:

- Skip-link, semantic landmarks, focus-visible on all interactive elements
- `aria-label`, `aria-describedby`, `aria-live`, `role="alert"` correctly used
- `AccessibilityWidget` for high-contrast / dyslexic-friendly / large text modes

**Don't break this** when adding backend-driven UI.

### f) UOKiK (consumer protection authority)

- Sponsored blog content must show "Materiał sponsorowany" label
  (already wired via `BlogPost.sponsored`)
- No dark patterns in checkout (pre-selected addons, hidden fees)
- Newsletter must use double opt-in

---

## 8. Third-party services

### Already integrated (frontend types/widgets ready)

- **InPost paczkomaty widget** — `app/checkout/page.tsx` + `lib/inpost/types.ts`
- **Google Tag Manager / Analytics** — `components/layout/ConsentScripts.tsx`
  (loads only after consent)

### To integrate (backend)

- **Przelewy24** — payments (BLIK, Google Pay, Apple Pay, cards)
- **InPost ShipX** — shipping labels API
- **Resend** — transactional email (order confirmation, password reset,
  newsletter double opt-in)
- **erotizo.pl XML feed** — product catalog source

### Recommended additions

- **Sentry** — frontend has `lib/observability/report-error.ts` ready with
  TODO marker; just add the SDK and replace the prod branch
- **Cloudflare** — sits in front of Vercel to reduce bandwidth cost (decided)
- **Algolia or Meilisearch** — when search becomes a bottleneck

---

## 9. Mock data you can delete after backend lands

| File                                            | Action                                            |
| ----------------------------------------------- | ------------------------------------------------- |
| `lib/catalog/data/mock-products.ts`             | Delete entirely once API works                    |
| `lib/store/useAccountsStore.ts`                 | **Delete entirely** — replace with API calls      |
| `lib/auth/password-reset-session.ts`            | Delete — replace with URL token (see Auth section)|
| Mock review constants in `lib/api/products.ts`  | Delete `MOCK_REVIEWS_DEFAULT`, `MOCK_REVIEWS_BY_SLUG` |
| Mock blog posts in `lib/blog/posts.ts`          | Delete `MOCK_BLOG_POSTS` once CMS is connected    |
| Mock latency calls (`mockDelay()`)              | Delete from all `lib/api/*.ts` functions          |

**Do not delete** any `lib/api/*` or `lib/catalog/*` function — just replace
the function body. Callers (pages, components) must not change.

---

## 10. Local dev quickstart

```bash
cd miur
npm install
cp .env.example .env.local        # if .env.example exists; otherwise see env section above
npm run dev                       # webpack dev server on http://127.0.0.1:3000
npm run dev:turbo                 # Turbopack variant (faster HMR)
npm run build                     # production build
npm run lint                      # ESLint
npx tsc --noEmit                  # TypeScript check
```

Disable artificial mock delay while testing:

```bash
NEXT_PUBLIC_MOCK_DELAY_MS=0 npm run dev
```

Skip env validation (only if your `.env.local` is incomplete and you need
to test the build):

```bash
NEXT_PUBLIC_SKIP_ENV_VALIDATION=1 npm run build
```

---

## 11. Suggested implementation order

1. **Database schema** — products, categories, users, sessions, orders,
   reviews, blog posts, newsletter subscribers
2. **Auth API** — register, login, logout, /me, forgot/reset password
3. **Frontend auth swap** — replace `useAccountsStore` with API calls
   (preserve method signatures + Result types)
4. **Products API + supplier sync job** — parse erotizo XML feed nightly,
   upsert into DB, expose `/api/products*` endpoints
5. **Frontend product swap** — replace `lib/api/products.ts` mock bodies
   with real `fetch`
6. **Cart sync (optional)** — sync logged-in user's cart server-side
7. **Checkout + Przelewy24** — order creation + payment redirect + webhook
8. **InPost ShipX** — label creation on payment success
9. **Resend transactional emails** — order confirmation, shipping, password reset
10. **Newsletter** — double opt-in via Resend
11. **Reviews moderation** — admin endpoint, link to order verification
12. **CMS for blog** — Sanity, Strapi, or markdown-in-git; expose
    `/api/blog*`

---

## 12. Where to ask questions

- **Bogdan** (owner, frontend, infra, DB design) — privacy & legal compliance
- **Arthur** (fullstack) — integration questions, code style, deployment
- `AGENTS.md` — Next.js version-specific gotchas (read it!)
- `node_modules/next/dist/docs/` — bundled official Next.js 16 docs

---

**Last updated:** with QA audit on 2026-05-23, after Bloki 6–11 + Next.js 16
middleware→proxy migration. Build is green (TSC + ESLint + production build,
zero warnings).
