import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

/**
 * robots.txt rules.
 *
 * Disallowed:
 *   - /checkout, /checkout/*       — transactional (payment redirects)
 *   - /profile, /moje-zamowienia,  — auth-only, irrelevant for crawlers
 *     /lista-zyczen, /moje-konto
 *   - /login, /logowanie           — auth screen
 *   - /search                      — query result pages, noindex
 *   - /api/*                       — backend, never crawled
 *
 * Block AI training crawlers explicitly. Reading and indexing for normal
 * search engines stays allowed; we just don't want our product photos /
 * Polish copy fed into LLM training datasets.
 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl().replace(/\/$/, "");
  const restrictedPaths = [
    "/checkout",
    "/checkout/",
    "/profile",
    "/profile/",
    "/moje-konto",
    "/moje-konto/",
    "/moje-zamowienia",
    "/moje-zamowienia/",
    "/lista-zyczen",
    "/lista-zyczen/",
    "/login",
    "/logowanie",
    "/register",
    "/rejestracja",
    "/forgot-password",
    "/forgot-password/",
    "/odzyskaj-haslo",
    "/odzyskaj-haslo/",
    "/search",
    "/api/",
  ];

  const aiBots = ["GPTBot", "ClaudeBot", "anthropic-ai", "CCBot", "Google-Extended"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: restrictedPaths,
      },
      ...aiBots.map((agent) => ({
        userAgent: agent,
        disallow: "/",
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/^https?:\/\//, ""),
  };
}
