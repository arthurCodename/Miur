import type { Metadata } from "next";
import { StubPage } from "@/components/layout/StubPage";

export const metadata: Metadata = {
  title: "Masturbatory — Miur",
  description: "Wybór masturbatorów w sklepie Miur.",
  robots: { index: false, follow: true },
};

export default function MasturbatoryPage() {
  return (
    <StubPage
      eyebrow="Kategoria"
      title="Masturbatory"
      description="Pełna kategoria masturbatorów (klasyczne, Fleshlight, wibrujące) pojawi się tu wkrótce."
      ctaHref="/dla-niego"
      ctaLabel="Przejdź do Dla Niego"
    />
  );
}
