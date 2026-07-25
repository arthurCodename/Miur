"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useCookieConsent } from "@/components/layout/CookieConsentContext";

type ConsentScriptsProps = {
  /** CSP nonce minted in middleware.ts. Required for inline <Script> blocks. */
  nonce: string;
};

/**
 * Loads analytics & marketing tags only AFTER explicit user consent.
 *
 * Compliance design:
 *  - On every page we set Google Consent Mode v2 defaults to DENIED
 *    (synchronously, before GTM ever loads). This satisfies the EU "default
 *    deny" requirement and ensures GA4 / Ads tags know to drop pings until
 *    consent is granted.
 *  - We only inject the actual GTM container when the user has accepted at
 *    least one non-essential category (analytics OR marketing).
 *  - Whenever the consent state changes, we push a `consent update` to the
 *    dataLayer so GTM-side tags re-evaluate without a page reload.
 *
 * GTM container ID is read from NEXT_PUBLIC_GTM_ID. If the env var is not set,
 * we never load GTM at all — useful for local dev / preview deploys.
 */
export function ConsentScripts({ nonce }: ConsentScriptsProps) {
  const { consent } = useCookieConsent();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  // Push fresh consent state to the dataLayer whenever the user changes their preferences.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!consent) return;

    type DataLayerCommand = ["consent", "update", Record<string, "granted" | "denied">];
    const w = window as typeof window & { dataLayer?: DataLayerCommand[] };
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push([
      "consent",
      "update",
      {
        ad_storage: consent.marketing ? "granted" : "denied",
        ad_user_data: consent.marketing ? "granted" : "denied",
        ad_personalization: consent.marketing ? "granted" : "denied",
        analytics_storage: consent.analytics ? "granted" : "denied",
        functionality_storage: "granted",
        personalization_storage: consent.analytics ? "granted" : "denied",
        security_storage: "granted",
      },
    ]);
  }, [consent]);

  const shouldLoadGtm = Boolean(gtmId) && Boolean(consent && (consent.analytics || consent.marketing));

  return (
    <>
      {/*
        Consent Mode v2 defaults — denies everything until the user opts in.
        We render a NATIVE <script> (not next/script) for two reasons:
          1. It must run synchronously, before any analytics, on every page.
          2. Avoids the eslint warning about `beforeInteractive` outside _document.
        It's safe to inline because the content is fixed and CSP-nonce-protected.
      */}
      <script
        id="gtag-consent-default"
        nonce={nonce}
        // React 19 strips the nonce attribute after hydration (CSS-selector
        // leak prevention). Same reason as OrganizationJsonLd.
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              personalization_storage: 'denied',
              security_storage: 'granted',
              wait_for_update: 500
            });
          `,
        }}
      />

      {/* GTM container — only loaded once user consents. */}
      {shouldLoadGtm ? (
        <>
          <Script
            id="gtm-loader"
            strategy="afterInteractive"
            nonce={nonce}
            src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
          />
          <Script id="gtm-init" strategy="afterInteractive" nonce={nonce}>
            {`
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
              });
            `}
          </Script>
        </>
      ) : null}
    </>
  );
}
