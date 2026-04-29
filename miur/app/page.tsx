import { Hero } from "@/components/layout/Hero";

export default function Home() {
  return (
    <main className="flex flex-col w-full bg-white">
      {/* Головний екран у стилі Siohworld / Avec */}
      <Hero />
      
      {/* Тут будуть наступні секції магазину (Grid товарів і т.д.) */}
      <section className="h-screen w-full flex items-center justify-center bg-zinc-50 border-t border-zinc-100">
        <p className="text-[10px] font-bold uppercase tracking-[1em] text-zinc-300">
          Miejsce на Twoje produkty
        </p>
      </section>
    </main>
  );
}