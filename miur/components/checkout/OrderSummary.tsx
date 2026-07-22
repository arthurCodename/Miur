"use client";

import { useMemo } from "react";
import Image from "next/image";
import { formatPlnAmount } from "@/lib/cart/format-pln";
import {
  FREE_SHIPPING_THRESHOLD_PLN,
  resolveShippingCost,
  type DeliveryMethod,
} from "@/lib/checkout/shipping";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import { useCartStore } from "@/lib/store/useCartStore";

type OrderSummaryProps = {
  deliveryMethod: DeliveryMethod;
};

/**
 * Checkout order summary driven by the cart store. Delivery cost reacts to
 * the currently selected delivery method in the checkout form.
 */
export function OrderSummary({ deliveryMethod }: OrderSummaryProps) {
  const items = useCartStore((s) => s.items);
  const isMounted = useIsMounted();

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const shippingCost = resolveShippingCost(subtotal, deliveryMethod);
  const total = subtotal + shippingCost;
  const missingForFreeShipping = FREE_SHIPPING_THRESHOLD_PLN - subtotal;

  return (
    <section
      aria-label="Podsumowanie zamówienia"
      className="rounded-lg border border-zinc-200 bg-zinc-50 p-6"
    >
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900">
        Twoje zamówienie
      </h2>

      {!isMounted ? (
        <p className="mt-6 text-sm text-zinc-500">Ładowanie koszyka…</p>
      ) : (
        <>
          <ul className="mt-6 flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-sm font-semibold leading-snug text-zinc-900">
                    {item.name}
                  </span>
                  <span className="text-xs text-zinc-500">Ilość: {item.quantity}</span>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-900">
                  {formatPlnAmount(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 flex flex-col gap-2 border-t border-zinc-200 pt-4 text-sm">
            <div className="flex items-center justify-between text-zinc-700">
              <dt>Wartość produktów</dt>
              <dd className="tabular-nums">{formatPlnAmount(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between text-zinc-700">
              <dt>Dostawa ({deliveryMethod === "paczkomat" ? "Paczkomat InPost" : "Kurier"})</dt>
              <dd className="tabular-nums">
                {shippingCost === 0 ? (
                  <span className="font-semibold text-emerald-700">Darmowa</span>
                ) : (
                  formatPlnAmount(shippingCost)
                )}
              </dd>
            </div>
            {shippingCost > 0 && missingForFreeShipping > 0 ? (
              <p className="text-xs text-zinc-500">
                Do darmowej dostawy brakuje{" "}
                <span className="font-semibold tabular-nums">
                  {formatPlnAmount(missingForFreeShipping)}
                </span>
                .
              </p>
            ) : null}
            <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-3 text-base font-bold text-zinc-900">
              <dt>Razem</dt>
              <dd className="tabular-nums">{formatPlnAmount(total)}</dd>
            </div>
          </dl>

          <p className="mt-3 text-xs text-zinc-500">Ceny zawierają podatek VAT.</p>
        </>
      )}
    </section>
  );
}
