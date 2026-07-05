import { eq } from "drizzle-orm";

import { db } from "@/db";
import { carts } from "@/db/schema";
import {
  clearCartSessionCookie,
  readCartSessionCookie,
} from "@/lib/cart/cookie";
import { mergeCartItems } from "@/lib/cart/merge";
import type { CartItemPayload } from "@/lib/cart/zod";

/**
 * Fold the current request's anonymous cart into the user's cart.
 * Safe to call on every sign-in — does nothing if there's no anon cookie
 * or no items in the anon cart. Failures are swallowed and logged, never
 * thrown, because losing a cart is worse-UX-but-not-broken; throwing here
 * would abort the sign-in itself.
 */
export async function mergeAnonymousCartIntoUserCart(userId: string): Promise<void> {
  try {
    const anonSessionId = await readCartSessionCookie();
    if (!anonSessionId) return;

    const [anonCart] = await db
      .select({ id: carts.id, items: carts.items })
      .from(carts)
      .where(eq(carts.sessionId, anonSessionId))
      .limit(1);

    const anonItems = (Array.isArray(anonCart?.items) ? anonCart.items : []) as CartItemPayload[];

    if (!anonCart || anonItems.length === 0) {
      // No anon cart, or it's empty — nothing to merge. Still clear the
      // cookie so the user gets a fresh anonymous identity if they ever
      // sign out and start shopping again.
      await clearCartSessionCookie();
      return;
    }

    const [userCart] = await db
      .select({ id: carts.id, items: carts.items })
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    const userItems = (Array.isArray(userCart?.items) ? userCart.items : []) as CartItemPayload[];
    const merged = mergeCartItems(userItems, anonItems);
    const now = new Date();

    if (userCart) {
      await db
        .update(carts)
        .set({ items: merged, updatedAt: now })
        .where(eq(carts.id, userCart.id));
    } else {
      await db.insert(carts).values({
        userId,
        items: merged,
        updatedAt: now,
      });
    }

    // Delete the anonymous row + clear the cookie so we don't merge twice.
    await db.delete(carts).where(eq(carts.id, anonCart.id));
    await clearCartSessionCookie();
  } catch (err) {
    console.error("[cart-merge] failed for user", userId, err);
  }
}
