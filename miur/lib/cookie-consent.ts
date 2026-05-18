export const COOKIE_CONSENT_STORAGE_KEY = "miur_cookie_consent" as const;
export const COOKIE_CONSENT_STATUS_STORAGE_KEY = "cookie-consent" as const;
export const COOKIE_BANNER_VERSION = "1.0" as const;

export type CookieConsentPayload = {
  version: typeof COOKIE_BANNER_VERSION;
  timestamp: number;
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

/** Starszy format (bez version/timestamp) — traktujemy jako brak pełnej zgodności z audytem */
export type LegacyCookieConsent = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type CookieConsentStatus = "granted" | "denied";

export function isCookieConsentPayload(v: unknown): v is CookieConsentPayload {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    o.version === COOKIE_BANNER_VERSION &&
    typeof o.timestamp === "number" &&
    o.essential === true &&
    typeof o.analytics === "boolean" &&
    typeof o.marketing === "boolean"
  );
}

export function parseStoredCookieConsent(raw: string | null): CookieConsentPayload | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as unknown;
    if (isCookieConsentPayload(data)) return data;
    const legacy = data as LegacyCookieConsent;
    if (
      legacy &&
      typeof legacy === "object" &&
      typeof legacy.analytics === "boolean" &&
      typeof legacy.marketing === "boolean"
    ) {
      return {
        version: COOKIE_BANNER_VERSION,
        timestamp: Date.now(),
        essential: true,
        analytics: legacy.analytics,
        marketing: legacy.marketing,
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function buildConsentPayload(partial: {
  analytics: boolean;
  marketing: boolean;
}): CookieConsentPayload {
  return {
    version: COOKIE_BANNER_VERSION,
    timestamp: Date.now(),
    essential: true,
    analytics: partial.analytics,
    marketing: partial.marketing,
  };
}

export function getConsentStatusFromPayload(payload: CookieConsentPayload): CookieConsentStatus {
  return payload.analytics || payload.marketing ? "granted" : "denied";
}

export const OPEN_COOKIE_PREFERENCES_EVENT = "miur:open-cookie-preferences" as const;
