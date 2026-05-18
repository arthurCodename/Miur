import type { Metadata } from "next";
import { StubPage } from "@/components/layout/StubPage";

export const metadata: Metadata = {
  title: "Dostawa i płatność — Miur",
  description: "Sposoby dostawy i metody płatności w Miur.",
  robots: { index: false, follow: true },
};

export default function DostawaPlatnoscPage() {
  return (
    <StubPage
      eyebrow="Obsługa klienta"
      title="Dostawa i płatność"
      description="Strona w przygotowaniu. Dostarczamy kurierem, do paczkomatu InPost oraz oferujemy szybkie płatności BLIK / Przelewy24."
    />
  );
}
