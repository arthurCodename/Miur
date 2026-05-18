import { z } from "zod";

/**
 * Production env contract.
 *
 * These variables MUST be set on Vercel for any `production` deployment so the
 * storefront complies with Polish law:
 *   - UŚUDE art. 5 (seller identification on the site)
 *   - RODO art. 13 (data controller info)
 *   - Omnibus directive (canonical store URL for sitemap / canonical tags)
 *
 * Preview deployments (VERCEL_ENV=preview) and local dev are NOT required to
 * fill these in — placeholders / empty values are tolerated so the team can
 * iterate on UX without legal data.
 *
 * Escape hatch: `NEXT_PUBLIC_SKIP_ENV_VALIDATION=1` skips validation entirely
 * (useful for dependency upgrades or emergency rebuilds where you accept the
 * risk of shipping an incomplete footer).
 */
const productionEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_SITE_URL is required")
    .url("NEXT_PUBLIC_SITE_URL must be a fully-qualified URL (https://...)"),

  NEXT_PUBLIC_SELLER_LEGAL_NAME: z
    .string()
    .min(2, "NEXT_PUBLIC_SELLER_LEGAL_NAME is required (registered company / sole-trader name)"),

  NEXT_PUBLIC_SELLER_ADDRESS_LINE1: z
    .string()
    .min(3, "NEXT_PUBLIC_SELLER_ADDRESS_LINE1 is required (street + number)"),

  NEXT_PUBLIC_SELLER_NIP: z
    .string()
    .regex(/^\d{10}$/, "NEXT_PUBLIC_SELLER_NIP must be exactly 10 digits, no spaces or dashes"),

  NEXT_PUBLIC_SELLER_REGON: z
    .string()
    .regex(/^(\d{9}|\d{14})$/, "NEXT_PUBLIC_SELLER_REGON must be 9 or 14 digits"),

  NEXT_PUBLIC_SELLER_EMAIL: z
    .string()
    .email("NEXT_PUBLIC_SELLER_EMAIL must be a valid email"),
});

export function validateProductionEnv(): void {
  if (process.env.NEXT_PUBLIC_SKIP_ENV_VALIDATION === "1") return;
  // Only enforce on Vercel production; preview/dev can be incomplete.
  if (process.env.VERCEL_ENV !== "production") return;

  const result = productionEnvSchema.safeParse(process.env);
  if (result.success) return;

  const issues = result.error.issues
    .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
    .join("\n");

  console.error(
    [
      "",
      "✖ Production env validation failed.",
      "  Set the missing variables in your Vercel project settings:",
      "",
      issues,
      "",
      "  To skip this check (NOT recommended for prod), set:",
      "    NEXT_PUBLIC_SKIP_ENV_VALIDATION=1",
      "",
    ].join("\n"),
  );

  throw new Error("Production env validation failed — see error above.");
}
