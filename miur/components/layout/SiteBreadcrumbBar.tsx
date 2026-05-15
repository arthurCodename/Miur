"use client";

import Link from "next/link";
import type { SiteBreadcrumbItem } from "@/lib/navigation/breadcrumb-types";
import { cn } from "@/lib/utils";

type SiteBreadcrumbBarProps = {
  items: SiteBreadcrumbItem[];
  className?: string;
};

/**
 * Minimalistyczna ścieżka jak na referencyjnym sklepie: uppercase, cienka linia pod całością.
 */
export function SiteBreadcrumbBar({ items, className }: SiteBreadcrumbBarProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Ścieżka nawigacji" className={cn("min-w-0 max-w-full border-b border-zinc-900 pb-2.5", className)}>
      <ol className="flex min-w-0 max-w-full flex-wrap items-baseline gap-x-1.5 gap-y-1 text-[10px] font-bold uppercase leading-snug tracking-[0.2em] text-zinc-900 md:text-[11px] md:tracking-[0.22em]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const showLink = Boolean(item.href) && !isLast;

          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-baseline gap-x-1.5">
              {index > 0 ? (
                <span className="shrink-0 font-normal text-zinc-400" aria-hidden>
                  /
                </span>
              ) : null}
              {showLink ? (
                <Link
                  href={item.href!}
                  className="max-w-[min(100%,14rem)] truncate underline-offset-4 transition-colors hover:text-zinc-600 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 md:max-w-[min(100%,20rem)]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "max-w-[min(100%,18rem)] truncate text-balance md:max-w-[min(100%,32rem)]",
                    isLast ? "text-zinc-800" : "text-zinc-900",
                  )}
                  {...(isLast ? { "aria-current": "page" as const } : {})}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
