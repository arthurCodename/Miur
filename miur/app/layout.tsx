// Miur/miur/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { AccessibilityWidget } from "../components/AccessibilityWidget";
import CookieBanner from "../components/layout/CookieBanner";
import { CookieConsentProvider } from "../components/layout/CookieConsentContext";
import { ConsentScripts } from "../components/layout/ConsentScripts";
import { AgeGate } from "../components/layout/AgeGate";
import { Toaster } from "../components/ui/sonner";
import { ThemeProvider } from "../components/theme-provider";
import { OrganizationJsonLd } from "../components/seo/JsonLd";
import { getSiteUrl } from "@/lib/site-url";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { CartSync } from "@/components/cart/CartSync";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = getSiteUrl();
const siteTitle = "Miur Wellness Store";
const siteDescription = "Twój sklep z produktami dla zdrowia";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: siteTitle,
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  other: {
    rating: "adult",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const visualOnlyMode = process.env.NEXT_PUBLIC_VISUAL_ONLY === "1";

  // CSP nonce is set per-request in middleware.ts; falls back to "" when middleware
  // didn't run (static prerender / non-matching path) so React stays happy.
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <html
      lang="pl"
      className={`max-w-full overflow-x-clip ${inter.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} min-h-screen min-w-0 max-w-full overflow-x-clip flex flex-col bg-white ${visualOnlyMode ? "visual-only" : ""}`}
      >
        <OrganizationJsonLd
          name={siteTitle}
          url={siteUrl}
          logo={`${siteUrl}/brand/miur-wordmark.svg`}
          nonce={nonce}
        />
        <SessionProvider>
          <CartSync />
          <CookieConsentProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {!visualOnlyMode && <ConsentScripts nonce={nonce} />}
              <div className="flex min-h-screen min-w-0 w-full max-w-full flex-col overflow-x-clip">
                <a
                  href="#main-content"
                  className="sr-only left-4 top-4 z-500 rounded-sm bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-lg outline-none ring-2 ring-zinc-900 transition-none focus:not-sr-only focus:absolute focus:inline-block"
                >
                  Przejdź do treści głównej
                </a>
                <div
                  id="a11y-site-content"
                  className="flex min-h-0 min-w-0 flex-1 flex-col w-full max-w-full overflow-x-clip"
                >
                  <Navbar />
                  {!visualOnlyMode && <CookieBanner />}
                  {!visualOnlyMode && <AgeGate />}
                  <main
                    id="main-content"
                    tabIndex={-1}
                    className="flex-1 outline-none"
                  >
                    <div className="min-w-0 w-full max-w-full overflow-x-clip">
                      {children}
                    </div>
                  </main>
                  <Footer />
                  {!visualOnlyMode && (
                    <Toaster richColors position="top-center" />
                  )}
                </div>
                {!visualOnlyMode && <AccessibilityWidget />}
              </div>
            </ThemeProvider>
          </CookieConsentProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
