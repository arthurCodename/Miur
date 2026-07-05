import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { carts } from "@/db/schema";
import {
  readCartSessionCookie,
  readOrCreateCartSessionCookie,
} from "@/lib/cart/cookie";
import {
  cartPayloadSchema,
  type CartItemPayload,
} from "@/lib/cart/zod";

/**
 * GET /api/cart — return the current viewer's cart.
 *
 * Resolution order:
 *   1. If signed in, look up by userId.
 *   2. Else, if the anonymous-cart cookie is set, look up by sessionId.
 *   3. Else, return an empty cart (no cookie is created on read).
 */
export async function GET() {
  const session = await auth();

  if (session?.user?.id) {
    const [row] = await db
      .select({ items: carts.items })
      .from(carts)
      .where(eq(carts.userId, session.user.id))
      .limit(1);
    return NextResponse.json({ items: itemsFrom(row?.items) });
  }

  const sessionId = await readCartSessionCookie();
  if (!sessionId) {
    return NextResponse.json({ items: [] });
  }

  const [row] = await db
    .select({ items: carts.items })
    .from(carts)
    .where(eq(carts.sessionId, sessionId))
    .limit(1);

  return NextResponse.json({ items: itemsFrom(row?.items) });
}

/**
 * POST /api/cart — overwrite the current viewer's cart.
 *
 * Body: { items: CartItem[] }
 *
 * Mints the anonymous-cart cookie if needed (POST is the right time — we're
 * doing a write anyway, and the cookie itself is part of the write).
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = cartPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid cart payload" },
      { status: 400 },
    );
  }

  const { items } = parsed.data;
  const session = await auth();
  const now = new Date();

  if (session?.user?.id) {
    // Logged-in: upsert by userId. The unique constraint on userId makes
    // `onConflictDoUpdate(target: userId)` resolve safely.
    await db
      .insert(carts)
      .values({
        userId: session.user.id,
        items,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: carts.userId,
        set: { items, updatedAt: now },
      });
    return NextResponse.json({ ok: true });
  }

  // Anonymous: read-or-mint cookie, then upsert by sessionId.
  const sessionId = await readOrCreateCartSessionCookie();
  await db
    .insert(carts)
    .values({
      sessionId,
      items,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: carts.sessionId,
      set: { items, updatedAt: now },
    });

  return NextResponse.json({ ok: true });
}

/**
 * Defensively coerce a `jsonb` value back to a CartItemPayload[]. The DB
 * column is typed as `unknown` by Drizzle, so we narrow at the boundary.
 * If the column somehow contains garbage, we return [] rather than throw.
 */
function itemsFrom(value: unknown): CartItemPayload[] {
  if (!Array.isArray(value)) return [];
  return value as CartItemPayload[];
}
