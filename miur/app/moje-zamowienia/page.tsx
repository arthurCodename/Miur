import type { Metadata } from "next";
import { StubPage } from "@/components/layout/StubPage";

export const metadata: Metadata = {
  title: "Moje zamówienia — Miur",
  description: "Historia Twoich zamówień w Miur.",
  robots: { index: false, follow: false },
};

export default function MojeZamowieniaPage() {
  return (
    <StubPage
      eyebrow="Twoje konto"
      title="Twoje zamówienia"
      description="Po pełnym wdrożeniu konta klienta zobaczysz tu historię zamówień, status wysyłki i faktury."
      ctaHref="/profile"
      ctaLabel="Wróć do profilu"
    />
  );
}
