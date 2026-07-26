import { Button, Section, Text } from "@react-email/components";

import { BaseLayout, emailStyles as s } from "./BaseLayout";

export type ShippingNotificationProps = {
  orderId: number;
  customerName: string;
  deliveryLabel: string;
  deliveryDetails: string;
  /** InPost/courier tracking number, when the carrier has issued one. */
  trackingNumber?: string;
  trackingUrl?: string;
  orderUrl: string;
};

/**
 * Shipping notification — sent when an order moves to `shipped`.
 *
 * Discretion matters here more than anywhere: this is the mail most likely to
 * be read on a lock screen or in a shared inbox. Subject and preview stay
 * generic, and the parcel is never described.
 */
export function ShippingNotification({
  orderId,
  customerName,
  deliveryLabel,
  deliveryDetails,
  trackingNumber,
  trackingUrl,
  orderUrl,
}: ShippingNotificationProps) {
  return (
    <BaseLayout
      preview={`Zamówienie #${orderId} zostało wysłane`}
      heading="Twoje zamówienie jest w drodze"
    >
      <Text style={s.text}>
        Cześć {customerName}, Twoje zamówienie <strong>#{orderId}</strong>
        {" "}zostało przekazane do wysyłki.
      </Text>

      <Text style={s.label}>Sposób dostawy</Text>
      <Text style={s.strong}>{deliveryLabel}</Text>
      <Text style={s.muted}>{deliveryDetails}</Text>

      {trackingNumber ? (
        <>
          <Text style={s.label}>Numer przesyłki</Text>
          <Text style={s.strong}>{trackingNumber}</Text>
          <Text style={s.muted}>
            Status przesyłki może być widoczny u przewoźnika dopiero po kilku
            godzinach od nadania.
          </Text>
        </>
      ) : null}

      <Section style={{ margin: "32px 0 8px" }}>
        <Button href={trackingUrl ?? orderUrl} style={s.button}>
          {trackingUrl ? "Śledź przesyłkę" : "Zobacz zamówienie"}
        </Button>
      </Section>

      <Text style={s.muted}>
        Paczka jest nadana w dyskretnym opakowaniu, bez oznaczeń wskazujących na
        zawartość ani na sklep.
      </Text>
    </BaseLayout>
  );
}

export default ShippingNotification;
