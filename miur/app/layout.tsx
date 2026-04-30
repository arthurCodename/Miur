// Miur/miur/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import Navbar from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { AccessibilityWidget } from "../components/AccessibilityWidget";
import CookieBanner from "../components/layout/CookieBanner"; // <-- Додали імпорт банера
import { Toaster } from "../components/ui/sonner";
import { ThemeProvider } from "../components/theme-provider";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

const logoFont = localFont({
  src: "../public/fonts/wildloops-bold_w.ttf",
  variable: "--font-logo",
});

export const metadata: Metadata = {
  title: "Miur Wellness Store",
  description: "Twój sklep z produktami dla zdrowia",
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
          <Navbar />
          <AccessibilityWidget />
          <CookieBanner /> {/* <-- Додали компонент на сторінку */}
          
          <main className="flex-1">
            {children}
          </main>
          
          <Footer />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}