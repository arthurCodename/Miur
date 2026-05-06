"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function AuthNavLink() {
  const user = useAuthStore((s) => s.user);
  const isMounted = useIsMounted();

  const href = !isMounted ? "/login" : user ? "/profile" : "/login";
  const label = !isMounted ? "Logowanie" : user ? "Profil" : "Logowanie";

  return (
    <Link
      href={href}
      className="group flex items-center rounded-full border border-white/10 p-2 text-white transition-colors hover:border-white/40"
      aria-label={label}
    >
      <User className="h-5 w-5" strokeWidth={1.2} aria-hidden />
    </Link>
  );
}
