import Link from "next/link";
import { eq } from "drizzle-orm";
import { CheckCircle } from "lucide-react";

import { auth } from "@/auth";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { formatPlnAmount } from "@/lib/cart/format-pln";
import { PageGradientHero } from "@/components/layout/PageGradientHero";

type SearchParams = Promise<{ orderId?: string }>;

/**
 * Order confirmation page.
 *
 * Access rules:
 *   - Authenticated orders (orders.userId set) → only visible to the owning
 *     user. Anyone else (or an anonymous visitor) sees "not found".
 *   - Guest orders (orders.userId null) → viewable by anyone with the URL for
 *     v1. Order IDs are serial ints, so this is enumeration-exposed —
 *     acceptable for v1 confirmation only; TODO: swap to an opaque token when
 *     we build the /moje-konto/zamowienia page.
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { orderId: orderIdParam } = await searchParams;
  const orderId = Number.parseInt(orderIdParam ?? "", 10);

  if (!Number.isFinite(orderId) || orderId <= 0) {
    return <NotFoundState />;
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) return <NotFoundState />;

  if (order.userId) {
    const session = await auth();
    if (session?.user?.id !== order.userId) return <NotFoundState />;
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return (
    <div className="bg-white">
      <PageGradientHero title="Dziękujemy!" eyebrow="Zamówienie" />
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 py-16 text-center md:py-24">
        <div className="rounded-full bg-emerald-50 p-5 ring-1 ring-emerald-100">
          <CheckCircle
            className="size-16 text-emerald-600 md:size-20"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
        <p className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
          Zamówienie przyjęte do realizacji
        </p>
        <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-800 tabular-nums">
          Numer zamówienia: #ORD-{order.id.toString().padStart(6, "0")}
        </p>

        <section className="w-full text-left">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-900">
            Pozycje
          </h2>
          <ul className="divide-y divide-zinc-100 rounded-lg border border-zinc-200">
            {items.map((item) => {
              const snapshot = (item.productSnapshot ?? {}) as {
                name?: string;
                slug?: string;
              };
              return (
                <li
                  key={item.id}
                  className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm"
                >
                  <span className="text-zinc-800">
                    {snapshot.name ?? "Produkt"}
                    <span className="ml-2 text-zinc-500">× {item.quantity}</span>
                  </span>
                  <span className="tabular-nums text-zinc-900">
                    {formatPlnAmount(
                      Number.parseFloat(item.unitPrice) * item.quantity,
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex items-baseline justify-between rounded-lg bg-zinc-50 px-4 py-3 text-sm font-semibold">
            <span>Razem</span>
            <span className="tabular-nums">
              {formatPlnAmount(Number.parseFloat(order.totalAmount))}
            </span>
          </div>
        </section>

        <Link
          href="/"
          className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-zinc-900 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Wróć do sklepu
        </Link>
      </main>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="bg-white">
      <PageGradientHero title="Nie znaleziono" eyebrow="Zamówienie" />
      <main className="mx-auto flex min-h-[40vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-16 text-center md:py-24">
        <p className="max-w-sm text-base font-medium leading-snug text-zinc-700">
          Nie znaleźliśmy tego zamówienia. Sprawdź link lub wróć do sklepu.
        </p>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-zinc-900 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Wróć do sklepu
        </Link>
      </main>
    </div>
  );
}
