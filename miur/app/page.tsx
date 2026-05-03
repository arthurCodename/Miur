import { Hero } from "@/components/layout/Hero";
import { TrustBar } from "@/components/ui/TrustBar";
import { CategoryGrid } from "@/components/layout/CategoryGrid";
import { BestSellers } from "@/components/layout/BestSellers";
import { WyprzedazSection } from "@/components/layout/WyprzedazSection";
import { Blog } from "@/components/layout/Blog";
import { Philosophy } from "@/components/layout/Philosophy";
import { getBestsellers } from "@/lib/catalog/bestsellers";
import { getWyprzedazProducts, getWyprzedazTiles } from "@/lib/catalog/wyprzedaz";
import { getBlogPosts } from "@/lib/blog/posts";

export default async function Home() {
  const [bestsellers, wyprzedazTiles, wyprzedazProducts, blogPosts] =
    await Promise.all([
      getBestsellers(),
      getWyprzedazTiles(),
      getWyprzedazProducts(),
      getBlogPosts(),
    ]);

  return (
    <div className="flex w-full flex-col">
      <Hero />
      <TrustBar />
      <CategoryGrid />
      <BestSellers products={bestsellers} />
      <WyprzedazSection tiles={wyprzedazTiles} products={wyprzedazProducts} />
      <Blog posts={blogPosts} />
      <Philosophy />
    </div>
  );
}
