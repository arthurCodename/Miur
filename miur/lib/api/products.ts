import { parsePlPriceStringToNumber } from "@/lib/cart/parse-pl-price";
import {
  getBestsellersForCategory,
  getCategoryBySlug,
} from "@/lib/catalog/category-by-slug";
import { MOCK_BESTSELLERS, MOCK_WYPRZEDAZ_PRODUCTS } from "@/lib/catalog/data/mock-products";
import { findMockProductBySlug } from "@/lib/catalog/find-mock-product";
import type { BestsellerProduct, Category, ProductReview } from "@/lib/catalog/types";

/**
 * Artificial latency for mock APIs.
 *
 * We only stall in development so designers/devs see realistic loading.tsx
 * skeleton transitions while iterating. In production builds (Vercel preview
 * + production) we ship instant resolves — no point burning RTT on hard-coded
 * mocks before we wire the real backend.
 *
 * Tunable via NEXT_PUBLIC_MOCK_DELAY_MS=0 to disable even in dev.
 */
const IS_DEV = process.env.NODE_ENV !== "production";
const ENV_OVERRIDE = Number(process.env.NEXT_PUBLIC_MOCK_DELAY_MS);
const HAS_OVERRIDE = Number.isFinite(ENV_OVERRIDE) && ENV_OVERRIDE >= 0;

const MOCK_DELAY_MS = HAS_OVERRIDE ? ENV_OVERRIDE : IS_DEV ? 1500 : 0;
const SEARCH_DELAY_MS = HAS_OVERRIDE ? ENV_OVERRIDE : IS_DEV ? 1000 : 0;

function delay(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function mockDelay(): Promise<void> {
  return delay(MOCK_DELAY_MS);
}

/** Mock store prices look like "349,00 zł" — normalize for numeric sort. */
function mockPriceStringToNumber(price: string): number {
  return parsePlPriceStringToNumber(price);
}

function sortCategoryProducts(products: BestsellerProduct[], sort?: string): BestsellerProduct[] {
  const next = [...products];
  if (sort === "price_asc") {
    next.sort((a, b) => mockPriceStringToNumber(a.price) - mockPriceStringToNumber(b.price));
  } else if (sort === "price_desc") {
    next.sort((a, b) => mockPriceStringToNumber(b.price) - mockPriceStringToNumber(a.price));
  }
  return next;
}

export async function getCategoryProducts(
  categorySlug: string,
  sort?: string,
): Promise<{ category: Category; products: BestsellerProduct[] } | null> {
  await mockDelay();
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;
  const filtered = getBestsellersForCategory(category);
  const products = sortCategoryProducts(filtered, sort);
  return { category, products };
}

export async function getProductBySlug(slug: string): Promise<BestsellerProduct | null> {
  await mockDelay();
  const product = findMockProductBySlug(slug);
  return product ?? null;
}

function dedupeProductsById(products: BestsellerProduct[]): BestsellerProduct[] {
  const byId = new Map<string, BestsellerProduct>();
  for (const p of products) {
    byId.set(p.id, p);
  }
  return [...byId.values()];
}

/** Mocks nie mają pola description — szukamy po nazwie, kategorii, tagu i slug. */
function productMatchesSearch(product: BestsellerProduct, queryLower: string): boolean {
  const blob = [product.name, product.category, product.slug, product.tag ?? ""].join(" ").toLowerCase();
  return blob.includes(queryLower);
}

export async function searchProducts(query: string): Promise<BestsellerProduct[]> {
  await delay(SEARCH_DELAY_MS);

  const trimmed = query.trim();
  if (!trimmed) return [];

  const queryLower = trimmed.toLowerCase();
  const merged = dedupeProductsById([...MOCK_BESTSELLERS, ...MOCK_WYPRZEDAZ_PRODUCTS]);
  return merged.filter((p) => productMatchesSearch(p, queryLower));
}

const MOCK_REVIEWS_DEFAULT: ProductReview[] = [
  {
    id: "rev-1",
    author: "Anna K.",
    rating: 5,
    comment:
      "Świetna jakość wykonania i dyskretna wysyłka. Polecam każdemu, kto ceni prywatność zakupów.",
    date: "12 stycznia 2025",
    isVerified: true,
  },
  {
    id: "rev-2",
    author: "Michał W.",
    rating: 4,
    comment: "Dobry stosunek jakości do ceny. Dostawa na czas, produkt zgodny z opisem.",
    date: "3 lutego 2025",
    isVerified: true,
  },
  {
    id: "rev-3",
    author: "Julia P.",
    rating: 5,
    comment: "Zamówienie spełniło oczekiwania. Opakowanie neutralne — ważne przy takich zakupach.",
    date: "18 lutego 2025",
    isVerified: false,
  },
  {
    id: "rev-4",
    author: "Tomasz R.",
    rating: 4,
    comment: "Solidnie wykonane, użytkowanie bez zarzutów. Kontakt ze sklepem jak najbardziej OK.",
    date: "2 marca 2025",
    isVerified: true,
  },
];

/** Opcjonalnie inny zestaw dla wybranych slugów (demo). */
const MOCK_REVIEWS_BY_SLUG: Partial<Record<string, ProductReview[]>> = {
  "aura-silk": [
    {
      id: "as-1",
      author: "Karolina M.",
      rating: 5,
      comment: "Piękny design i bardzo przyjemny materiał. Zamówienie dotarło szybko i bez oznaczeń nadawcy.",
      date: "8 marca 2025",
      isVerified: true,
    },
    ...MOCK_REVIEWS_DEFAULT.slice(1, 3),
  ],
};

/** Single entry point — later swap for real API fetch + unstable_cache */
export async function getAllProducts(): Promise<BestsellerProduct[]> {
  const merged = dedupeProductsById([...MOCK_BESTSELLERS, ...MOCK_WYPRZEDAZ_PRODUCTS]);
  return merged;
}

export async function getProductReviews(productSlug: string): Promise<ProductReview[]> {
  return MOCK_REVIEWS_BY_SLUG[productSlug] ?? MOCK_REVIEWS_DEFAULT;
}
