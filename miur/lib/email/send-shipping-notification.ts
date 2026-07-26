import { Resend } from "resend";

import { getSiteUrl } from "@/lib/site-url";
import { ShippingNotification } from "./templates/ShippingNotification";

const resend = new Resend(process.env.RESEND_API_KEY);

export type SendShippingNotificationParams = {
  to: string;
  orderId: number;
  customerName: string;
  deliveryLabel: string;
  deliveryDetails: string;
  trackingNumber?: string;
  trackingUrl?: string;
};

/**
 * Send the "your order has shipped" mail.
 *
 * Called from the admin "mark as shipped" action (Phase 8.2) and, once the
 * ShipX integration lands (Phase 7.4), from the label-creation callback that
 * knows the tracking number.
 */
export async function sendShippingNotificationEmail({
  to,
  orderId,
  customerName,
  deliveryLabel,
  deliveryDetails,
  trackingNumber,
  trackingUrl,
}: SendShippingNotificationParams): Promise<void> {
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to,
    subject: `Zamówienie #${orderId} zostało wysłane`,
    react: ShippingNotification({
      orderId,
      customerName,
      deliveryLabel,
      deliveryDetails,
      trackingNumber,
      trackingUrl,
      orderUrl: `${getSiteUrl()}/checkout/success?orderId=${orderId}`,
    }),
  });

  if (error) {
    throw new Error(`Failed to send shipping notification: ${error.message}`);
  }
}
