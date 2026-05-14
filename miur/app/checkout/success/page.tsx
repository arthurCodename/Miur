"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { useCartStore } from "@/lib/store/useCartStore";

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  const [orderId] = useState(() => Math.floor(Math.random() * 1_000_000));

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="bg-white">
      <PageGradientHero title="Dziękujemy!" eyebrow="Zamówienie" />
      <main className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center md:py-24">
      <div className="flex max-w-md flex-col items-center gap-6">
        <div className="rounded-full bg-emerald-50 p-5 ring-1 ring-emerald-100">
          <CheckCircle className="size-16 text-emerald-600 md:size-20" strokeWidth={1.5} aria-hidden />
        </div>
        <p className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
          Zamówienie przyjęte do realizacji
        </p>
        <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-800 tabular-nums">
          Numer zamówienia: #ORD-{orderId}
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-zinc-900 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Wróć do sklepu
        </Link>
      </div>
    </main>
    </div>
  );
}
