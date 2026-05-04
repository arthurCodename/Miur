# Miur Wellness Store - Architecture & Implementation Plan
**Status:** Planning & Initial Setup
**Compliance Target:** EU & Poland (RODO, Dyrektywa Omnibus, EAA / WCAG 2.1 AA, PSD2)

## ЕТАП 1: Infrastructure & Core Setup (Базовий рівень)

### 1.1. Ініціалізація та Лінтери
- [ ] Створити проект: `npx create-next-app@latest` (App Router, TypeScript, Tailwind, ESLint).
- [ ] Налаштувати абсолютні імпорти (Alias) у `tsconfig.json` (`"@/*": ["./*"]`).
- [ ] Встановити та налаштувати Prettier + плагін `prettier-plugin-tailwindcss`.
- [ ] Налаштувати Husky: `npx husky init`.
- [ ] Додати pre-commit hook: `npx lint-staged` (ESLint та Prettier на змінених файлах).
- [ ] Додати type-check hook у `package.json` (`"typecheck": "tsc --noEmit"`).
- [ ] **EAA Compliance:** Встановити `eslint-plugin-jsx-a11y` для автоматичного контролю доступності (alt-тексти, aria-атрибути).

### 1.2. Design System & UI Components
- [ ] Ініціалізувати shadcn/ui: `npx shadcn-ui@latest init` (стиль: New York).
- [ ] Додати базові компоненти: button, input, dialog, sheet, toast, table, form, skeleton.
- [ ] Створити кастомні Design Tokens у `tailwind.config.ts` (перевірені на контрастність за стандартом WCAG AA).
- [ ] **EAA Compliance:** Використовувати відносні одиниці (`rem`) для підтримки системного масштабування тексту.

### 1.3. Безпека та CI/CD
- [ ] Налаштувати GitHub Actions: `.github/workflows/ci.yml` (jobs: lint, typecheck, test, audit).
- [ ] Встановити `@upstash/ratelimit` та `@upstash/redis` (з урахуванням лімітів free tier).
- [ ] Написати `src/middleware.ts` для Rate Limiting (по IP) та блокування Brute-force на `/api/auth`.
- [ ] Налаштувати HTTP Headers у `next.config.ts` (CSP, X-Frame-Options). Додати винятки для Stripe та InPost Geowidget.
- [ ] Підключити Sentry для моніторингу помилок.

---

## ЕТАП 2: Database, ORM & Caching (Шар даних)

### 2.1. Neon PostgreSQL & Drizzle ORM
- [ ] Встановити залежності: `drizzle-orm`, `drizzle-kit`, `postgres`.
- [ ] Створити `src/db/index.ts` (підключення до Neon) та `drizzle.config.ts`.

### 2.2. Проектування Схеми (`src/db/schema.ts`)
- [ ] `users`: id, email, password_hash, role, created_at.
- [ ] `products`: id, slug, external_id, sku, name, description, price, compare_price, **lowest_price_30_days** (Omnibus), stock, is_active.
- [ ] `price_history`: id, product_id, price, recorded_at. (Omnibus - для трекінгу історії).
- [ ] `categories`: id, slug, name, parent_id.
- [ ] `orders`: id, user_id, total_amount, status, stripe_session_id.
- [ ] `order_items`: id, order_id, product_id, quantity, unit_price, product_snapshot.
- [ ] `reviews`: id, product_id, user_id, **order_item_id** (Omnibus - гарантія верифікованого відгуку), rating, comment, is_verified.
- [ ] `carts`: id, session_id, user_id, items, updated_at (Сховище для покинутих кошиків).
- [ ] `audit_logs`: id, action, entity, user_id, timestamp.

### 2.3. Пошук та Міграції
- [ ] Створити міграцію для розширень: `pg_trgm`, `unaccent` (для польського пошуку).
- [ ] Додати GIN індекс до таблиці `products`.
- [ ] Створити `src/db/seed.ts` для генерації мок-даних.

---

## ЕТАП 3: Backend Logic & Background Jobs

### 3.1. Аутентифікація (Auth.js v5)
- [ ] Встановити та налаштувати Auth.js v5 (розділити конфіг для Edge Runtime).
- [ ] Створити Server Actions для логіну/реєстрації.

### 3.2. Redis Cache & State
- [ ] Налаштувати Upstash Redis для активних кошиків.
- [ ] Написати Lua-скрипти для атомарного резервування стоку (`DECRBY`).

### 3.3. Inngest (Асинхронні задачі)
- [ ] **Job 1 (XML Sync):** Скачування XML, батчинг по 100 товарів, `upsert` по `external_id`.
- [ ] **Job 2 (Abandoned Cart):** Перенесення кошиків >1 год у БД, email follow-up.
- [ ] **Job 3 (Data Anonymization):** Щомісячне хешування IP та старих логів (RODO).
- [ ] **Job 4 (Omnibus Price Tracker):** Щоденний крон для запису поточних цін у `price_history` та оновлення поля `lowest_price_30_days` для товарів, що беруть участь в акціях.

---

## ЕТАП 4: Public Storefront (UI / Фронтенд)

### 4.1. Global Layout & State
- [ ] Налаштувати `app/layout.tsx` (шрифти, Toaster, Analytics).
- [ ] Додати **BDO, NIP, REGON** у глобальний футер (Вимога законодавства PL).
- [ ] Налаштувати Zustand для оптимістичного UI.
- [ ] Налаштувати Error Boundaries та `loading.tsx`.

### 4.2. Каталог та Пошук
- [ ] Серверна пагінація (cursor-based), фільтри через `searchParams`.
- [ ] На сторінці продукту та в каталозі: якщо є знижка, відображати текст *"Najniższa cena z 30 dni przed obniżką: X PLN"* (Omnibus).
- [ ] Відображення бейджа *"Opinia zweryfikowana"* біля відгуків.

### 4.3. Checkout Flow (Кошик та Оплата)
- [ ] Інтеграція InPost Geowidget (`dynamic` import без SSR).
- [ ] Форма Checkout: Згода на "Regulamin" — обов'язкова. Згода на "Newsletter" — **відключена за замовчуванням** (RODO).
- [ ] Оплата через Stripe (автоматичне покриття PSD2/SCA). Атомарне резервування стоку в Redis на 15 хв.

---

## ЕТАП 5: Admin Panel & Integrations (Бек-офіс)

### 5.1. Адмінка (`app/(admin)`)
- [ ] Захист роутів через Middleware (перевірка `role === 'admin'`).
- [ ] Таблиці керування товарами та замовленнями (з audit_logs для кожної дії).
- [ ] Функціонал оформлення повернень (Zwroty) та зміни статусів замовлення.

### 5.2. Генерація Звітів та Webhooks
- [ ] API для експорту замовлень у CSV (з пагінацією/стрімінгом).
- [ ] Webhook для Stripe: підтвердження оплати → InPost ТТН → Email клієнту. Забезпечити Idempotency.

---

## ЕТАП 6: Legal, SEO & QA

### 6.1. RODO / GDPR (Польща)
- [ ] Інтеграція Cookie Consent (заборона трекінгу до отримання згоди).
- [ ] Створення сторінок `/polityka-prywatnosci` та `/regulamin`.
- [ ] Скрипт "Право на забуття" (анонімізація даних клієнта зі збереженням фінансової статистики).

### 6.2. Technical SEO
- [ ] Динамічний `sitemap.ts` та правильний `robots.ts`.
- [ ] Мікророзмітка `<JsonLd />` (schema.org/Product).
- [ ] Динамічні OpenGraph зображення через `next/og`.