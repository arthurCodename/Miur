import { Button, Column, Hr, Row, Section, Text } from "@react-email/components";

import { formatPlnAmount } from "@/lib/cart/format-pln";
import { BaseLayout, emailStyles as s } from "./BaseLayout";

export type OrderConfirmationLine = {
  name: string;
  quantity: number;
  unitPrice: number;
};

export type OrderConfirmationProps = {
  orderId: number;
  customerName: string;
  lines: OrderConfirmationLine[];
  subtotal: number;
  shippingCost: number;
  total: number;
  /** Pre-formatted, method-aware delivery description. */
  deliveryLabel: string;
  deliveryDetails: string;
  orderUrl: string;
  withdrawalFormUrl: string;
  termsUrl: string;
};

/**
 * Order confirmation.
 *
 * This mail doubles as the confirmation on a durable medium that Polish
 * consumer law (ustawa o prawach konsumenta, art. 21) requires after a
 * distance contract is concluded — hence the itemised total, the delivery
 * details, and the explicit 14-day withdrawal notice with a link to the form.
 * Don't strip those sections for design reasons.
 */
export function OrderConfirmation({
  orderId,
  customerName,
  lines,
  subtotal,
  shippingCost,
  total,
  deliveryLabel,
  deliveryDetails,
  orderUrl,
  withdrawalFormUrl,
  termsUrl,
}: OrderConfirmationProps) {
  return (
    <BaseLayout
      preview={`Potwierdzenie zamówienia #${orderId}`}
      heading="Dziękujemy za zamówienie"
    >
      <Text style={s.text}>
        Cześć {customerName}, przyjęliśmy Twoje zamówienie{" "}
        <strong>#{orderId}</strong>. Poniżej znajdziesz jego podsumowanie.
      </Text>

      <Text style={s.label}>Zamówione produkty</Text>
      {lines.map((line, i) => (
        <Row key={`${line.name}-${i}`} style={{ marginBottom: "8px" }}>
          <Column>
            <Text style={s.strong}>{line.name}</Text>
            <Text style={s.muted}>
              {line.quantity} × {formatPlnAmount(line.unitPrice)}
            </Text>
          </Column>
          <Column align="right">
            <Text style={s.strong}>
              {formatPlnAmount(line.unitPrice * line.quantity)}
            </Text>
          </Column>
        </Row>
      ))}

      <Hr style={{ borderColor: "#e4e4e7", margin: "16px 0" }} />

      <Row>
        <Column>
          <Text style={s.muted}>Wartość produktów</Text>
        </Column>
        <Column align="right">
          <Text style={s.muted}>{formatPlnAmount(subtotal)}</Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Text style={s.muted}>Dostawa ({deliveryLabel})</Text>
        </Column>
        <Column align="right">
          <Text style={s.muted}>
            {shippingCost === 0 ? "Darmowa" : formatPlnAmount(shippingCost)}
          </Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Text style={{ ...s.strong, fontSize: "16px" }}>Razem</Text>
        </Column>
        <Column align="right">
          <Text style={{ ...s.strong, fontSize: "16px" }}>
            {formatPlnAmount(total)}
          </Text>
        </Column>
      </Row>
      <Text style={s.muted}>Ceny zawierają podatek VAT.</Text>

      <Text style={s.label}>Dostawa</Text>
      <Text style={s.strong}>{deliveryLabel}</Text>
      <Text style={s.muted}>{deliveryDetails}</Text>

      <Section style={{ margin: "32px 0 8px" }}>
        <Button href={orderUrl} style={s.button}>
          Zobacz zamówienie
        </Button>
      </Section>

      <Text style={s.label}>Prawo odstąpienia od umowy</Text>
      <Text style={s.muted}>
        Masz prawo odstąpić od umowy w terminie 14 dni bez podania przyczyny.
        Aby skorzystać z tego prawa, poinformuj nas o swojej decyzji —
        możesz użyć{" "}
        <a href={withdrawalFormUrl} style={{ color: "#18181b" }}>
          formularza odstąpienia
        </a>
        . Szczegóły znajdziesz w{" "}
        <a href={termsUrl} style={{ color: "#18181b" }}>
          Regulaminie
        </a>
        . Prawo odstąpienia nie przysługuje w przypadku towarów dostarczanych w
        zapieczętowanym opakowaniu, których po otwarciu nie można zwrócić ze
        względu na ochronę zdrowia lub higienę, jeżeli opakowanie zostało
        otwarte po dostarczeniu.
      </Text>
    </BaseLayout>
  );
}

export default OrderConfirmation;
