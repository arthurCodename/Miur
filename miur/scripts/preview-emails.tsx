/**
 * Render the transactional email templates to HTML files you can open in a
 * browser. Email clients are unforgiving, so eyeball the output before
 * changing a template.
 *
 *   npx tsx scripts/preview-emails.tsx
 *
 * Writes to .email-preview/ (gitignored).
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { mkdirSync, writeFileSync } from "node:fs";
import { render } from "@react-email/render";

import { OrderConfirmation } from "@/lib/email/templates/OrderConfirmation";
import { ShippingNotification } from "@/lib/email/templates/ShippingNotification";

const OUT_DIR = ".email-preview";

async function main() {
  const confirmation = await render(
    OrderConfirmation({
      orderId: 1042,
      customerName: "Jan Kowalski",
      lines: [
        { name: "Aura Silk", quantity: 2, unitPrice: 349 },
        { name: "Luna Essence", quantity: 1, unitPrice: 129 },
      ],
      subtotal: 827,
      shippingCost: 0,
      total: 827,
      deliveryLabel: "Paczkomat InPost",
      deliveryDetails: "WAW251M, Zwierzyniecka 16-18",
      orderUrl: "https://miur.pl/checkout/success?orderId=1042",
      withdrawalFormUrl: "https://miur.pl/zwroty-reklamacje",
      termsUrl: "https://miur.pl/regulamin",
    }),
  );

  const shipping = await render(
    ShippingNotification({
      orderId: 1042,
      customerName: "Jan Kowalski",
      deliveryLabel: "Paczkomat InPost",
      deliveryDetails: "WAW251M, Zwierzyniecka 16-18",
      trackingNumber: "6200000012345678",
      trackingUrl:
        "https://inpost.pl/sledzenie-przesylek?number=6200000012345678",
      orderUrl: "https://miur.pl/checkout/success?orderId=1042",
    }),
  );

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(`${OUT_DIR}/order-confirmation.html`, confirmation);
  writeFileSync(`${OUT_DIR}/shipping-notification.html`, shipping);

  console.log(
    JSON.stringify(
      {
        hasOrderId: confirmation.includes("#1042"),
        lineTotalCorrect: confirmation.includes("698,00 zł"), // 2 × 349
        grandTotalCorrect: confirmation.includes("827,00 zł"),
        freeShipping: confirmation.includes("Darmowa"),
        vatNote: confirmation.includes("VAT"),
        withdrawal14Days: confirmation.includes("14 dni"),
        sellerNip: confirmation.includes("NIP"),
        brandIsSalgo: confirmation.includes("Salgo"),
        // Discretion check on body copy only. URLs and the seller's legal
        // contact details are excluded — seller identification is legally
        // required in the footer and can legitimately be a miur.pl address.
        leaksBrandInBodyCopy: /Miur/i.test(
          confirmation
            .replace(/https?:\/\/[^"'\s]*/g, "")
            .replace(/[\w.+-]+@[\w.-]+/g, "")
            .replace(/<\/?a\b[^>]*>/g, ""),
        ),
        shippingHasTracking: shipping.includes("6200000012345678"),
        shippingDiscreet: shipping.includes("dyskretnym opakowaniu"),
        writtenTo: OUT_DIR,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error("Email preview failed:", err);
  process.exit(1);
});
