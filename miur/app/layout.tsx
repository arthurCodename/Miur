import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Використовуємо прямі шляхи від кореня
import Navbar from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Toaster } from "../components/ui/sonner";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

const logoFont = localFont({
  src: "../public/fonts/wildloops-bold_w.ttf",
  variable: "--font-logo",
});

export const metadata: Metadata = {
  title: "Miur Wellness Store",
  description: "Twój sklep z produktami dla zdrowia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={logoFont.variable}>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased bg-white`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}