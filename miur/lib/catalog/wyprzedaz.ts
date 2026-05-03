import type { BestsellerProduct } from "@/lib/catalog/types";

/** Kafelki jak w CategoryGrid — linki w strefie wyprzedaży (filtry / podstrony) */
export type SaleCategoryTile = {
  title: string;
  href: string;
  image: string;
  desc: string;
};

export const MOCK_SALE_TILES: SaleCategoryTile[] = [
  {
    title: "Wszystko",
    href: "/wyprzedaz",
    desc: "Pełna oferta promocji",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Ostatnie sztuki",
    href: "/wyprzedaz/ostatnie-sztuki",
    desc: "Końcówki serii",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Poniżej 100 zł",
    href: "/wyprzedaz?max=100",
    desc: "Niskie ceny",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Pakiety",
    href: "/wyprzedaz/pakiety",
    desc: "Zestawy taniej",
    image:
      "https://images.unsplash.com/photo-1512389142860-9c449e58a814?q=80&w=1200&auto=format&fit=crop",
  },
];

export const MOCK_WYPRZEDAZ_PRODUCTS: BestsellerProduct[] = [
  {
    id: "w1",
    slug: "midnight-offer",
    name: "Midnight Offer",
    category: "Wyprzedaż",
    price: "149,00 zł",
    oldPrice: "279,00 zł",
    omnibus: "279,00 zł",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1515378791036-0648a3c77a2c?q=80&w=800&auto=format&fit=crop",
    tag: "-46%",
  },
  {
    id: "w2",
    slug: "rose-bundle",
    name: "Rose Bundle",
    category: "Wyprzedaż",
    price: "79,00 zł",
    oldPrice: "139,00 zł",
    omnibus: "139,00 zł",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop",
    tag: "Outlet",
  },
  {
    id: "w3",
    slug: "edge-line",
    name: "Edge Line",
    category: "Wyprzedaż",
    price: "199,00 zł",
    oldPrice: null,
    omnibus: null,
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
    tag: "Ostatnia sztuka",
  },
  {
    id: "w4",
    slug: "soft-wave",
    name: "Soft Wave",
    category: "Wyprzedaż",
    price: "59,00 zł",
    oldPrice: "99,00 zł",
    omnibus: "99,00 zł",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=800&auto=format&fit=crop",
    tag: "-40%",
  },
  {
    id: "w5",
    slug: "nova-set",
    name: "Nova Set",
    category: "Wyprzedaż",
    price: "329,00 zł",
    oldPrice: "459,00 zł",
    omnibus: "459,00 zł",
    image:
      "https://images.unsplash.com/photo-1616012480717-fd9867059ca2?q=80&w=800&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1583445095369-9c651e7e5d30?q=80&w=800&auto=format&fit=crop",
    tag: "Zestaw",
  },
  {
    id: "w6",
    slug: "urban-kit",
    name: "Urban Kit",
    category: "Wyprzedaż",
    price: "119,00 zł",
    oldPrice: "189,00 zł",
    omnibus: "189,00 zł",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop",
    tag: "-37%",
  },
];

export async function getWyprzedazTiles(): Promise<SaleCategoryTile[]> {
  return MOCK_SALE_TILES;
}

export async function getWyprzedazProducts(): Promise<BestsellerProduct[]> {
  return MOCK_WYPRZEDAZ_PRODUCTS;
}
