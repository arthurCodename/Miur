import type { Metadata } from "next";
import { StubPage } from "@/components/layout/StubPage";

export const metadata: Metadata = {
  title: "Program partnerski — Miur",
  description: "Dołącz do programu partnerskiego Miur.",
  robots: { index: false, follow: true },
};

export default function ProgramPartnerskiPage() {
  return (
    <StubPage
      eyebrow="Współpraca"
      title="Program partnerski"
      description="Otwieramy się na współpracę z twórcami i partnerami biznesowymi. Szczegóły, prowizje i regulamin pojawią się tutaj wkrótce."
    />
  );
}
