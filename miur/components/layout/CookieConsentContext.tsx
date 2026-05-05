"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  buildConsentPayload,
  COOKIE_CONSENT_STATUS_STORAGE_KEY,
  COOKIE_CONSENT_STORAGE_KEY,
  getConsentStatusFromPayload,
  parseStoredCookieConsent,
  type CookieConsentPayload,
  type CookieConsentStatus,
} from "@/lib/cookie-consent";

type CookieConsentContextValue = {
  consent: CookieConsentPayload | null;
  status: CookieConsentStatus | null;
  saveConsent: (options: { analytics: boolean; marketing: boolean }) => void;
  acceptAll: () => void;
  rejectAll: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<CookieConsentPayload | null>(null);
  const [status, setStatus] = useState<CookieConsentStatus | null>(null);

  useEffect(() => {
    const stored = parseStoredCookieConsent(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
    if (!stored) return;
    const nextStatus = getConsentStatusFromPayload(stored);
    setConsent(stored);
    setStatus(nextStatus);
    localStorage.setItem(COOKIE_CONSENT_STATUS_STORAGE_KEY, nextStatus);
  }, []);

  const saveConsent = (options: { analytics: boolean; marketing: boolean }) => {
    const payload = buildConsentPayload(options);
    const nextStatus = getConsentStatusFromPayload(payload);

    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem(COOKIE_CONSENT_STATUS_STORAGE_KEY, nextStatus);
    setConsent(payload);
    setStatus(nextStatus);
  };

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      consent,
      status,
      saveConsent,
      acceptAll: () => saveConsent({ analytics: true, marketing: true }),
      rejectAll: () => saveConsent({ analytics: false, marketing: false }),
    }),
    [consent, status],
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return context;
}
