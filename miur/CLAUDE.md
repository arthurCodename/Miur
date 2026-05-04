@AGENTS.md

# Miur — Project Context for AI Assistants

## What is Miur?
B2C e-commerce wellness store targeting the Polish market.
Sells intimate wellness and education products via dropshipping (erotizo.pl).
Sender branding: "Salgo" (anonymous, privacy-focused).

## Team
- **Bogdan** — owner, handles frontend, infrastructure, DevOps, DB design. No programming background.
- **Arthur** — fullstack developer, handles backend integrations, testing, APIs.

## Repository structure
```
Miur/                    ← git root
  miur/                  ← Next.js project root (open this in Cursor)
    app/                 ← App Router pages
    components/
      layout/            ← Navbar, Hero, Footer
      ui/                ← shadcn primitives
    lib/                 ← utilities
    public/              ← static assets (fonts, video, images)
```

## Current state (Stage 1 complete)
- ✅ Next.js 16 with App Router + Turbopack
- ✅ Tailwind CSS 4
- ✅ shadcn/ui (radix-nova style)
- ✅ Hero section with framer-motion scroll animation
- ✅ Navbar with scroll-triggered logo animation
- ✅ Footer with newsletter input
- ⏳ Product catalog (next)
- ⏳ Cart & checkout
- ⏳ Auth
- ⏳ Backend integrations (Przelewy24, InPost, Resend)

## Key decisions
- **No dark mode** in v1
- **Polish UI** — all user-facing text in Polish
- **Dropshipping only** — no own inventory
- **Payments**: Przelewy24 (BLIK, Google Pay, Apple Pay)
- **Shipping**: InPost ShipX, paczkomaty
- **Hosting**: Vercel (frontend) + DigitalOcean Frankfurt (PostgreSQL)
- **CDN**: Cloudflare Free (to reduce Vercel bandwidth costs)

## When writing code
- Always check if a shadcn component already exists before creating custom UI
- Use @/ import alias — never use relative paths like ../../../
- framer-motion animations must be in "use client" components
- Server components fetch data directly — no useEffect for data fetching
- Before modifying any frontend component, always check the relevant file in EU_PL_Compliance/ folder. The checklist is in 11_Frontend_Checklist.md. Polish e-commerce law applies. EAA accessibility and other laws are mandatory.