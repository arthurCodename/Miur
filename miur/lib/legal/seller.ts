/**
 * Dane sprzedawcy (UŚUDE art. 5, RODO art. 13).
 * Uzupełnij zmienne NEXT_PUBLIC_SELLER_* w środowisku produkcyjnym przed uruchomieniem sklepu.
 */
export const ODR_URL = "https://ec.europa.eu/consumers/odr/" as const;

export type SellerLegal = {
  legalName: string;
  addressLine1: string;
  addressLine2: string;
  nip: string;
  regon: string;
  krs: string | null;
  email: string;
  phone: string;
};

function env(name: string, fallback: string): string {
  const v = process.env[name];
  return v && v.trim() !== "" ? v : fallback;
}

export const sellerLegal: SellerLegal = {
  legalName: env("NEXT_PUBLIC_SELLER_LEGAL_NAME", ""),
  addressLine1: env("NEXT_PUBLIC_SELLER_ADDRESS_LINE1", ""),
  addressLine2: env("NEXT_PUBLIC_SELLER_ADDRESS_LINE2", ""),
  nip: env("NEXT_PUBLIC_SELLER_NIP", ""),
  regon: env("NEXT_PUBLIC_SELLER_REGON", ""),
  krs: process.env.NEXT_PUBLIC_SELLER_KRS?.trim() || null,
  email: env("NEXT_PUBLIC_SELLER_EMAIL", "pomoc@miur.pl"),
  phone: env("NEXT_PUBLIC_SELLER_PHONE", ""),
};

export function sellerLegalComplete(): boolean {
  return Boolean(
    sellerLegal.legalName &&
      sellerLegal.addressLine1 &&
      sellerLegal.nip &&
      sellerLegal.regon,
  );
}

export function sellerAddressBlock(): string {
  const parts = [sellerLegal.addressLine1, sellerLegal.addressLine2].filter(Boolean);
  return parts.join(", ");
}
