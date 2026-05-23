"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthHydrated } from "@/lib/hooks/useAuthHydrated";
import { useAuthStore } from "@/lib/store/useAuthStore";

/** Wylogowanie w stopce — widoczne tylko dla zalogowanego klienta. */
export function FooterLogoutButton() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const authHydrated = useAuthHydrated();

  if (!authHydrated || !user) {
    return null;
  }

  const handleClick = () => {
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
      Wyloguj się
    </button>
  );
}
