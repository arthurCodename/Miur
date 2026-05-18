"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchConsoleProps = {
  className?: string;
};

export function SearchConsole({ className }: SearchConsoleProps) {
  const router = useRouter();
  const [value, setValue] = useState("");

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
    <form
      onSubmit={handleSubmit}
      className={cn("group flex min-w-0 max-w-full items-center gap-2 text-white", className)}
    >
      <div className="flex min-w-0 flex-1 items-center border-b border-transparent pb-1 transition-[border-color,width] duration-300 focus-within:border-white/80 group-hover:border-white/30 md:w-40 md:max-w-44 md:opacity-100 lg:w-52 lg:max-w-56">
        <input
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="SZUKAJ..."
          autoComplete="off"
          aria-label="Szukaj produktów"
          className="min-w-0 flex-1 bg-transparent text-[10px] font-bold uppercase tracking-widest text-white outline-none placeholder:text-white/50"
          enterKeyHint="search"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-full p-1.5 text-white/70 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
        aria-label="Szukaj"
      >
        <Search className="h-5 w-5" strokeWidth={1.2} aria-hidden />
      </button>
    </form>
  );
}
