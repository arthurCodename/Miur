import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createOrder } from "@/lib/orders/create";
import { orderPayloadSchema } from "@/lib/orders/zod";

/**
 * POST /api/orders — create an order from the current viewer's cart.
 *
 * Trust boundary: the client sends contact + shipping + consent. The server
 * pulls the cart (and its prices) from the DB — we never trust a client-sent
 * price or line-item list. See lib/orders/create.ts.
 *
 * Returns:
 *   201 { ok: true, orderId }             on success
 *   400 { error, path? }                  on validation / cart errors
 *   500 { error }                         on unexpected DB failures
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowy format żądania" },
      { status: 400 },
    );
  }

  const parsed = orderPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Nieprawidłowe dane", path: first?.path },
      { status: 400 },
    );
  }

  const session = await auth();

  try {
    const result = await createOrder(parsed.data, session);
    if (!result.ok) {
      const messages: Record<typeof result.code, string> = {
        empty_cart: "Twój koszyk jest pusty.",
        cart_not_found: "Nie znaleziono koszyka. Odśwież stronę.",
        invalid_product: "Jeden z produktów w koszyku jest niedostępny.",
      };
      return NextResponse.json(
        { error: messages[result.code] },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { ok: true, orderId: result.orderId },
      { status: 201 },
    );
  } catch (err) {
    console.error("[api/orders] createOrder failed:", err);
    return NextResponse.json(
      { error: "Nie udało się złożyć zamówienia. Spróbuj ponownie." },
      { status: 500 },
    );
  }
}
