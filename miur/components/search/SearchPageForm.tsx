"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type SearchPageFormProps = {
  /** Wartość początkowa z URL (`?q=`), pusty string gdy brak. */
  initialQuery: string;
};

/**
 * Pole wyszukiwania na stronie `/search` — pełnowymiarowe, mobile-friendly.
 *
 * Założenia:
 *  - `font-size: 16px` na inpucie → iOS Safari nie robi auto-zoom przy tapnięciu
 *    (to jest powód, dla którego nie używamy tego inputa w navbarze na mobile).
 *  - Auto-focus na mount tylko gdy URL nie ma `?q=` — UX dla użytkownika, który
 *    tapnął ikonę lupy w navbarze i wylądował na pustej stronie wyszukiwania.
 *    Gdy `?q=…` jest już w URL, focus nie ucieka z wyników.
 *  - Submit zmienia URL (`router.push`) — RSC pobiera nowy wynik bez full reload.
 */
export function SearchPageForm({ initialQuery }: SearchPageFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus przy "pustym landingu" z navbara mobilnego (?q brak).
    if (!initialQuery) {
      inputRef.current?.focus();
    }
  }, [initialQuery]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = value.trim();
    // Pusty submit czyści wyniki — przewidywalne UX.
    const target = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
    router.push(target);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-3 shadow-sm focus-within:border-zinc-400 focus-within:shadow-md"
    >
      <Search className="h-5 w-5 shrink-0 text-zinc-500" strokeWidth={1.5} aria-hidden />
      <input
        ref={inputRef}
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Szukaj produktów..."
        aria-label="Szukaj produktów"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-400"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white outline-none transition-colors hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:opacity-50"
        disabled={value.trim().length === 0}
      >
        Szukaj
      </button>
    </form>
  );
}
