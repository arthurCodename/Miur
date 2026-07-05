import Link from "next/link";
import { redirect } from "next/navigation";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { auth } from "@/auth";
import { ProfileLogoutButton } from "@/components/auth/ProfileLogoutButton";

function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0]?.trim();
  if (!local) return "Użytkownik";
  const withSpaces = local.replace(/[._-]+/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const { email } = session.user;
  const displayName = session.user.name ?? displayNameFromEmail(email);

  return (
    <main className="bg-white">
      <PageGradientHero title="Moje konto" eyebrow="Profil" />
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
          Witaj, {email}!
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Zalogowano jako{" "}
          <span className="font-medium text-zinc-800">{displayName}</span>
        </p>

        <section className="mt-12 rounded-xl border border-zinc-200 bg-zinc-50/80 p-6 md:p-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900">
            Moje zamówienia
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            Nie masz jeszcze żadnych zamówień. Gdy złożysz pierwsze zamówienie,
            pojawi się tutaj.
          </p>
        </section>

        <div className="mt-10 flex flex-wrap gap-4">
          <ProfileLogoutButton />
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-zinc-900 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            Wróć do sklepu
          </Link>
        </div>
      </div>
    </main>
  );
}
