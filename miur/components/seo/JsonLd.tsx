type OrganizationJsonLdProps = {
  name: string;
  url: string;
  logo: string;
  /** CSP nonce — required when strict-dynamic CSP is enabled in middleware. */
  nonce?: string;
};

export type ProductAvailability =
  | "https://schema.org/InStock"
  | "https://schema.org/OutOfStock"
  | "https://schema.org/PreOrder"
  | "https://schema.org/LimitedAvailability";

export interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string | string[];
  price: number | string;
  currency?: "PLN";
  availability: ProductAvailability;
  url?: string;
  /** CSP nonce — required when strict-dynamic CSP is enabled in middleware. */
  nonce?: string;
}

export function OrganizationJsonLd({ name, url, logo, nonce }: OrganizationJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Store",
    name,
    url,
    logo,
  };

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      // React 19 strips the nonce attribute from the DOM after hydration to
      // prevent CSS attribute-selector nonce leakage. That mismatch triggers
      // a hydration warning we don't want spamming the console. This is the
      // React-sanctioned escape hatch for intentionally-different attributes.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency = "PLN",
  availability,
  url,
  nonce,
}: ProductJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    ...(url ? { url } : {}),
    offers: {
      "@type": "Offer",
      price: String(price),
      priceCurrency: currency,
      availability,
      ...(url ? { url } : {}),
    },
  };

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      // See OrganizationJsonLd — same nonce-strip hydration issue.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
