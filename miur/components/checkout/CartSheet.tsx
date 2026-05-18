"use client";

import { useMemo, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPlnAmount } from "@/lib/cart/format-pln";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import { useCartStore } from "@/lib/store/useCartStore";
import { cn } from "@/lib/utils";

type CartSheetProps = {
  children: ReactNode;
};

export function CartSheet({ children }: CartSheetProps) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const isMounted = useIsMounted();

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton
        className={cn(
          "flex h-full max-h-dvh w-full flex-col gap-0 border-zinc-200 bg-white p-0 text-zinc-900 sm:max-w-md",
        )}
      >
        <SheetHeader className="border-b border-zinc-100 px-5 py-4">
          <SheetTitle className="font-heading text-lg font-semibold tracking-tight text-zinc-900">
            Koszyk
          </SheetTitle>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {!isMounted ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-sm text-zinc-500">
              <span className="inline-block size-8 animate-pulse rounded-full bg-zinc-100" aria-hidden />
              <span>Ładowanie koszyka…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="rounded-full border border-zinc-200 bg-zinc-50 p-6">
                <ShoppingBag className="size-10 text-zinc-400" strokeWidth={1.25} aria-hidden />
              </div>
              <p className="max-w-[240px] text-base font-medium leading-snug text-zinc-700">
                Twój koszyk jest pusty
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 border-b border-zinc-100 pb-5 last:border-b-0 last:pb-0"
                >
                  <Link
                    href={`/produkt/${item.slug}`}
                    className="relative size-[72px] shrink-0 overflow-hidden rounded-md bg-zinc-100"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex gap-2">
                      <Link
                        href={`/produkt/${item.slug}`}
                        className="min-w-0 flex-1 text-sm font-semibold leading-snug text-zinc-900 underline-offset-2 hover:underline"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                        aria-label={`Usuń ${item.name} z koszyka`}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>

                    <p className="text-xs uppercase tracking-wide text-zinc-500">{item.category}</p>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-sm font-semibold tabular-nums text-zinc-900">
                        {formatPlnAmount(item.price)}
                      </span>

                      <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 p-0.5">
                        <button
                          type="button"
                          className="flex size-9 items-center justify-center rounded-full text-zinc-700 transition-colors hover:bg-white hover:text-zinc-900"
                          aria-label="Zmniejsz ilość"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="size-4" aria-hidden />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold tabular-nums text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="flex size-9 items-center justify-center rounded-full text-zinc-700 transition-colors hover:bg-white hover:text-zinc-900"
                          aria-label="Zwiększ ilość"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="size-4" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <SheetFooter className="border-t border-zinc-100 bg-white px-5 py-4">
          <div className="flex w-full flex-col gap-4">
            <p className="text-lg font-bold text-zinc-900">
              {!isMounted ? (
                <span className="text-zinc-400">Razem: —</span>
              ) : (
                <>
                  Razem:{" "}
                  <span className="tabular-nums">{formatPlnAmount(totalPrice)}</span>
                </>
              )}
            </p>
            <p className="sr-only" aria-live="polite">
              {!isMounted ? "" : `Razem: ${formatPlnAmount(totalPrice)}`}
            </p>
            {isMounted && items.length > 0 ? (
              <Link
                href="/checkout"
                className="flex min-h-12 w-full items-center justify-center rounded-full bg-zinc-900 px-6 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
              >
                Przejdź do kasy
              </Link>
            ) : (
              <span
                className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-zinc-300 px-6 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500"
                aria-disabled
              >
                Przejdź do kasy
              </span>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
