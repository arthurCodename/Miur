// Miur/miur/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import Navbar from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { AccessibilityWidget } from "../components/AccessibilityWidget";
import CookieBanner from "../components/layout/CookieBanner";
import { AgeGate } from "../components/layout/AgeGate";
import { Toaster } from "../components/ui/sonner";
import { ThemeProvider } from "../components/theme-provider";
import { getSiteUrl } from "@/lib/site-url";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

const logoFont = localFont({
  src: "../public/fonts/wildloops-bold_w.ttf",
  variable: "--font-logo",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Miur Wellness Store",
  description: "Twój sklep z produktami dla zdrowia",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={logoFont.variable} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased bg-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <a
              href="#main-content"
              className="sr-only left-4 top-4 z-[500] rounded-sm bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-lg outline-none ring-2 ring-zinc-900 transition-none focus:not-sr-only focus:absolute focus:inline-block"
            >
              Przejdź do treści głównej
            </a>
            <Navbar />
            <AccessibilityWidget />
            <CookieBanner />
            <AgeGate />
            <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer />
            <Toaster richColors position="top-center" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}