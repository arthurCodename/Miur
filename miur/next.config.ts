// Miur/miur/next.config.ts
import type { NextConfig } from "next";
import { categories } from "./lib/catalog/data/categories";
import { validateProductionEnv } from "./lib/env/server-env";

// Fails the production build if any legally-required env var is missing.
// No-op for dev / preview (see lib/env/server-env.ts).
validateProductionEnv();

const nextConfig: NextConfig = {
  turbopack: {
    // Pin root to this app to avoid parent lockfile auto-detection noise.
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Short URLs for SEO/branding: /dla-niej is served by /kategorie/dla-niej
  async rewrites() {
    return categories.map((category) => ({
      source: category.href,
      destination: `/kategorie${category.href}`,
    }));
  },
  // Permanent redirects for legacy / Polonised paths so that no internal link 404s.
  async redirects() {
    return [
      // Polish-language aliases for /login (some footer links use Polish names)
      { source: "/logowanie", destination: "/login", permanent: true },
      { source: "/rejestracja", destination: "/login", permanent: true },
      // Account routes consolidated into /profile until full account flow ships
      { source: "/moje-konto", destination: "/profile", permanent: true },
      { source: "/moje-konto/edycja", destination: "/profile", permanent: true },
      // Promocje and wyprzedaz are the same thing in PL e-commerce; canonicalise
      { source: "/promocje", destination: "/wyprzedaz", permanent: true },
    ];
  },
  // CSP itself is set per-request in middleware.ts (so we can use a nonce).
  // Everything below is static, safe to ship globally.
  async headers() {
    const base = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
    ];
    if (process.env.VERCEL) {
      base.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }
    return [{ source: "/(.*)", headers: base }];
  },
};

export default nextConfig;