"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, Search } from 'lucide-react';

export default function Navbar() {
  const { scrollY } = useScroll();

  // Плавна поява градієнта при скролі
  const gradientOpacity = useTransform(scrollY, [0, 150], [0, 1]);
  const logoOpacity = useTransform(scrollY, [550, 750], [0, 1]);

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] grid grid-cols-3 items-center px-6 md:px-12 pt-10 pb-6 transition-all duration-500">
      
      {/* НОВИЙ КОРОТКИЙ ТА ПЛАВНИЙ ГРАДІЄНТ */}
      {/* h-40 (~160px) замість h-72. Це якраз рівень твого зеленого квадратика */}
      <motion.div 
        style={{ 
          opacity: gradientOpacity,
          background: `linear-gradient(to bottom, 
            rgba(0,0,0,0.9) 0%, 
            rgba(0,0,0,0.6) 25%, 
            rgba(0,0,0,0.3) 50%, 
            rgba(0,0,0,0.1) 75%, 
            rgba(0,0,0,0) 100%)`
        }}
        className="absolute inset-0 -z-10 h-40 pointer-events-none"
      />

      {/* ЛІВА ЧАСТИНА */}
      <div className="flex items-center gap-6 justify-self-start text-white">
        <button className="hover:opacity-50 transition-opacity">
          <Menu className="w-5 h-5" strokeWidth={1.2} />
        </button>
        <button className="hidden md:block hover:opacity-50 transition-opacity">
          <Search className="w-4 h-4 opacity-50" strokeWidth={1.2} />
        </button>
      </div>

      {/* ЦЕНТРАЛЬНА ЧАСТИНА (Miur) */}
      <div className="justify-self-center text-white overflow-visible">
        <motion.div 
          style={{ opacity: logoOpacity }}
          className="overflow-visible px-8 py-4"
        >
          <Link 
            href="/" 
            className="text-2xl font-bold tracking-tighter font-[family-name:var(--font-logo)] whitespace-nowrap block"
          >
            Miur
          </Link>
        </motion.div>
      </div>

      {/* ПРАВА ЧАСТИНА */}
      <div className="flex items-center gap-8 justify-self-end text-[9px] font-bold uppercase tracking-[0.3em] text-white">
        <nav className="hidden lg:flex gap-8 font-sans">
          <Link href="/shop" className="hover:opacity-50 transition-opacity">Eksploruj Miur</Link>
          <Link href="/kontakt" className="hover:opacity-50 transition-opacity">Kontakt</Link>
        </nav>
        
        <Link href="/cart" className="flex items-center gap-2.5 font-sans hover:bg-white hover:text-black transition-all border border-white/20 rounded-full px-4 py-1.5">
           <span className="w-1 h-1 rounded-full bg-current" />
           Koszyk(0)
        </Link>
      </div>
    </nav>
  );
}