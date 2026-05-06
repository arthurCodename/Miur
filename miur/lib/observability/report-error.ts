/**
 * Centralised client-side error reporting.
 *
 * In dev: logs to console (so you see stack traces in the IDE).
 * In prod: forwards to whatever error tracker we wire up later (Sentry,
 *          Vercel Observability, Datadog Browser RUM, etc.). Until then it's a
 *          no-op — we deliberately do NOT call console.error in production
 *          because users see those in DevTools and they pollute browser logs.
 *
 * To swap in a real tracker:
 *   1. Add the SDK to package.json
 *   2. Replace the prod branch below with `Sentry.captureException(error)` etc.
 *   3. Add the SDK's domain to middleware.ts CSP `connect-src`.
 */
export function reportClientError(error: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    console.error("[client]", error);
    return;
  }

  // TODO: integrate Sentry / Vercel Observability here.
  // For now: keep silent in prod to avoid leaking stack traces to end users.
}
