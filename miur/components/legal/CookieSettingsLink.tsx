"use client";

import { OpenCookiePreferencesButton } from "@/components/layout/OpenCookiePreferencesButton";

export function CookieSettingsLink() {
  return (
    <OpenCookiePreferencesButton className="text-sm font-medium text-zinc-900 underline underline-offset-2 hover:opacity-70">
      Zmień preferencje plików cookies
    </OpenCookiePreferencesButton>
  );
}
