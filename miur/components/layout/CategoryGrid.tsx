// Miur/miur/components/layout/CategoryGrid.tsx
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  {
    title: "Dla Niej",
    href: "/dla-niej",
    // Естетичне фото жінки/тіла
    image: "https://images.unsplash.com/photo-1616012480717-fd9867059ca2?q=80&w=1200&auto=format&fit=crop", 
    desc: "Odkryj swoją zmysłowość"
  },
  {
    title: "Dla Niego",
    href: "/dla-niego",
    // Естетичне чоловіче фото
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
    desc: "Męska strefa wellness"
  },
  {
    title: "Dla Par",
    href: "/dla-par",
    // Естетичне фото пари/рук
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    desc: "Wspólne chwile"
  }
];

export function CategoryGrid() {
  return (
    <section className="w-full bg-white px-6 md:px-12 py-24 md:py-32">
      
      {/* Заголовок секції */}
      <div className="flex flex-col items-center mb-16 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">
          Kolekcje
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-zinc-900 uppercase">
          Wybierz swoją ścieżkę
        </h2>
      </div>

      {/* Сітка категорій */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {categories.map((category) => (
          <Link 
            key={category.title} 
            href={category.href}
            className="group relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-zinc-100 flex"
          >
            {/* Фотографія з кінематографічним зумом */}
            <img 
              src={category.image} 
              alt={category.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            />
            
            {/* Темний градієнт для читабельності тексту */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-80" />

            {/* Текст та кнопка */}
            <div className="absolute bottom-0 left-0 w-full p-8 flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-white/70 text-[9px] uppercase tracking-widest mb-2 font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {category.desc}
                </span>
                <h3 className="text-white text-2xl uppercase tracking-[0.15em] font-bold">
                  {category.title}
                </h3>
              </div>
              
              {/* Кругла кнопка зі стрілкою */}
              <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all duration-500">
                <ArrowUpRight className="w-5 h-5" strokeWidth={1.5} />
              </div>
            </div>
          </Link>
        ))}
      </div>
      
    </section>
  );
}