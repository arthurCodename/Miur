import { z } from "zod";

/**
 * Server-side validation for cart items posted from the client.
 *
 * Shape mirrors `CartItem` in lib/store/useCartStore.ts — keep them in sync.
 * We do NOT trust the client's `price` value (it could be tampered with);
 * however we still accept it here so the JSON shape round-trips cleanly.
 * Whenever the cart turns into an order, prices are re-resolved server-side
 * from the products table — that's the only price that matters.
 */
export const cartItemSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  image: z.string().min(1),
  category: z.string(),
  quantity: z.number().int().positive().max(99),
});

export const cartPayloadSchema = z.object({
  items: z.array(cartItemSchema).max(200),
});

export type CartItemPayload = z.infer<typeof cartItemSchema>;
export type CartPayload = z.infer<typeof cartPayloadSchema>;
