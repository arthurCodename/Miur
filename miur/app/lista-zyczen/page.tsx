import type { Metadata } from "next";
import { StubPage } from "@/components/layout/StubPage";

export const metadata: Metadata = {
  title: "Lista życzeń — Miur",
  description: "Twoja lista życzeń.",
  robots: { index: false, follow: false },
};

export default function ListaZyczenPage() {
  return (
    <StubPage
      eyebrow="Twoje konto"
      title="Lista życzeń"
      description="Zapisywanie ulubionych produktów na liście życzeń pojawi się tu po wdrożeniu konta klienta."
      ctaHref="/produkty"
      ctaLabel="Przejdź do katalogu"
    />
  );
}
