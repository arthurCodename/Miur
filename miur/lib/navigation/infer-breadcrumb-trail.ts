import { getCategoryBySlug } from "@/lib/catalog/category-by-slug";
import type { SiteBreadcrumbItem } from "@/lib/navigation/breadcrumb-types";

const HOME: SiteBreadcrumbItem = { label: "Strona główna", href: "/" };

/** Jednosegmentowe ścieżki (slug → etykieta PL). */
const TOP_LEVEL_LABELS: Record<string, string> = {
  bestsellery: "Bestsellery",
  kontakt: "Kontakt",
  login: "Logowanie",
  "lista-zyczen": "Lista życzeń",
  masturbatory: "Masturbatory",
  "moje-zamowienia": "Moje zamówienia",
  "o-nas": "O nas",
  opinie: "Opinie",
  "polityka-prywatnosci": "Polityka prywatności",
  produkty: "Wszystkie produkty",
  profile: "Moje konto",
  "program-partnerski": "Program partnerski",
  regulamin: "Regulamin",
  search: "Wyniki wyszukiwania",
  wibratory: "Wibratory",
  wyprzedaz: "Wyprzedaż",
  "zwroty-reklamacje": "Zwroty i reklamacje",
  "dostawa-platnosc": "Dostawa i płatność",
  dostepnosc: "Deklaracja dostępności",
  "dyskretna-paczka": "Dyskretna paczka",
  checkout: "Kasa",
};

function titleCaseKebab(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Heurystyka ścieżki okruszków z URL (bez danych produktu / wpisu blogowego).
 * Zwraca `null` dla `/`, nieznanych ścieżek oraz `/produkt/*` i `/blog/*` (slug) —
 * tam strona powinna przekazać `breadcrumbTrail` jawnie.
 */
export function inferBreadcrumbTrailFromPathname(pathname: string): SiteBreadcrumbItem[] | null {
  const path = pathname.split("?")[0]?.replace(/\/$/, "") ?? "";
  if (!path || path === "/") return null;

  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  if (segments[0] === "produkt" && segments[1]) return null;
  if (segments[0] === "blog" && segments[1]) return null;

  if (segments[0] === "kategorie" && segments[1]) {
    const cat = getCategoryBySlug(segments[1]);
    return [HOME, { label: cat?.title ?? titleCaseKebab(segments[1]) }];
  }

  if (segments[0] === "blog" && segments.length === 1) {
    return [HOME, { label: "Blog" }];
  }

  if (segments[0] === "checkout") {
    if (segments[1] === "success") {
      return [HOME, { label: "Kasa", href: "/checkout" }, { label: "Potwierdzenie" }];
    }
    return [HOME, { label: "Kasa" }];
  }

  if (segments.length === 1) {
    const label = TOP_LEVEL_LABELS[segments[0]];
    if (label) return [HOME, { label }];
    return [HOME, { label: titleCaseKebab(segments[0]) }];
  }

  return [HOME, { label: titleCaseKebab(segments[segments.length - 1] ?? "") }];
}
