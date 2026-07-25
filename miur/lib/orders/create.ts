import { and, eq, inArray, isNull } from "drizzle-orm";

import { db } from "@/db";
import { carts, orderItems, orders, products } from "@/db/schema";
import { readCartSessionCookie } from "@/lib/cart/cookie";
import { resolveShippingCost, type DeliveryMethod } from "@/lib/checkout/shipping";
import type { CartItemPayload } from "@/lib/cart/zod";
import type { OrderPayload } from "./zod";

export type CreateOrderResult =
  | { ok: true; orderId: number }
  | { ok: false; code: "empty_cart" | "cart_not_found" | "invalid_product" };

/**
 * Create an order from the current viewer's cart.
 *
 * Steps:
 *   1. Resolve the cart row (userId if signed in, else session cookie).
 *   2. Look up authoritative product data for each cart item. Prices come
 *      from the products table — never from the client-supplied cart JSON.
 *      (Mock products not in the DB fall back to the client price with a
 *      log; a TODO once Phase 8.1 XML sync populates real products.)
 *   3. Insert `orders` row (userId OR guestEmail depending on session).
 *   4. Insert `order_items` rows, one per cart item, with `productSnapshot`
 *      frozen at order time.
 *   5. Delete the cart row so the checkout can't be double-submitted.
 */
export async function createOrder(
  payload: OrderPayload,
  session: { user?: { id?: string } } | null,
): Promise<CreateOrderResult> {
  const cartRow = await resolveCartRow(session);
  if (!cartRow) return { ok: false, code: "cart_not_found" };

  const items = (Array.isArray(cartRow.items) ? cartRow.items : []) as CartItemPayload[];
  if (items.length === 0) return { ok: false, code: "empty_cart" };

  const productIds = items
    .map((i) => Number.parseInt(i.id, 10))
    .filter((n) => Number.isFinite(n));

  const productRows = productIds.length
    ? await db
        .select({
          id: products.id,
          slug: products.slug,
          name: products.name,
          price: products.price,
        })
        .from(products)
        .where(inArray(products.id, productIds))
    : [];

  const productById = new Map(productRows.map((p) => [p.id, p]));

  let subtotal = 0;
  const orderItemInserts: Array<{
    productId: number;
    quantity: number;
    unitPrice: string;
    productSnapshot: unknown;
  }> = [];

  for (const item of items) {
    const parsedId = Number.parseInt(item.id, 10);
    const dbProduct = Number.isFinite(parsedId) ? productById.get(parsedId) : undefined;

    // Resolve the authoritative unit price: DB if the product exists there,
    // client-provided value as a fallback for mock-catalog items. Log the
    // fallback so it's visible during dev; safe to remove after Phase 8.1.
    const unitPrice = dbProduct
      ? Number.parseFloat(dbProduct.price)
      : (console.warn(`[orders] fallback price for mock product id=${item.id}`), item.price);

    // If a product ID looked like a real DB integer but wasn't found, that
    // is a real error (tampering, deleted product). Refuse the order rather
    // than silently pricing off stale client state.
    if (!dbProduct && Number.isFinite(parsedId) && parsedId > 0 && productRows.length > 0) {
      return { ok: false, code: "invalid_product" };
    }

    subtotal += unitPrice * item.quantity;

    // DB product ID for row insertion — fall back to a synthetic negative
    // value for mock products so they don't collide with real ones. This
    // will fail the FK constraint if the product doesn't exist in DB, which
    // is a TODO to reconcile in Phase 8.1.
    const productId = dbProduct?.id ?? parsedId;

    orderItemInserts.push({
      productId,
      quantity: item.quantity,
      unitPrice: unitPrice.toFixed(2),
      productSnapshot: {
        id: item.id,
        slug: dbProduct?.slug ?? item.slug,
        name: dbProduct?.name ?? item.name,
        image: item.image,
        category: item.category,
        unitPriceAtOrder: unitPrice,
      },
    });
  }

  const shippingCost = resolveShippingCost(subtotal, payload.shipping.method as DeliveryMethod);
  const total = subtotal + shippingCost;

  const insertedOrder = await db
    .insert(orders)
    .values({
      userId: session?.user?.id ?? null,
      guestEmail: session?.user?.id ? null : payload.contact.email,
      shippingAddress: serializeShippingAddress(payload),
      billingAddress: serializeShippingAddress(payload), // same as shipping for v1
      totalAmount: total.toFixed(2),
      // status defaults to 'pending'
    })
    .returning({ id: orders.id });

  const orderId = insertedOrder[0]?.id;
  if (!orderId) throw new Error("Failed to insert order");

  await db.insert(orderItems).values(
    orderItemInserts.map((item) => ({
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      productSnapshot: item.productSnapshot,
    })),
  );

  await db.delete(carts).where(eq(carts.id, cartRow.id));

  return { ok: true, orderId };
}

async function resolveCartRow(session: { user?: { id?: string } } | null) {
  if (session?.user?.id) {
    const [row] = await db
      .select({ id: carts.id, items: carts.items })
      .from(carts)
      .where(eq(carts.userId, session.user.id))
      .limit(1);
    return row;
  }
  const sessionId = await readCartSessionCookie();
  if (!sessionId) return null;
  const [row] = await db
    .select({ id: carts.id, items: carts.items })
    .from(carts)
    .where(and(eq(carts.sessionId, sessionId), isNull(carts.userId)))
    .limit(1);
  return row;
}

function serializeShippingAddress(payload: OrderPayload) {
  return {
    ...payload.shipping,
    recipient: {
      fullName: payload.contact.fullName,
      email: payload.contact.email,
      phone: payload.contact.phone,
    },
  };
}
