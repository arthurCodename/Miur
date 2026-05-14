"use client";

import { cn } from "@/lib/utils";
import { OpenCookiePreferencesButton } from "@/components/layout/OpenCookiePreferencesButton";

type CookieSettingsLinkProps = {
  className?: string;
};

export function CookieSettingsLink({ className }: CookieSettingsLinkProps) {
  return (
    <OpenCookiePreferencesButton
      className={cn(
        "text-sm font-medium text-zinc-900 underline underline-offset-2 hover:opacity-70",
        className,
      )}
    >
      Zmień preferencje plików cookies
    </OpenCookiePreferencesButton>
  );
}
