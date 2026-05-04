import type { BlogPost } from "@/lib/blog/types";

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "p1",
    slug: "wellness-intymnosci",
    title: "Wellness intymności — od czego zacząć",
    excerpt:
      "Krótki przewodnik po świadomej trosce o ciało: rytuały, nawyki i akcesoria, które robią realną różnicę.",
    cover:
      "https://images.unsplash.com/photo-1515378791036-0648a3c77a2c?q=80&w=1200&auto=format&fit=crop",
    category: "Edukacja",
    readTime: "5 min",
    publishedAt: "12 marca 2026",
  },
  {
    id: "p2",
    slug: "lubrykant-wybor",
    title: "Lubrykant idealny — jak wybrać?",
    excerpt:
      "Wodne, silikonowe, hybrydowe. Tłumaczymy różnice i podpowiadamy, do czego pasuje dany typ.",
    cover:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop",
    category: "Zdrowie",
    readTime: "4 min",
    publishedAt: "28 lutego 2026",
  },
  {
    id: "p3",
    slug: "rozmowa-w-zwiazku",
    title: "Rozmowa o intymności w związku",
    excerpt:
      "Trzy proste pytania, które warto sobie zadać razem z partnerem, zanim sięgniecie po nowe akcesorium.",
    cover:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    category: "Relacje",
    readTime: "6 min",
    publishedAt: "20 lutego 2026",
  },
  {
    id: "p4",
    slug: "pielegnacja-akcesoriow",
    title: "Pielęgnacja akcesoriów — krok po kroku",
    excerpt:
      "Jak czyścić, suszyć i przechowywać produkty, żeby służyły dłużej i były bezpieczne dla skóry.",
    cover:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
    category: "Bezpieczeństwo",
    readTime: "3 min",
    publishedAt: "11 lutego 2026",
    sponsored: true,
  },
  {
    id: "p5",
    slug: "minimalistyczny-rytual",
    title: "Minimalistyczny rytuał wieczorny",
    excerpt:
      "Pięć kroków, które przeniesiesz do swojej rutyny — bez przesady, bez presji, z pełną uważnością.",
    cover:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    category: "Wellness",
    readTime: "5 min",
    publishedAt: "30 stycznia 2026",
  },
  {
    id: "p6",
    slug: "co-mowi-omnibus",
    title: "Co mówi Omnibus — zakupy bez niespodzianek",
    excerpt:
      "Wyjaśniamy, czemu obok ceny pojawia się informacja o najniższej cenie z 30 dni i jak ją czytać.",
    cover:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop",
    category: "Inspiracja",
    readTime: "4 min",
    publishedAt: "15 stycznia 2026",
  },
];

export async function getBlogPosts(): Promise<BlogPost[]> {
  return MOCK_BLOG_POSTS;
}
