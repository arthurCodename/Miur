import type { Metadata } from "next";
import { StubPage } from "@/components/layout/StubPage";

export const metadata: Metadata = {
  title: "Dyskretna paczka — Miur",
  description: "Pakujemy zamówienia dyskretnie i bez logo Miur.",
  robots: { index: false, follow: true },
};

export default function DyskretnaPaczkaPage() {
  return (
    <StubPage
      eyebrow="Obsługa klienta"
      title="Dyskretna paczka"
      description="Każde zamówienie pakujemy w neutralny karton bez logo Miur — nadawca w liście przewozowym to Salgo. Pełny opis procesu wkrótce."
    />
  );
}
