// Miur/miur/components/ui/TrustBar.tsx
"use client";
import { motion } from 'framer-motion';

const trustItems = [
  "Darmowa dostawa od 150 zł",
  "100% dyskretna paczka",
  "Bezpieczne płatności",
  "Wysyłka w 24h",
  "Gwarancja jakości"
];

export function TrustBar() {
  return (
    <div className="w-full bg-white border-b border-zinc-100 py-3.5 flex items-center overflow-hidden">
      {/* Анімація нескінченного скролу: 
        Ми зсуваємо блок на -50% по осі X, і оскільки він складається з двох ідентичних половин, 
        це створює ілюзію нескінченного руху. 
      */}
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 25, // Швидкість (більше = повільніше і преміальніше)
        }}
      >
        {/* Перша половина контенту */}
        <div className="flex gap-8 md:gap-16 px-4 md:px-8 items-center">
          {trustItems.map((item, idx) => (
            <div key={`first-${idx}`} className="flex items-center gap-8 md:gap-16">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-700">
                {item}
              </span>
              <span className="text-[10px] text-zinc-300">✦</span>
            </div>
          ))}
        </div>

        {/* Друга половина контенту (Ідеальний дублікат для склейки) */}
        <div className="flex gap-8 md:gap-16 px-4 md:px-8 items-center">
          {trustItems.map((item, idx) => (
            <div key={`second-${idx}`} className="flex items-center gap-8 md:gap-16">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-700">
                {item}
              </span>
              <span className="text-[10px] text-zinc-300">✦</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}