import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

export const CART_SESSION_COOKIE = "miur-cart-session";

// 1 year — matches typical e-commerce cart persistence. Plenty long for a
// returning anonymous visitor; users who don't return won't accumulate state.
const CART_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** Read the anonymous-cart session id, or null if it isn't set. */
export async function readCartSessionCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_SESSION_COOKIE)?.value ?? null;
}

/**
 * Get the existing cookie OR mint a new one and set it on the response.
 * Use this from POST handlers — never from GET, because we shouldn't be
 * writing cookies on read paths (it bloats every page load and is the kind
 * of thing CDNs choke on).
 */
export async function readOrCreateCartSessionCookie(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CART_SESSION_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(CART_SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
  return id;
}

/** Delete the anonymous-cart cookie. Used after merging into a user cart. */
export async function clearCartSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(CART_SESSION_COOKIE);
}
