"use client";

import { forwardRef } from "react";
import { ShoppingBag } from "lucide-react";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import { useCartStore } from "@/lib/store/useCartStore";
import { cn } from "@/lib/utils";

export const CartIcon = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
  function CartIcon({ className, ...props }, ref) {
    const items = useCartStore((s) => s.items);
    const isMounted = useIsMounted();

    const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
    const showBadge = isMounted && totalUnits > 0;
    const badgeLabel = totalUnits > 99 ? "99+" : String(totalUnits);

    return (
      <button
        ref={ref}
        type="button"
        className={cn("group flex items-center text-white", className)}
        aria-label="Otwórz koszyk"
        {...props}
      >
        <div className="relative rounded-full border border-white/10 p-2 transition-colors group-hover:border-white/40">
          <ShoppingBag className="h-5 w-5" strokeWidth={1.2} aria-hidden />
          {showBadge ? (
            <span
              className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white tabular-nums"
              aria-hidden
            >
              {badgeLabel}
            </span>
          ) : null}
        </div>
        {showBadge ? (
          <span className="sr-only">{`Produktów w koszyku: ${totalUnits}`}</span>
        ) : null}
      </button>
    );
  },
);
