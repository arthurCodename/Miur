# Safe Commit Playbook - 2026-05-06

Use this order to create 3 clean commits without pushing.

## 0) Pre-check
```bash
git status
npm run lint
npm run build
```

## 1) Commit A - Catalog/App expansion

### Stage files
```bash
git add \
  app/(auth) app/bestsellery app/blog app/checkout app/dostawa-platnosc app/dyskretna-paczka \
  app/kategorie app/lista-zyczen app/masturbatory app/moje-zamowienia app/o-nas app/produkt \
  app/produkty app/profile app/program-partnerski app/search app/wibratory app/wyprzedaz \
  components/catalog components/checkout components/layout/AuthNavLink.tsx \
  components/layout/CartIcon.tsx components/layout/FooterLogoutButton.tsx \
  components/layout/SearchConsole.tsx components/layout/StubPage.tsx \
  components/ui/AddToCartButton.tsx components/ui/skeleton.tsx \
  lib/api lib/cart lib/catalog/category-by-slug.ts lib/catalog/find-mock-product.ts \
  lib/env lib/hooks lib/inpost lib/observability lib/store lib/ui \
  lib/catalog/data/mock-products.ts lib/catalog/types.ts lib/blog/posts.ts \
  middleware.ts .env.example
```

### Verify staged set
```bash
git diff --cached --name-only
```

### Commit message
```text
feat: add core catalog and commerce app routes

Introduce product, category, blog, checkout, search, and account-related routes,
plus shared catalog/cart/auth modules to support the storefront user flow.
```

---

## 2) Commit B - Layout/consent/SEO refactor

### Stage files
```bash
git add \
  app/layout.tsx app/error.tsx app/robots.ts app/sitemap.ts \
  components/AccessibilityWidget.tsx \
  components/layout/AgeGate.tsx components/layout/BestSellers.tsx \
  components/layout/ConsentScripts.tsx components/layout/CookieBanner.tsx \
  components/layout/CookieConsentContext.tsx components/layout/Footer.tsx \
  components/layout/Hero.tsx components/layout/Navbar.tsx \
  components/layout/WyprzedazSection.tsx \
  components/seo/JsonLd.tsx components/ui/dialog.tsx components/ui/sheet.tsx \
  next.config.ts eslint.config.mjs package.json
```

### Verify staged set
```bash
git diff --cached --name-only
```

### Commit message
```text
refactor: update shell, consent flow, and SEO configuration

Refresh layout and navigation components, improve consent/accessibility integration,
and align metadata and config for the expanded storefront structure.
```

---

## 3) Commit C - Repository cleanup and lockfile normalization

### Stage files
```bash
git add \
  .gitignore pnpm-lock.yaml WORKLOG_2026-05-06.md COMMIT_BATCHES_2026-05-06.md \
  -A Skills.md obsidian-local-rest-api/main.js obsidian-local-rest-api/manifest.json \
  onlinestore.md repomix-output.xml package-lock.json
```

### Verify staged set
```bash
git diff --cached --name-only
```

### Commit message
```text
chore: remove local artifacts and standardize lockfile

Clean up non-runtime files from the repository and keep dependency locking aligned
with pnpm for a predictable development workflow.
```

---

## Per-commit command template
Use this template for each staged batch:
```bash
git commit -m "$(cat <<'EOF'
<paste title line>

<paste body line 1>
<paste body line 2>
EOF
)"
```

## Final verification
```bash
git status
git log --oneline -n 5
```
