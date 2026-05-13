"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchConsoleProps = {
  className?: string;
};

export function SearchConsole({ className }: SearchConsoleProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isCompactMobile, setIsCompactMobile] = useState(false);

  // Keep header copy compact on very narrow devices (e.g. iPhone 13 mini).
  useEffect(() => {
    const media = window.matchMedia("(max-width: 375px)");
    const sync = () => setIsCompactMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  function goToSearch() {
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    goToSearch();
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex min-w-0 max-w-full items-center gap-2 text-white", className)}>
      <div className="group flex h-full min-w-0 flex-1 items-center border-b border-transparent transition-[border-color,width] duration-300 hover:border-white/30 focus-within:border-white/80 md:w-40 md:max-w-44 md:opacity-100 lg:w-52 lg:max-w-56">
        <input
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={isCompactMobile ? "SZUKAJ" : "SZUKAJ..."}
          autoComplete="off"
          aria-label="Szukaj produktów"
          className="min-w-0 flex-1 bg-transparent text-[10px] font-bold uppercase leading-none tracking-widest text-white outline-none placeholder:text-white/50"
          enterKeyHint="search"
        />
        <button
          type="submit"
          className="hidden shrink-0 rounded-full p-1.5 text-white/70 outline-none transition-[opacity,color,background-color] duration-200 hover:bg-white/10 hover:text-white focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white/60 md:flex md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto"
          aria-label="Szukaj"
        >
          <Search className="h-5 w-5" strokeWidth={1.2} aria-hidden />
        </button>
      </div>
    </form>
  );
}
