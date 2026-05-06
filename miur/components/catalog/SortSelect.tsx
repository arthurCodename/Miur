"use client";

import type { ChangeEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "default", label: "Domyślnie" },
  { value: "price_asc", label: "Cena: od najniższej" },
  { value: "price_desc", label: "Cena: od najwyższej" },
] as const;

function normalizeSortParam(sort: string | null): string {
  if (sort === "price_asc" || sort === "price_desc") return sort;
  return "default";
}

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = normalizeSortParam(searchParams.get("sort"));

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    const qs = params.toString();
    const newUrl = qs ? `${pathname}?${qs}` : pathname;
    router.push(newUrl, { scroll: false });
  }

  return (
    <label className="flex flex-col items-end gap-1.5 text-right">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Sortuj według</span>
      <select
        value={current}
        onChange={handleChange}
        className="min-h-11 min-w-[220px] cursor-pointer appearance-none rounded-full border border-zinc-200 bg-white py-2.5 pr-10 pl-4 text-sm font-medium text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow] hover:border-zinc-300 focus-visible:border-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900/15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "1rem",
        }}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
