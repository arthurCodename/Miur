"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import { useAuthStore } from "@/lib/store/useAuthStore";

/**
 * Subscribe to Zustand persist hydration via `useSyncExternalStore`.
 *
 * Why not `useEffect(setHydrated)`?
 *   - React 19 lints synchronous setState inside useEffect
 *     (rule: react-hooks/set-state-in-effect).
 *   - useSyncExternalStore is the canonical way to mirror an external
 *     async state into React (here: localStorage hydration).
 */
function useAuthHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => useAuthStore.persist.onFinishHydration(cb),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isMounted = useIsMounted();
  const authHydrated = useAuthHydrated();

  useEffect(() => {
    if (!isMounted || !authHydrated) return;
    if (!user) {
      router.replace("/login");
    }
  }, [isMounted, authHydrated, user, router]);

  const readyToShow = isMounted && authHydrated && user;

  if (!readyToShow) {
    return (
      <main className="min-h-[50vh] bg-white">
        <PageGradientHero title="Moje konto" eyebrow="Profil" />
        <div className="px-6 py-16">
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="h-10 w-56 max-w-full animate-pulse rounded-md bg-zinc-200" />
            <div className="h-40 animate-pulse rounded-xl bg-zinc-100" />
            <div className="h-11 w-48 animate-pulse rounded-full bg-zinc-200" />
          </div>
        </div>
      </main>
    );
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <main className="bg-white">
      <PageGradientHero title="Moje konto" eyebrow="Profil" />
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
        Witaj, {user.email}!
      </h2>
      <p className="mt-2 text-sm text-zinc-600">
        Zalogowano jako <span className="font-medium text-zinc-800">{user.name}</span>
      </p>

      <section className="mt-12 rounded-xl border border-zinc-200 bg-zinc-50/80 p-6 md:p-8">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900">Moje zamówienia</h3>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600">
          Nie masz jeszcze żadnych zamówień. Gdy złożysz pierwsze zamówienie, pojawi się tutaj.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-900 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Wyloguj się
        </button>
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
