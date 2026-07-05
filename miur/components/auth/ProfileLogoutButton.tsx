"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

/**
 * Client-side logout for the profile page.
 *
 * Uses next-auth/react `signOut({ redirect: false })` — same pattern as the
 * footer button. Deliberately NOT a server action, because those cause a full
 * page reload, which remounts CartSync from scratch and misses the
 * "authenticated → unauthenticated" transition needed to instant-clear the
 * local cart. Client-side signOut keeps the React tree mounted; CartSync sees
 * the status flip and empties the cart immediately.
 */
export function ProfileLogoutButton() {
  const router = useRouter();

  const handleClick = async () => {
    await signOut({ redirect: false });
    toast.success("Wylogowano pomyślnie");
    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-900 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
    >
      Wyloguj się
    </button>
  );
}
