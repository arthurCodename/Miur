"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchConsoleProps = {
  className?: string;
};

/**
 * Pasek wyszukiwania w navbarze — dwa różne UX zależnie od viewportu:
 *
 *  - Mobile (default): tylko ikona-link → `/search`. To rozwiązuje:
 *      1) iOS Safari zoom przy tapnięciu na input <16px (nie ma już inputa),
 *      2) ciasnotę na iPhone 13 mini (375px) — ikona zajmuje ~40×40 zamiast
 *         konkurować o miejsce z menu / logo / koszykiem.
 *      Standardowy wzorzec mobilny (Amazon, Google, sklepy).
 *
 *  - md+ (≥768px): pełnoprawne pole tekstowe z animowanym podświetleniem.
 *      Enter / klik lupy → `/search?q=…`.
 *
 * Oba warianty istnieją w DOM — przełączane CSS-em (`hidden`/`md:hidden`),
 * dzięki czemu nie ma migotania ani SSR/CSR mismatch przy hydracji.
 */
export function SearchConsole({ className }: SearchConsoleProps) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className={cn("flex min-w-0 max-w-full items-center text-white", className)}>
      {/* MOBILE: ikona-link → /search. Touch target 40×40 (Search 24 + p-2 8+8). */}
      <Link
        href="/search"
        aria-label="Szukaj"
        className="flex items-center justify-center rounded-sm p-2 outline-none transition-opacity hover:opacity-60 active:scale-95 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-1 focus-visible:ring-offset-black/40 md:hidden"
      >
        <Search className="h-6 w-6" strokeWidth={1.5} aria-hidden />
      </Link>

      {/* DESKTOP (≥md): pełne pole pod animowaną linią. */}
      <form
        onSubmit={handleSubmit}
        className="hidden min-w-0 max-w-full flex-1 items-center gap-2 md:flex"
      >
        <div className="group flex h-full min-w-0 flex-1 items-center border-b border-transparent transition-[border-color,width] duration-300 hover:border-white/30 focus-within:border-white/80 md:w-40 md:max-w-44 lg:w-52 lg:max-w-56">
          <input
            type="search"
            name="q"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="SZUKAJ..."
            autoComplete="off"
            aria-label="Szukaj produktów"
            inputMode="search"
            className="min-w-0 flex-1 bg-transparent text-[10px] font-bold uppercase leading-none tracking-widest text-white outline-none placeholder:text-white/50"
            enterKeyHint="search"
          />
          <button
            type="submit"
            className="flex shrink-0 rounded-full p-1.5 text-white/70 opacity-0 pointer-events-none outline-none transition-[opacity,color,background-color] duration-200 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto"
            aria-label="Szukaj"
          >
            <Search className="h-5 w-5" strokeWidth={1.2} aria-hidden />
          </button>
        </div>
      </form>
    </div>
  );
}
