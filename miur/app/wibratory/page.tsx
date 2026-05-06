import type { Metadata } from "next";
import { StubPage } from "@/components/layout/StubPage";

export const metadata: Metadata = {
  title: "Wibratory — Miur",
  description: "Wybór wibratorów w sklepie Miur.",
  robots: { index: false, follow: true },
};

export default function WibratoryPage() {
  return (
    <StubPage
      eyebrow="Kategoria"
      title="Wibratory"
      description="Pełna kategoria wibratorów (klasyczne, do łechtaczki, soniczne, do punktu G, jajeczka, króliczki) pojawi się tu wkrótce."
      ctaHref="/dla-niej"
      ctaLabel="Przejdź do Dla Niej"
    />
  );
}
