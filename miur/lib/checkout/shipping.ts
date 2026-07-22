export type DeliveryMethod = "paczkomat" | "courier";

/**
 * v1 shipping rates (gross PLN, VAT included). These are display values for
 * the checkout summary — the authoritative price will be recomputed
 * server-side when order creation lands (Phase 7.6). Keep both in sync.
 */
export const SHIPPING_COST_PLN: Record<DeliveryMethod, number> = {
  paczkomat: 12.99,
  courier: 16.99,
};

/** Orders at or above this subtotal (gross PLN) ship for free. */
export const FREE_SHIPPING_THRESHOLD_PLN = 199;

export function resolveShippingCost(subtotal: number, method: DeliveryMethod): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= FREE_SHIPPING_THRESHOLD_PLN) return 0;
  return SHIPPING_COST_PLN[method];
}
