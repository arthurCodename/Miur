import { NextResponse, type NextRequest } from "next/server";

/**
 * Per-request CSP nonce + strict-dynamic policy.
 *
 * Why a proxy (instead of next.config `headers()`):
 *   - We need a fresh, cryptographically-random nonce per request so we can
 *     drop `'unsafe-inline'` from script-src in production.
 *   - Pages read this nonce from the `x-nonce` request header and pass it to
 *     every `<Script>` they render.
 *
 * Note: this file was previously named `middleware.ts`. In Next.js 16 the
 * `middleware` file convention was deprecated and renamed to `proxy`.
 * See: https://nextjs.org/docs/messages/middleware-to-proxy
 *
 * Cookie/tracker policy:
 *   - GA / GTM / Meta Pixel scripts are loaded ONLY after the user grants
 *     consent (handled in <ConsentScripts/>). The CSP merely allows them to
 *     be loaded if/when consent is granted.
 *   - Google Consent Mode v2 default-denied is set unconditionally (small
 *     inline blob) so analytics endpoints see "denied" until the user opts in.
 *
 * If you add a new third-party domain (Hotjar, Sentry, Resend, Stripe, etc.),
 * also add it to the relevant directive(s) below.
 */

const isProd = process.env.NODE_ENV === "production";

/** Domains we deliberately allow to load scripts from. */
const SCRIPT_HOSTS = [
  "https://www.googletagmanager.com",
  "https://*.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://geowidget.easypack24.net",
];

/** Domains we deliberately allow to issue connections from the page. */
const CONNECT_HOSTS = [
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://*.googletagmanager.com",
  "https://geowidget.easypack24.net",
  "https://api-shipx-pl.easypack24.net",
  "https://vitals.vercel-insights.com",
  "https://vercel.live",
];

/** Image origins (GA pixel, InPost, our CDN). */
const IMG_HOSTS = [
  "https://images.unsplash.com",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://geowidget.easypack24.net",
];

/** External stylesheets we load via <link>. */
const STYLE_HOSTS = ["https://geowidget.easypack24.net", "https://fonts.googleapis.com"];

/** Frames we embed (InPost paczkomaty modal, GTM preview). */
const FRAME_HOSTS = ["https://geowidget.easypack24.net", "https://*.googletagmanager.com"];

function buildCsp(nonce: string): string {
  // In dev, Next.js needs eval() for HMR/Turbopack — keep `'unsafe-eval'` only there.
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    isProd ? "" : "'unsafe-eval'",
    ...SCRIPT_HOSTS,
  ]
    .filter(Boolean)
    .join(" ");

  // Tailwind v4 + framer-motion still emit inline <style> blocks at runtime.
  // Switching to nonce-only for style would require re-architecting motion.
  // Industry practice (incl. nextjs.org) keeps `'unsafe-inline'` for styles.
  const styleSrc = ["'self'", "'unsafe-inline'", ...STYLE_HOSTS].join(" ");

  const directives: Record<string, string> = {
    "default-src": "'self'",
    "script-src": scriptSrc,
    "style-src": styleSrc,
    "img-src": ["'self'", "blob:", "data:", ...IMG_HOSTS].join(" "),
    "font-src": "'self' data: https://fonts.gstatic.com",
    "connect-src": ["'self'", ...CONNECT_HOSTS].join(" "),
    "frame-src": FRAME_HOSTS.join(" "),
    "frame-ancestors": "'none'",
    "form-action": "'self'",
    "base-uri": "'self'",
    "object-src": "'none'",
    "manifest-src": "'self'",
    "media-src": "'self'",
    "worker-src": "'self' blob:",
    "upgrade-insecure-requests": "",
  };

  return Object.entries(directives)
    .map(([k, v]) => (v ? `${k} ${v}` : k))
    .join("; ");
}

export function proxy(request: NextRequest) {
  // Use Web Crypto (Edge-compatible). 16 bytes is plenty.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const nonce = btoa(String.fromCharCode(...bytes));

  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  // Some Next.js internals also read CSP off the request headers.
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("content-security-policy", csp);

  return response;
}

/**
 * Skip CSP for static assets, image optimisation API, favicons and Next data
 * to avoid sending headers on every chunk download (saves edge invocations).
 * Also skip prefetch requests so we don't burn nonce on background loads.
 */
export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
