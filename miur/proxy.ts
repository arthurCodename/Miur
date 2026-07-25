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
  // The geowidget fetches its actual locker data from a separate endpoint
  // (api-pl-points), NOT api-shipx-pl. Without it the map loads but stays
  // greyed out with "Przybliż, aby wyświetlić punkty" and no pins ever appear.
  "https://api-pl-points.easypack24.net",
  // InPost geowidget uses OSM Nominatim for address search inside its map.
  // Without this, the search box in "Wybierz Paczkomat" returns no results.
  "https://nominatim.openstreetmap.org",
  "https://vitals.vercel-insights.com",
  "https://vercel.live",
];

/** Image origins (GA pixel, InPost, our CDN). */
const IMG_HOSTS = [
  "https://images.unsplash.com",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://geowidget.easypack24.net",
  // InPost proxies OSM tiles through their own domain (osm.inpost.pl) rather
  // than hitting openstreetmap.org directly. Without this, the map area shows
  // only pins on a blank background — no roads, buildings, or labels.
  "https://osm.inpost.pl",
  // Kept as fallback in case a future widget version reverts to direct OSM.
  "https://tile.openstreetmap.org",
  "https://*.tile.openstreetmap.org",
  // Any InPost sub-CDN — the widget serves pin icons, cluster sprites, and
  // partner logos from a few subdomains (map, cdn, images, etc.) that vary
  // by widget version. Wildcard scoped to their apex.
  "https://*.easypack24.net",
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
    // Hash of the InPost geowidget SDK's own inline bootstrap script. This is
    // the one script the SDK injects that we can't nonce (it comes from a
    // third-party bundle). Everything else it loads is trusted via
    // strict-dynamic once this bootstrap is trusted. If the InPost widget
    // updates and this hash changes, the console will show the new hash.
    "'sha256-rbbnijHn7DZ6ps39myQ3cVQF1H+U/PJfHh5ei/Q2kb8='",
    isProd ? "" : "'unsafe-eval'",
    ...SCRIPT_HOSTS,
  ]
    .filter(Boolean)
    .join(" ");

  // style-src uses 'unsafe-inline' rather than a nonce-source because the
  // InPost geowidget SDK injects inline <style> blocks at runtime that we
  // can't nonce (they come from a third-party script). Per CSP3 spec,
  // 'unsafe-inline' is ignored whenever a nonce-source is present in the
  // same directive — so it's one or the other for styles, not both.
  //
  // Trade-off: we lose the Safari-specific fix from May where WebKit would
  // block Next.js's auto-nonced <link rel="stylesheet"> tags without a
  // matching nonce-source. If that returns in prod, options are:
  //   - Proxy the InPost widget through our origin (removes the third-party
  //     inline-style issue but adds latency + maintenance).
  //   - Serve a stricter CSP only on non-checkout routes.
  //   - Pin specific hashes for InPost's known inline styles (brittle).
  // Scripts still use nonce + strict-dynamic — the real XSS attack surface.
  const styleSrc = ["'self'", "'unsafe-inline'", ...STYLE_HOSTS].join(" ");

  const directives: Record<string, string> = {
    "default-src": "'self'",
    "script-src": scriptSrc,
    "style-src": styleSrc,
    "style-src-attr": "'unsafe-inline'",
    "img-src": ["'self'", "blob:", "data:", ...IMG_HOSTS].join(" "),
    // InPost geowidget loads its own icon font from geowidget.easypack24.net.
    "font-src": "'self' data: https://fonts.gstatic.com https://geowidget.easypack24.net",
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
