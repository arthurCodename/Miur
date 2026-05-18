import type { Metadata } from "next";
import { StubPage } from "@/components/layout/StubPage";

export const metadata: Metadata = {
  title: "O nas — Miur",
  description: "Poznaj historię i wartości marki Miur.",
  robots: { index: false, follow: true },
};

export default function ONasPage() {
  return (
    <StubPage
      eyebrow="O Miur"
      title="Poznaj naszą historię"
      description="Pracujemy nad pełną wersją tej strony. Wkrótce opowiemy Ci o naszej misji, wartościach i sposobie wybierania produktów."
    />
  );
}
