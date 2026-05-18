"use client";

import { OPEN_COOKIE_PREFERENCES_EVENT } from "@/lib/cookie-consent";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function OpenCookiePreferencesButton({ className, children }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_COOKIE_PREFERENCES_EVENT))}
    >
      {children}
    </button>
  );
}
