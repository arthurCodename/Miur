"use client";

import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

/** Wylogowanie w stopce — widoczne tylko dla zalogowanego klienta. */
export function FooterLogoutButton() {
  const { data: session, status } = useSession();

  if (status !== "authenticated" || !session) {
    return null;
  }

  const handleClick = async () => {
    await signOut({ redirect: false });
    toast.success("Wylogowano pomyślnie");
    // SessionProvider auto-refreshes; the page will reflect logged-out state.
    // If you'd rather force-navigate, replace the line above with:
    //   await signOut({ callbackUrl: "/" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-left text-xs text-zinc-500 transition-colors hover:text-black"
    >
      Wyloguj się
    </button>
  );
}
