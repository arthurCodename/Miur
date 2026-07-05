import type { CartItemPayload } from "./zod";

/**
 * Merge two cart item arrays. Used at sign-in time to fold an anonymous
 * cart into the user's existing cart without losing anything.
 *
 * Rules:
 *   - Items are matched by `id` (the product identifier).
 *   - When the same item exists in both carts, quantities are summed.
 *   - Quantity is capped at 99 to match the client-side useCartStore cap.
 *   - For overlapping items, the user-cart entry wins on display fields
 *     (name, image, etc.) — they're usually identical anyway, but if the
 *     anon cart was created with stale data the user cart is more recent.
 */
export function mergeCartItems(
  userItems: CartItemPayload[],
  anonItems: CartItemPayload[],
): CartItemPayload[] {
  const byId = new Map<string, CartItemPayload>();

  for (const item of userItems) {
    byId.set(item.id, { ...item });
  }

  for (const item of anonItems) {
    const existing = byId.get(item.id);
    if (existing) {
      const summed = existing.quantity + item.quantity;
      existing.quantity = Math.min(summed, 99);
    } else {
      byId.set(item.id, { ...item });
    }
  }

  return Array.from(byId.values());
}
