import { Resend } from "resend";

import { getSiteUrl } from "@/lib/site-url";
import {
  OrderConfirmation,
  type OrderConfirmationLine,
} from "./templates/OrderConfirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export type SendOrderConfirmationParams = {
  to: string;
  orderId: number;
  customerName: string;
  lines: OrderConfirmationLine[];
  subtotal: number;
  shippingCost: number;
  total: number;
  deliveryLabel: string;
  deliveryDetails: string;
};

/**
 * Send the order confirmation.
 *
 * Throws on failure. Callers that must not fail the order because of a mail
 * problem should catch — see `lib/orders/notify.ts`.
 */
export async function sendOrderConfirmationEmail({
  to,
  orderId,
  customerName,
  lines,
  subtotal,
  shippingCost,
  total,
  deliveryLabel,
  deliveryDetails,
}: SendOrderConfirmationParams): Promise<void> {
  const siteUrl = getSiteUrl();

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to,
    // Subject stays deliberately generic — no product or shop category.
    subject: `Potwierdzenie zamówienia #${orderId}`,
    react: OrderConfirmation({
      orderId,
      customerName,
      lines,
      subtotal,
      shippingCost,
      total,
      deliveryLabel,
      deliveryDetails,
      orderUrl: `${siteUrl}/checkout/success?orderId=${orderId}`,
      withdrawalFormUrl: `${siteUrl}/zwroty-reklamacje`,
      termsUrl: `${siteUrl}/regulamin`,
    }),
  });

  if (error) {
    throw new Error(`Failed to send order confirmation: ${error.message}`);
  }
}
