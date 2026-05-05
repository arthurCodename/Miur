"use client";

import Script from "next/script";
import { useCookieConsent } from "@/components/layout/CookieConsentContext";

export function ConsentScripts() {
  const { status } = useCookieConsent();

  if (status !== "granted") {
    return null;
  }

  return (
    <>
      <Script
        id="ga-loader"
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </Script>
    </>
  );
}
