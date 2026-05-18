"use client";

import { useSyncExternalStore } from "react";

/**
 * Detect whether the user has requested reduced motion via OS settings.
 *
 * Uses `useSyncExternalStore` so the value is consistent between SSR and CSR
 * (server pretends "false" — the conservative default — and React rehydrates
 * to the real value on first paint).
 *
 * Listens for live changes (e.g. user toggling the setting in macOS System
 * Preferences while the tab is open).
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => undefined;
  }
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}
