/**
 * Centralised z-index scale — DO NOT use ad-hoc `z-[123]` values in components.
 *
 * Layers from bottom to top:
 *
 *   0–30   page content (Hero text, product card badges, etc.)
 *   100    sticky chrome — Navbar / persistent header
 *   110    overlays — Dialog, Sheet, CartSheet, mobile menu
 *   200    floating utilities — Accessibility widget, Toast / Sonner
 *   400    blocking gates — AgeGate (must cover everything)
 *
 * Why constants and not Tailwind utilities? Tailwind class-name strings can't
 * be programmatically composed across files reliably. We export numeric tokens
 * as strings to interpolate into `z-[X]` arbitrary values consistently.
 *
 * Usage:
 *   import { Z } from "@/lib/ui/z-index";
 *   <div className={`z-[${Z.modal}]`}>...</div>
 */
export const Z = {
  base: 0,
  contentRaised: 10,
  contentTop: 30,
  navbar: 100,
  modal: 110,
  toast: 200,
  ageGate: 400,
} as const;
