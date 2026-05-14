import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { PageGradientHero } from "@/components/layout/PageGradientHero";

type StubPageProps = {
  /** Stub headline (Polish) */
  title: string;
  /** Optional supporting copy under the headline */
  description?: string;
  /** Section badge (e.g. "Informacja", "Konto") */
  eyebrow?: string;
  /** Override default CTA target */
  ctaHref?: string;
  /** Override default CTA label */
  ctaLabel?: string;
};

/**
 * Reusable placeholder page for routes that exist in navigation
 * but are not yet wired to real data / functionality.
 *
 * Visual language matches the rest of the storefront (zinc/black, uppercase eyebrows,
 * consistent vertical rhythm). Pages that render this should also set
 * `metadata.robots = { index: false, follow: true }` so they do not pollute Google.
 */
export function StubPage({
  title,
  description = "Pracujemy nad tą sekcją. Zostaw nam swój e-mail w stopce — damy znać, gdy będzie gotowa.",
  eyebrow = "Wkrótce",
  ctaHref = "/",
  ctaLabel = "Wróć do sklepu",
}: StubPageProps) {
  return (
    <main className="bg-white">
      <PageGradientHero title={title} eyebrow={eyebrow} />
      <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center md:py-24">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700">
          <Sparkles className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </div>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-600 md:text-base">{description}</p>
        <Link
          href={ctaHref}
          className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-900 px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {ctaLabel}
        </Link>
      </div>
    </main>
  );
}
