import { Hero } from "../components/layout/Hero";
import { TrustBar } from "../components/ui/TrustBar";
import { CategoryGrid } from "../components/layout/CategoryGrid";
import { BestSellers } from "../components/layout/BestSellers";
import { Philosophy } from "../components/layout/Philosophy";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <TrustBar />
      <CategoryGrid />
      <BestSellers />
      <Philosophy />
    </div>
  );
}