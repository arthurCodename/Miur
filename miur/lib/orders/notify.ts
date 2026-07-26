import { sendOrderConfirmationEmail } from "@/lib/email/send-order-confirmation";
import type { OrderConfirmationLine } from "@/lib/email/templates/OrderConfirmation";
import type { OrderPayload } from "./zod";

/**
 * Human-readable delivery label + details for the confirmation mail.
 * Kept here (not in the template) so the shipping-notification mail and any
 * future admin view describe delivery identically.
 */
export function describeDelivery(shipping: OrderPayload["shipping"]): {
  label: string;
  details: string;
} {
  if (shipping.method === "paczkomat") {
    return {
      label: "Paczkomat InPost",
      details: `${shipping.paczkomatCode}, ${shipping.paczkomatAddress}`,
    };
  }
  return {
    label: "Kurier",
    details: `${shipping.addressLine}, ${shipping.postalCode} ${shipping.city}`,
  };
}

export type OrderNotificationInput = {
  orderId: number;
  payload: OrderPayload;
  lines: OrderConfirmationLine[];
  subtotal: number;
  shippingCost: number;
  total: number;
};

/**
 * Fire the order-confirmation mail.
 *
 * Deliberately swallows its own errors: the order is already committed by the
 * time this runs, so a Resend outage must not turn a paid order into a 500 for
 * the customer. Failures are logged for follow-up instead.
 *
 * Phase 7.5 note: with payments skipped, this is called right after the order
 * row is created. When the payment webhook lands, move the call there so the
 * confirmation only goes out once an order is actually paid.
 */
export async function notifyOrderCreated({
  orderId,
  payload,
  lines,
  subtotal,
  shippingCost,
  total,
}: OrderNotificationInput): Promise<void> {
  const delivery = describeDelivery(payload.shipping);
  try {
    await sendOrderConfirmationEmail({
      to: payload.contact.email,
      orderId,
      customerName: payload.contact.fullName,
      lines,
      subtotal,
      shippingCost,
      total,
      deliveryLabel: delivery.label,
      deliveryDetails: delivery.details,
    });
  } catch (err) {
    console.error(
      `[orders] confirmation email failed for order ${orderId}:`,
      err,
    );
  }
}
