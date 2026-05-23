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
      onClick={(event) => {
        // Defensive guard: if this button is ever nested in a clickable wrapper,
        // we still want only the cookie-preferences event, never navigation.
        event.preventDefault();
        event.stopPropagation();
        window.dispatchEvent(new CustomEvent(OPEN_COOKIE_PREFERENCES_EVENT));
      }}
    >
      {children}
    </button>
  );
}
