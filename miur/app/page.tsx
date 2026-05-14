import dynamic from "next/dynamic";
import { Hero } from "@/components/layout/Hero";
import { CategoryGrid } from "@/components/layout/CategoryGrid";
import { getBestsellers } from "@/lib/catalog/bestsellers";
import { getWyprzedazProducts, getWyprzedazTiles } from "@/lib/catalog/wyprzedaz";
import { getBlogPosts } from "@/lib/blog/posts";

const BestSellers = dynamic(() =>
  import("@/components/layout/BestSellers").then((mod) => mod.BestSellers),
);
const WyprzedazSection = dynamic(() =>
  import("@/components/layout/WyprzedazSection").then((mod) => mod.WyprzedazSection),
);
const Blog = dynamic(() => import("@/components/layout/Blog").then((mod) => mod.Blog));
const Philosophy = dynamic(() =>
  import("@/components/layout/Philosophy").then((mod) => mod.Philosophy),
);

export default async function Home() {
  const [bestsellers, wyprzedazTiles, wyprzedazProducts, blogPosts] =
    await Promise.all([
      getBestsellers(),
      getWyprzedazTiles(),
      getWyprzedazProducts(),
      getBlogPosts(),
    ]);

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col overflow-x-clip">
      <Hero />
      <CategoryGrid />
      <BestSellers products={bestsellers} />
      <WyprzedazSection tiles={wyprzedazTiles} products={wyprzedazProducts} />
      <Blog posts={blogPosts} />
      <Philosophy />
    </div>
  );
}
