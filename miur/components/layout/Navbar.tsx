"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, ChevronRight, X } from 'lucide-react';
import { toast } from "sonner";
import { SearchConsole } from "@/components/layout/SearchConsole";
import { CartSheet } from "@/components/checkout/CartSheet";
import { AuthNavLink } from "@/components/layout/AuthNavLink";
import { CartIcon } from "@/components/layout/CartIcon";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose,
  SheetTitle
} from "@/components/ui/sheet";

const menuData = [
  {
    title: "DLA NIEJ",
    href: "/dla-niej",
    sections: [
      { heading: "WIBRATORY", items: ["Klasyczne", "Do łechtaczki", "Soniczne", "Do punktu G", "Jajeczka", "Króliczki"] },
      { heading: "BIELIZNA", items: ["Komplety", "Przebrania", "Biustonosze", "Gorsety"] },
      { heading: "DROGERIA", items: ["Lubrykanty", "Zwiększenie libido", "Perfumy"] }
    ]
  },
  {
    title: "DLA NIEGO",
    href: "/dla-niego",
    sections: [
      { heading: "MASTURBATORY", items: ["Klasyczne", "Fleshlight Girls", "Wibrujące"] },
      { heading: "PIERŚCIENIE", items: ["Elastyczne", "Metalowe"] },
      { heading: "DROGERIA", items: ["Lubrykanty", "Prezerwatywy"] }
    ]
  },
  { title: "DLA PAR", href: "/dla-par", sections: [] },
  { title: "WIBRATORY", href: "/wibratory", sections: [] },
  { title: "MASTURBATORY", href: "/masturbatory", sections: [] },
  { title: "DROGERIA", href: "/drogeria", sections: [] },
  { title: "PROMOCJE", href: "/promocje", sections: [] },
  { title: "BESTSELLERY", href: "/bestsellery", sections: [] }
];

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { scrollY } = useScroll();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(menuData[0].title);

  // Градієнт з'являється після 50px скролу і стає повним на 200px
  const gradientOpacity = useTransform(scrollY, [0, 150], [0, 1]);
  const logoOpacity = useTransform(scrollY, [550, 750], [0, 1]);

  return (
    <div 
      className="fixed top-0 left-0 w-full z-[100]"
      onMouseLeave={() => setIsMegaMenuOpen(false)}
    >
      <header className="relative isolate z-50 grid grid-cols-3 items-center px-6 pb-8 pt-[calc(env(safe-area-inset-top)+20px)] transition-all duration-500 md:px-12 md:pt-8">
        
        {/* ULTRA-SMOOTH SCRIM GRADIENT */}
        <motion.div
          style={{ opacity: isHomePage ? gradientOpacity : 1 }}
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[140px] md:h-[180px]"
          aria-hidden
        >
          <div 
            className="w-full h-full"
            style={{
              background: `linear-gradient(to bottom, 
                rgba(0, 0, 0, 0.95) 0%, 
                rgba(0, 0, 0, 0.83) 15%, 
                rgba(0, 0, 0, 0.64) 30%, 
                rgba(0, 0, 0, 0.45) 43%, 
                rgba(0, 0, 0, 0.28) 55%, 
                rgba(0, 0, 0, 0.15) 67%, 
                rgba(0, 0, 0, 0.06) 78%, 
                rgba(0, 0, 0, 0.02) 89%, 
                rgba(0, 0, 0, 0) 100%)`
            }}
          />
        </motion.div>

        {/* ЛІВА ЧАСТИНА */}
        <div className="flex items-center gap-6 justify-self-start text-white">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="p-2 -ml-2 outline-none active:scale-95"
                  aria-label="Otwórz menu"
                >
                  <Menu className="w-6 h-6" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] bg-zinc-950 border-none text-white p-0 flex flex-col" showCloseButton={false}>
                <SheetTitle className="sr-only">Menu nawigacyjne</SheetTitle>
                <div className="flex items-center justify-end px-6 pt-[calc(env(safe-area-inset-top)+20px)] pb-2">
                   <SheetClose
                     className="p-2 -mr-2 hover:bg-white/10 rounded-full transition-colors"
                     aria-label="Zamknij menu"
                   >
                     <X className="w-6 h-6 text-zinc-400" strokeWidth={1.5} aria-hidden="true" />
                   </SheetClose>
                </div>
                <nav
                  aria-label="Główne kategorie"
                  className="flex-1 px-6 pt-2 flex flex-col overflow-y-auto no-scrollbar"
                >
                  {menuData.map((cat, idx) => (
                    <motion.div key={cat.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}>
                      <Link href={cat.href} className="group flex items-center justify-between py-3.5 border-b border-white/5">
                        <span className="text-[13px] font-bold uppercase tracking-[0.15em]">{cat.title}</span>
                        <ChevronRight className="w-4 h-4 text-zinc-600" aria-hidden="true" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex items-center gap-6 cursor-pointer group" onMouseEnter={() => setIsMegaMenuOpen(true)}>
            <div className="flex items-center gap-3">
              <Menu className="w-5 h-5 group-hover:opacity-50 transition-opacity" strokeWidth={1.2} />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Menu</span>
            </div>
          </div>
          
          <SearchConsole className="flex min-w-0 max-w-[min(100%,12rem)] sm:max-w-[14rem] md:max-w-none" />
        </div>

        {/* ЦЕНТРАЛЬНА ЧАСТИНА */}
        <div className="justify-self-center text-white">
          <motion.div style={{ opacity: isHomePage ? logoOpacity : 1 }} className="px-4 py-2">
            <Link href="/" className="text-2xl font-bold tracking-tighter font-[family-name:var(--font-logo)]">
              Miur
            </Link>
          </motion.div>
        </div>

        {/* ПРАВА ЧАСТИНА */}
        <div className="flex items-center gap-6 justify-self-end text-white">
          <nav aria-label="Linki dodatkowe" className="hidden lg:flex gap-8 text-[9px] font-bold uppercase tracking-[0.3em]">
            <Link href="/kontakt" className="hover:opacity-50">Kontakt</Link>
          </nav>
          <AuthNavLink />
          <CartSheet>
            <CartIcon />
          </CartSheet>
        </div>
      </header>

      {/* MEGA MENU */}
      <AnimatePresence>
        {isMegaMenuOpen && (
          <motion.nav
            aria-label="Kategorie produktów"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="hidden md:flex absolute top-0 left-0 w-full bg-zinc-950 text-white pt-32 pb-16 px-12 border-b border-zinc-800/50 h-[80vh] z-40"
          >
            <ul className="w-1/4 border-r border-zinc-800 flex flex-col gap-6 overflow-y-auto no-scrollbar">
              {menuData.map((cat) => (
                <li key={cat.title}>
                  <Link
                    href={cat.href}
                    onMouseEnter={() => setActiveTab(cat.title)}
                    onFocus={() => setActiveTab(cat.title)}
                    className={`block text-left text-[11px] font-bold uppercase tracking-[0.2em] transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm ${
                      activeTab === cat.title ? "text-white translate-x-2" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="w-3/4 pl-16 grid grid-cols-3 gap-12 overflow-y-auto no-scrollbar">
               {menuData.find(c => c.title === activeTab)?.sections?.map((s, i) => (
                 <div key={i} className="flex flex-col gap-4">
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-100">{s.heading}</h4>
                   <ul className="flex flex-col gap-2">
                     {s.items.map((item, j) => (
                       <li key={j}>
                         <button
                           type="button"
                           onClick={() => toast.info("Wkrótce", { description: `Podkategoria \"${item}\" pojawi się wkrótce.` })}
                           className="text-left text-xs text-zinc-400 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm"
                         >
                           {item}
                         </button>
                       </li>
                     ))}
                   </ul>
                 </div>
               ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}