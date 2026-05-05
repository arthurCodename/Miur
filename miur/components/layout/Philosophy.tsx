// Miur/miur/components/layout/Philosophy.tsx
import Link from 'next/link';
import Image from "next/image";

export function Philosophy() {
  return (
    <section className="w-full bg-zinc-50 grid grid-cols-1 lg:grid-cols-2 overflow-hidden border-t border-zinc-200">
      
      {/* ТЕКСТОВА ЧАСТИНА */}
      <div className="flex flex-col justify-center p-10 py-24 md:p-24 lg:p-32 order-2 lg:order-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-8">
          Nasza Filozofia
        </span>
        
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-zinc-900 leading-[1.1] mb-8 uppercase">
          Zmysłowość to sztuka, którą warto pielęgnować.
        </h2>
        
        <div className="w-12 h-px bg-zinc-300 mb-8"></div>
        
        <p className="text-sm md:text-base text-zinc-600 leading-relaxed mb-10 max-w-md font-light">
          W Miur wierzymy, że intymne wellness to nie temat tabu, lecz naturalny element dbania o siebie. 
          Tworzymy bezpieczną przestrzeń, w której możesz eksplorować swoje pragnienia z najwyższą klasą i elegancją. 
          Wybieramy tylko produkty bezpieczne dla ciała, ekologiczne i zachwycające designem.
        </p>

        <Link 
          href="/o-nas" 
          className="group flex items-center gap-4 w-fit"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black group-hover:text-zinc-500 transition-colors">
            Poznaj naszą historię
          </span>
          <div className="w-8 h-px bg-black group-hover:w-12 group-hover:bg-zinc-500 transition-all duration-300"></div>
        </Link>
      </div>

      {/* ФОТОГРАФІЯ */}
      <div className="relative h-[60vh] lg:h-auto order-1 lg:order-2 overflow-hidden group">
        <Image 
          src="https://images.unsplash.com/photo-1616012480717-fd9867059ca2?q=80&w=1600&auto=format&fit=crop" 
          alt="Miur Philosophy"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
        />
      </div>

    </section>
  );
}