# SoftVolt AI — softvoltai.com

White-label production & growth partner website for agencies. Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4 (CSS-first tokens), GSAP 3.15 + Lenis for motion, React Hook Form + Zod for the brief form, Resend for delivery.

The plan this implements: **Invisible Team Blueprint** (research + design direction), and the two documents in this folder (`business-plane.md`, `White_Label_…_Plan_Expanded.md`).

## Run

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm lint       # eslint (next lint was removed in Next 16)
pnpm typecheck  # tsc --noEmit
```

Copy `.env.example` to `.env.local`. Without `RESEND_API_KEY` the brief form still works — submissions are printed to the server console instead of emailed.

## Structure

```
app/            layout (fonts, metadata, JSON-LD), page, sitemap, robots, OG image, api/brief
components/
  layout/       SiteHeader, MobileNav (inside header), SiteFooter, StickyCta, Logo
  sections/     one file per homepage section, in page order
  ui/           Button, SectionHeading, Chip
  motion/       MotionRoot — reveal observer + Lenis + anchor scrolling
  seo/          JsonLd
content/        ALL copy and data (typed) — edit words here, never in components
lib/cms/        content access layer; pages import from here only (WordPress adapter comes in Phase 4)
lib/forms/      brief form schema (shared by the form and the API route)
lib/motion/     gsap registration + reduced-motion helper
lib/seo/        schema.org builders
```

## Design system

Tokens live in `app/globals.css` under `@theme`:

- Paper `#f6f7f4`, ink `#121614`, muted `#5b645e`, approval green `#1e7a32` (light page accent)
- Engine room: `#0e1411` ground, volt `#65f545` accent — used only inside dark sections and the logo mark
- Fraunces (display, opsz 144) · Geist (text) · Geist Mono (labels, data) — self-hosted through `next/font`
- Section rhythm `--section-y` (80–128px), radius 8px buttons / 12px cards, 1px hairlines, ink primary buttons

Rules: volt is never text on paper; accent appears at most three times per screen; every section opens with eyebrow → H2 → lede; no stock photos — real artefacts only.

## Motion

- `[data-reveal]` elements get `.is-in` from one IntersectionObserver (`MotionRoot`). Resting state is visible without JS.
- Hero: GSAP timeline builds the mock, sweeps the lens once, then the lens follows the pointer or drifts on its own.
- Process: pure `position: sticky` + IntersectionObserver — no scroll hijacking.
- Everything respects `prefers-reduced-motion` (Lenis off, timelines skipped, reveals instant).

## Before launch — owner decisions

Search the code for `TODO(owner)`:

- `content/promises.ts`, `content/process.ts` — every line is a public commitment; keep only what you will honour on day one.
- `content/stack.ts` — `engagementModels[].from` prices; `components/sections/FollowTheSun.tsx` — `COVERAGE` hours.
- `content/site.ts` — create the `hello@softvoltai.com` mailbox; set `NEXT_PUBLIC_CAL_URL` for the scoping call.
- `content/work.ts` — swap in partner projects only with written permission.
- Replace `public/founder.png` with the final portrait if needed.

## Roadmap

1. Service pages (`/services/[slug]`) and agency pages (`/for/[slug]`) from typed content — one template each.
2. `/rates`, `/security`, `/partner-programme`, `/work/[slug]`.
3. Plausible (cookieless) + c15t consent gate for GTM/GA4/Clarity.
4. Headless WordPress (WPGraphQL + ACF) for blog and case studies through `lib/cms`.
5. Agency portal (Payload 3).
