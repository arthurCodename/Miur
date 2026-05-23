"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
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

const CONSENT_CHANGED_EVENT = "miur:cookie-consent-changed";

/**
 * Read & subscribe to the consent payload via useSyncExternalStore so we never
 * call setState inside useEffect (React 19 lint rule).
 *
 * Subscribes to:
 *  - cross-tab changes (native `storage` event)
 *  - same-tab changes (custom `miur:cookie-consent-changed` event we dispatch
 *    ourselves in `saveConsent`)
 */
function subscribeToConsent(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === COOKIE_CONSENT_STORAGE_KEY) callback();
  };
  const onCustom = () => callback();
  window.addEventListener("storage", onStorage);
  window.addEventListener(CONSENT_CHANGED_EVENT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CONSENT_CHANGED_EVENT, onCustom);
  };
}

/**
 * React requires `getSnapshot` for useSyncExternalStore to return a **stable**
 * reference when the underlying store value has not changed (Object.is).
 * `JSON.parse` always yields a new object, so without caching we trigger an
 * infinite re-render loop as soon as consent exists in localStorage.
 */
let cachedConsentRaw: string | null | undefined;
let cachedConsentPayload: CookieConsentPayload | null | undefined;

function getConsentSnapshot(): CookieConsentPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (raw === cachedConsentRaw && cachedConsentPayload !== undefined) {
      return cachedConsentPayload;
    }
    cachedConsentRaw = raw;
    cachedConsentPayload = parseStoredCookieConsent(raw);
    return cachedConsentPayload;
  } catch {
    return null;
  }
}

function getServerConsentSnapshot(): CookieConsentPayload | null {
  return null;
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getServerConsentSnapshot);
  const status = consent ? getConsentStatusFromPayload(consent) : null;

  const saveConsent = useCallback((options: { analytics: boolean; marketing: boolean }) => {
    const payload = buildConsentPayload(options);
    const nextStatus = getConsentStatusFromPayload(payload);

    try {
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem(COOKIE_CONSENT_STATUS_STORAGE_KEY, nextStatus);
    } catch {
      // Safari private mode etc. — proceed with in-memory state only.
    }

    // Notify same-tab subscribers (storage event only fires cross-tab).
    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      consent,
      status,
      saveConsent,
      acceptAll: () => saveConsent({ analytics: true, marketing: true }),
      rejectAll: () => saveConsent({ analytics: false, marketing: false }),
    }),
    [consent, status, saveConsent],
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
