import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

/**
 * Shared shell for every transactional email.
 *
 * Branding note: the sender identity is "Salgo", not "Miur" — outbound mail
 * must stay discreet (see CLAUDE.md). Nothing in the subject, body, or footer
 * should reveal the product category, because these land in shared inboxes.
 */
export const SENDER_BRAND = "Salgo";

type BaseLayoutProps = {
  /** Inbox preview line — keep it neutral for the same discretion reason. */
  preview: string;
  heading: string;
  children: ReactNode;
};

export function BaseLayout({ preview, heading, children }: BaseLayoutProps) {
  const sellerIdentity = [
    process.env.NEXT_PUBLIC_SELLER_LEGAL_NAME,
    process.env.NEXT_PUBLIC_SELLER_ADDRESS_LINE1,
  ]
    .filter(Boolean)
    .join(", ");

  const taxIdentity = [
    process.env.NEXT_PUBLIC_SELLER_NIP ? `NIP: ${process.env.NEXT_PUBLIC_SELLER_NIP}` : null,
    process.env.NEXT_PUBLIC_SELLER_REGON
      ? `REGON: ${process.env.NEXT_PUBLIC_SELLER_REGON}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Html lang="pl">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={brand}>{SENDER_BRAND}</Text>
          <Text style={headingStyle}>{heading}</Text>
          {children}
          <Hr style={hr} />
          <Section>
            {/*
              Seller identification is legally required on this mail. Each line
              is omitted rather than rendered with an empty value, so a missing
              env var can't ship a broken "NIP: · REGON:" line — production
              builds are guarded by validateProductionEnv() anyway, but local
              and preview environments run without the full set.
            */}
            {sellerIdentity ? <Text style={footer}>{sellerIdentity}</Text> : null}
            {taxIdentity ? <Text style={footer}>{taxIdentity}</Text> : null}
            {process.env.NEXT_PUBLIC_SELLER_EMAIL ? (
              <Text style={footer}>
                Kontakt: {process.env.NEXT_PUBLIC_SELLER_EMAIL}
              </Text>
            ) : null}
            <Text style={footerMuted}>
              Ta wiadomość dotyczy realizacji Twojego zamówienia i została
              wysłana na adres podany przy składaniu zamówienia.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ---- styles (inline objects — email clients ignore <style> blocks) ---- */

const body = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "24px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e4e4e7",
  borderRadius: "8px",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "32px",
};

const brand = {
  color: "#18181b",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.2em",
  margin: "0 0 24px",
  textTransform: "uppercase" as const,
};

const headingStyle = {
  color: "#18181b",
  fontSize: "22px",
  fontWeight: 700,
  lineHeight: "1.3",
  margin: "0 0 16px",
};

const hr = {
  borderColor: "#e4e4e7",
  margin: "32px 0 16px",
};

const footer = {
  color: "#71717a",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "0 0 4px",
};

const footerMuted = {
  color: "#a1a1aa",
  fontSize: "11px",
  lineHeight: "1.6",
  margin: "12px 0 0",
};

export const emailStyles = {
  text: {
    color: "#3f3f46",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "0 0 16px",
  },
  label: {
    color: "#71717a",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    margin: "24px 0 8px",
    textTransform: "uppercase" as const,
  },
  strong: {
    color: "#18181b",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "1.6",
    margin: "0 0 4px",
  },
  muted: {
    color: "#71717a",
    fontSize: "12px",
    lineHeight: "1.6",
    margin: "0 0 4px",
  },
  button: {
    backgroundColor: "#18181b",
    borderRadius: "999px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.2em",
    padding: "14px 32px",
    textDecoration: "none",
    textTransform: "uppercase" as const,
  },
};
