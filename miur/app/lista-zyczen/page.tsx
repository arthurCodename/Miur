import type { Metadata } from "next";
import { StubPage } from "@/components/layout/StubPage";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Lista życzeń — Miur",
  description: "Twoja lista życzeń.",
  robots: { index: false, follow: false },
};

export default async function ListaZyczenPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/lista-zyczen");
  }

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
