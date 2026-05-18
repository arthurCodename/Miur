"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import { useAuthStore } from "@/lib/store/useAuthStore";

/**
 * Footer "Wyloguj" entry. Stays a button (with the Footer's link styling)
 * so it visually matches its siblings, but only does something when a user is signed in.
 *
 * `useIsMounted()` keeps SSR markup deterministic (always shows "Logowanie") and
 * upgrades to "Wyloguj" once Zustand's persisted state has hydrated.
 */
export function FooterLogoutButton() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const isMounted = useIsMounted();

  const handleClick = () => {
    if (!isMounted) return;
    if (!user) {
      router.push("/login");
      return;
    }
    logout();
    toast.success("Wylogowano pomyślnie");
    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-left text-xs text-zinc-500 transition-colors hover:text-black"
    >
      {isMounted && user ? "Wyloguj" : "Logowanie"}
    </button>
  );
}
