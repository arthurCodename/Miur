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
        // #region agent log
        fetch('http://127.0.0.1:7554/ingest/3239a698-9bf4-4fb8-9931-cbcf4f49426c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b22d81'},body:JSON.stringify({sessionId:'b22d81',runId:'initial',hypothesisId:'H3',location:'components/layout/OpenCookiePreferencesButton.tsx:16',message:'Open cookie preferences clicked',data:{pathname:typeof window !== 'undefined' ? window.location.pathname : 'unknown'},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        window.dispatchEvent(new CustomEvent(OPEN_COOKIE_PREFERENCES_EVENT));
      }}
    >
      {children}
    </button>
  );
}
