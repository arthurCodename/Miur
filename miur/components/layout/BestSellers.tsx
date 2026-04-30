// Miur/miur/components/layout/BestSellers.tsx
"use client";
import { ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';

const products = [
  {
    id: 1,
    name: "Aura Silk",
    category: "Wibratory",
    price: "349,00 zł",
    oldPrice: "420,00 zł",
    omnibus: "349,00 zł",
    image: "https://images.unsplash.com/photo-1583445095369-9c651e7e5d30?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1556229167-7313a29606fd?q=80&w=800&auto=format&fit=crop",
    tag: "Bestseller"
  },
  {
    id: 2,
    name: "Luna Essence",
    category: "Drogeria",
    price: "129,00 zł",
    oldPrice: null,
    omnibus: null,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop",
    tag: "Nowość"
  },
  {
    id: 3,
    name: "Duo Pulse",
    category: "Dla Par",
    price: "499,00 zł",
    oldPrice: "599,00 zł",
    omnibus: "499,00 zł",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1614859324967-bdf471bba55b?q=80&w=800&auto=format&fit=crop",
    tag: "Limited Edition"
  },
  {
    id: 4,
    name: "Velvet Touch",
    category: "Akcesoria",
    price: "89,00 zł",
    oldPrice: null,
    omnibus: null,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=800&auto=format&fit=crop",
    tag: null
  }
];

export function BestSellers() {
  return (
    <section className="w-full bg-white px-6 md:px-12 py-24 border-t border-zinc-100">
      
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">
            Top Choice
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-zinc-900 uppercase">
            Nasze Bestsellery
          </h2>
        </div>
        <Link href="/bestsellery" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-zinc-500 hover:border-zinc-300 transition-all">
          Zobacz wszystko
        </Link>
      </div>

      {/* Сітка товарів */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
        {products.map((product) => (
          <div key={product.id} className="group flex flex-col">
            
            {/* Контейнер зображення */}
            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50 mb-6 cursor-pointer">
              {product.tag && (
                <div className="absolute top-4 left-4 z-10 bg-white px-3 py-1 rounded-full shadow-sm">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-black">
                    {product.tag}
                  </span>
                </div>
              )}
              
              {/* Основне фото */}
              <img 
                src={product.image} 
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
              />
              
              {/* Фото при наведенні */}
              <img 
                src={product.hoverImage} 
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />

              {/* Кнопка швидкого додавання */}
              <button className="absolute bottom-4 left-4 right-4 bg-black text-white py-3 rounded-full translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-2 hover:bg-zinc-800">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Do koszyka</span>
              </button>
            </div>

            {/* Інфо про товар */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                {product.category}
              </span>
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight mb-1">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-black">{product.price}</span>
                {product.oldPrice && (
                  <span className="text-xs text-zinc-400 line-through font-medium">
                    {product.oldPrice}
                  </span>
                )}
              </div>

              {/* Omnibus Rule */}
              {product.omnibus && (
                <span className="text-[8px] text-zinc-400 mt-1 uppercase tracking-tighter">
                  Najniższa cena z 30 dni: {product.omnibus}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}