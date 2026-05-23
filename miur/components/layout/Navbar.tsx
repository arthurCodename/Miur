"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, ChevronRight, X } from 'lucide-react';
import { toast } from "sonner";
import { SearchConsole } from "@/components/layout/SearchConsole";
import { CartSheet } from "@/components/checkout/CartSheet";
import { AuthNavLink } from "@/components/layout/AuthNavLink";
import { CartIcon } from "@/components/layout/CartIcon";
import { MiurWordmark } from "@/components/brand/MiurWordmark";
import { cn } from "@/lib/utils";
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
  { title: "BESTSELLERY", href: "/bestsellery", sections: [] },
];

/** Dłuższy, łagodniejszy zanik w dół — na mobile wymaga min. ~180px wysokości, żeby nie „urywać” gradientu. */
const NAV_SCRIM_GRADIENT = `linear-gradient(to bottom,
  rgba(0, 0, 0, 0.95) 0%,
  rgba(0, 0, 0, 0.82) 10%,
  rgba(0, 0, 0, 0.65) 22%,
  rgba(0, 0, 0, 0.48) 34%,
  rgba(0, 0, 0, 0.32) 44%,
  rgba(0, 0, 0, 0.21) 52%,
  rgba(0, 0, 0, 0.13) 62%,
  rgba(0, 0, 0, 0.08) 72%,
  rgba(0, 0, 0, 0.045) 82%,
  rgba(0, 0, 0, 0.022) 90%,
  rgba(0, 0, 0, 0.01) 95%,
  rgba(0, 0, 0, 0) 100%)`;

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { scrollY } = useScroll();
  const scrimRef = useRef<HTMLDivElement>(null);
  const logoNavRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(menuData[0].title);

  useEffect(() => {
    // Closing mega menu on navigation is a reaction to an external state change (URL).
    // This IS the intended side-effect pattern; setState inside the callback is correct here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMegaMenuOpen(false);
  }, [pathname]);

  const applyScrollLinkedOpacity = useCallback(() => {
    const y = scrollY.get();
    const el = scrimRef.current;
    if (el) {
      el.style.opacity = isHomePage ? String(Math.min(1, Math.max(0, y / 150))) : "1";
    }
    const logoEl = logoNavRef.current;
    if (logoEl) {
      if (!isHomePage) {
        logoEl.style.opacity = "1";
      } else {
        const lo = y <= 550 ? 0 : y >= 750 ? 1 : (y - 550) / 200;
        logoEl.style.opacity = String(Math.min(1, Math.max(0, lo)));
      }
    }
  }, [scrollY, isHomePage]);

  useMotionValueEvent(scrollY, "change", () => {
    if (scrollRafRef.current != null) return;
    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
      applyScrollLinkedOpacity();
    });
  });

  useEffect(() => {
    applyScrollLinkedOpacity();
  }, [applyScrollLinkedOpacity, pathname]);

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-100 max-w-full min-w-0 w-full"
      onMouseLeave={() => setIsMegaMenuOpen(false)}
    >
      <header
        className={cn(
          "pointer-events-auto relative isolate z-50 grid grid-cols-3 items-center px-6 pb-8 pt-[calc(env(safe-area-inset-top)+20px)] transition-[background-color] duration-300 md:px-12 md:pt-8",
          isMegaMenuOpen && "bg-zinc-950",
        )}
      >
        
        {/* Scrim: opacity przez rAF — mniej janku na mobile niż motion style na każdym pikselu scrollu */}
        <div
          ref={scrimRef}
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[max(11.25rem,calc(6.75rem+env(safe-area-inset-top,0)))] transform-gpu md:h-[180px]"
          style={{
            background: NAV_SCRIM_GRADIENT,
            opacity: isHomePage ? 0 : 1,
          }}
          aria-hidden
        />

        {/* ЛІВА ЧАСТИНА */}
        <div className="flex items-center gap-3 justify-self-start text-white md:gap-6">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="p-2 -ml-2 outline-none active:scale-95 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-1 focus-visible:ring-offset-black/40 rounded-sm"
                  aria-label="Otwórz menu"
                >
                  <Menu className="w-6 h-6" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] bg-zinc-950 border-none text-white p-0 flex flex-col" showCloseButton={false}>
                <SheetTitle className="sr-only">Menu nawigacyjne</SheetTitle>
                <div className="flex items-center justify-end px-6 pb-2 pt-[calc(env(safe-area-inset-top)+12px)]">
                   <SheetClose
                     className="p-2 -mr-2 hover:bg-white/10 rounded-full transition-colors"
                     aria-label="Zamknij menu"
                   >
                     <X className="w-6 h-6 text-zinc-400" strokeWidth={1.5} aria-hidden="true" />
                   </SheetClose>
                </div>
                <nav
                  aria-label="Menu nawigacyjne"
                  className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-6 pt-2 pb-6 no-scrollbar"
                >
                  {isHomePage ? (
                    <span
                      className="flex items-center justify-between border-b border-white/5 py-3.5"
                      aria-current="page"
                    >
                      <span className="text-[13px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                        Strona główna
                      </span>
                    </span>
                  ) : (
                    <SheetClose asChild>
                      <Link
                        href="/"
                        className="group flex items-center justify-between border-b border-white/5 py-3.5"
                      >
                        <span className="text-[13px] font-bold uppercase tracking-[0.15em]">Strona główna</span>
                        <ChevronRight className="h-4 w-4 text-zinc-600" aria-hidden="true" />
                      </Link>
                    </SheetClose>
                  )}

                  {menuData.map((cat, idx) => (
                    <motion.div
                      key={cat.title}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (idx + 1) * 0.03 }}
                    >
                      <SheetClose asChild>
                        <Link
                          href={cat.href}
                          className="group flex items-center justify-between border-b border-white/5 py-3.5"
                        >
                          <span className="text-[13px] font-bold uppercase tracking-[0.15em]">{cat.title}</span>
                          <ChevronRight className="h-4 w-4 text-zinc-600" aria-hidden="true" />
                        </Link>
                      </SheetClose>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (menuData.length + 1) * 0.03 }}
                  >
                    <SheetClose asChild>
                      <Link
                        href="/o-nas"
                        className="group flex items-center justify-between border-b border-white/5 py-3.5"
                      >
                        <span className="text-[13px] font-bold uppercase tracking-[0.15em]">O nas</span>
                        <ChevronRight className="h-4 w-4 text-zinc-600" aria-hidden="true" />
                      </Link>
                    </SheetClose>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (menuData.length + 2) * 0.03 }}
                  >
                    <SheetClose asChild>
                      <Link
                        href="/kontakt"
                        className="group flex items-center justify-between border-b border-white/5 py-3.5"
                      >
                        <span className="text-[13px] font-bold uppercase tracking-[0.15em]">Kontakt</span>
                        <ChevronRight className="h-4 w-4 text-zinc-600" aria-hidden="true" />
                      </Link>
                    </SheetClose>
                  </motion.div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <button
            type="button"
            className="hidden min-h-8 items-center gap-3 border-0 bg-transparent p-0 text-white shadow-none outline-none transition-opacity hover:opacity-60 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 md:inline-flex"
            aria-expanded={isMegaMenuOpen}
            aria-haspopup="true"
            aria-controls="mega-menu-panel"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onFocus={() => setIsMegaMenuOpen(true)}
          >
            <Menu className="h-5 w-5 shrink-0" strokeWidth={1.2} aria-hidden />
            <span className="text-[9px] font-bold uppercase leading-none tracking-[0.3em]">Menu</span>
          </button>
          
          <SearchConsole className="flex min-w-0 max-w-[min(100%,9rem)] sm:max-w-48 md:h-8 md:max-w-none" />
        </div>

        {/* ЦЕНТРАЛЬНА ЧАСТИНА — overflow-visible + luźniejszy leading: Safari obcina wysokie litery przy overflow-x-clip na rodzicu */}
        <div className="justify-self-center overflow-visible translate-y-1.5 text-white md:translate-y-2">
          <div ref={logoNavRef} className="overflow-visible px-4 py-2 pt-2.5" style={{ opacity: isHomePage ? 0 : 1 }}>
            <Link
              href="/"
              aria-label="Miur — strona główna"
              className="inline-flex items-center overflow-visible text-white outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
            >
              <MiurWordmark
                decorative
                className="text-[1.48rem] leading-[1.08] md:text-[1.68rem] md:leading-[1.06]"
              />
            </Link>
          </div>
        </div>

        {/* ПРАВА ЧАСТИНА */}
        <div className="flex items-center gap-6 justify-self-end text-white">
          <nav aria-label="Linki dodatkowe" className="hidden min-w-0 flex-wrap justify-end gap-x-6 gap-y-2 md:flex md:text-[9px] md:font-bold md:uppercase md:tracking-[0.28em]">
            {isHomePage ? (
              <span className="shrink-0 opacity-45" aria-current="page">
                Strona główna
              </span>
            ) : (
              <Link href="/" className="shrink-0 hover:opacity-50">
                Strona główna
              </Link>
            )}
            <Link href="/o-nas" className="shrink-0 hover:opacity-50">
              O nas
            </Link>
            <Link href="/kontakt" className="shrink-0 hover:opacity-50">
              Kontakt
            </Link>
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
            id="mega-menu-panel"
            aria-label="Kategorie produktów"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-auto hidden md:flex absolute top-0 left-0 w-full max-w-full min-w-0 flex-row overflow-x-clip bg-zinc-950 text-white pt-32 pb-16 px-12 border-b border-zinc-800/50 h-[80vh] z-40"
          >
            <ul className="w-1/4 min-w-0 shrink-0 border-r border-zinc-800 flex flex-col gap-6 overflow-y-auto overflow-x-hidden no-scrollbar">
              {menuData.map((cat) => (
                <li key={cat.title}>
                  <Link
                    href={cat.href}
                    onClick={() => setIsMegaMenuOpen(false)}
                    onMouseEnter={() => setActiveTab(cat.title)}
                    onFocus={() => setActiveTab(cat.title)}
                    className={`block text-left text-[10px] font-bold uppercase tracking-[0.18em] transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm ${
                      activeTab === cat.title ? "text-white translate-x-2" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="min-w-0 flex-1 pl-16 grid grid-cols-3 gap-12 overflow-y-auto overflow-x-hidden no-scrollbar">
               {menuData.find(c => c.title === activeTab)?.sections?.map((s, i) => (
                 <div key={i} className="flex flex-col gap-4">
                   <h4 className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-100">{s.heading}</h4>
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