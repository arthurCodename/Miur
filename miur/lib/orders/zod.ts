import { z } from "zod";

/**
 * Server-side validation for the /api/orders POST payload.
 *
 * Kept as a separate schema from the client-side `checkoutSchema` in
 * app/(auth)/checkout/page.tsx so the two can evolve independently — the
 * client one drives form UX (per-field messages, superRefine branching), while
 * this one is the authoritative shape the server trusts to persist.
 *
 * Note: `items` is intentionally lean — id + quantity only. The server looks
 * up authoritative name/price from the products table; we never trust the
 * client's price to prevent tampering.
 */

const PL_PHONE_REGEX = /^(?:\+?48|0048)?\s?-?\d{3}\s?-?\d{3}\s?-?\d{3}$/;

const paczkomatShippingSchema = z.object({
  method: z.literal("paczkomat"),
  paczkomatCode: z.string().min(3, "Wybierz Paczkomat"),
  paczkomatAddress: z.string().min(3, "Wybierz Paczkomat"),
});

const courierShippingSchema = z.object({
  method: z.literal("courier"),
  addressLine: z.string().min(5, "Podaj ulicę i numer"),
  city: z.string().min(2, "Podaj miasto"),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, "Kod pocztowy w formacie 00-000"),
});

export const orderPayloadSchema = z.object({
  contact: z.object({
    fullName: z.string().min(2, "Imię i nazwisko"),
    email: z.string().email("Nieprawidłowy e-mail").transform((v) => v.toLowerCase().trim()),
    phone: z.string().regex(PL_PHONE_REGEX, "Nieprawidłowy telefon"),
  }),
  shipping: z.discriminatedUnion("method", [paczkomatShippingSchema, courierShippingSchema]),
  consents: z.object({
    acceptTerms: z.literal(true, { message: "Wymagana akceptacja regulaminu" }),
    acceptPrivacy: z.literal(true, { message: "Wymagana akceptacja polityki prywatności" }),
    marketingOptIn: z.boolean(),
  }),
});

export type OrderPayload = z.infer<typeof orderPayloadSchema>;
export type ShippingPayload = OrderPayload["shipping"];
export type ContactPayload = OrderPayload["contact"];
