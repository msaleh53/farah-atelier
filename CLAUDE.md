# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # dev server with hot reload (auto-picks 3001 if 3000 is taken)
npm run build          # production build — also the fastest way to typecheck + catch prerender errors
npm run start          # serve the production build
npm run lint           # eslint (next/core-web-vitals)
npm run seed           # idempotently seed Payload with the 8 artworks + 6 products + Site Settings text
npm run generate:types # regenerate payload-types.ts after schema changes
```

There is no test suite. Treat `npm run build` as the gate: it typechecks all routes and statically prerenders every page (including the 8 artwork detail pages), so a clean build catches most regressions. **Both build and the Payload CLI scripts require a reachable `DATABASE_URL` (Postgres) and `PAYLOAD_SECRET` in `.env.local`.**

**Toolchain pins:** the project is ESM (`"type": "module"` in package.json) and pinned to **Node 22** and **Next 15.4.x** — Payload's latest does not support Next 15.5, and its CLI (tsx) breaks on Node 24. Use Node 22 (`.nvmrc`).

## Architecture

Next.js 15 App Router site for an artist portfolio + inquiry-first shop. TypeScript, Tailwind, `next/image`. Path alias `@/*` → `src/*`.

**Content comes from Payload CMS (self-hosted, in-app).** Payload 3 runs *inside* this Next app — admin at `/admin`, REST/media under `/api`, both mounted from the `src/app/(payload)/` route group (the public site lives in the parallel `src/app/(frontend)/` group; there is no top-level `app/layout.tsx`). Config: `payload.config.ts` → `src/payload/collections/` (`Users`, `Media`, `Artworks`, `Products`) + `src/payload/globals/SiteSettings.ts`. Postgres via `@payloadcms/db-postgres`; uploads on local disk (`media/`, gitignored) with an S3/R2 swap documented in `payload.config.ts` for production.

The `src/data/` helpers (`getFeaturedArtworks`, `getArtworkBySlug`, `getAllProducts`, `getSiteSettings`, …) keep their **original signatures** but now query Payload's Local API (`src/lib/payload.ts` → cached `getPayload`) and map Payload docs onto the component-facing types in `src/types/index.ts` — that file is still the contract the components depend on. `src/lib/media.ts` (`mediaUrl`) resolves an uploaded image to a sized-variant URL (`card`/`hero`/`portrait`), replacing Sanity's `urlFor`. Generated DB types live in `payload-types.ts` (`@payload-types`); the mappers bridge those to `src/types`. Editing content in `/admin` triggers `revalidatePath` via collection/global `afterChange` hooks (`src/payload/hooks/revalidate.ts`) — the replacement for ISR.

**Inquiry-first commerce — there is no checkout/payment.** This is the core domain decision. The flow is: add work → cart (inquiry list) → "Request these works" → contact form prefilled with a line-item summary → studio confirms manually. When touching commerce, preserve this; do not add payment/checkout semantics.

- Cart state lives in `src/lib/cart-context.tsx` (`CartProvider` + `useCart`): a `useReducer` store with `localStorage` persistence (key `atelier-cart`) and the drawer open/close state. `addItem` auto-opens the drawer. The provider wraps the public site in `src/app/(frontend)/layout.tsx`, and `CartDrawer` is mounted there globally.
- Cross-page handoff happens via URL params read in `src/components/ContactView.tsx`:
  - `/contact?artwork=<slug>` → prefilled from the artwork (set by the detail page CTA)
  - `/contact?inquiry=cart` → prefilled with a cart line-item summary + indicative total (set by `CartDrawer`)
  - `/contact?type=commission` → opens the Commission tab
  Any component that links into `/contact` should use these params rather than duplicating prefill logic.

**Server vs client split.** Route `page.tsx` files are Server Components that fetch from `src/data/` and define metadata. Interactivity is pushed into client components (`"use client"`): `GalleryView` (filtering), `ContactView`/forms, `CartDrawer`, `ProductCard` (add-to-cart), `Navbar`, `Reveal`. `ContactView` uses `useSearchParams`, so the contact page wraps it in `<Suspense>` — keep that wrapper.

**Design system is centralized.** Do not hardcode hex colors or font families. Colors and fonts are Tailwind tokens in `tailwind.config.ts` (`canvas`, `charcoal`, `pigment`, `parchment`, `ochre`, `label-gray`; `font-heading` = Cormorant, `font-body` = Inter, loaded via `next/font` in `src/lib/fonts.ts`). Reusable component classes live in `src/styles/globals.css` under `@layer components`: `.container-editorial` (page width/padding), `.btn-primary`, `.btn-outline`, `.eyebrow`, `.link-underline`. Prefer these over re-deriving styles.

**Shared layout primitives** to reuse rather than reinvent: `PageHeader` (page intro), `SectionHeading` (in-page section header), `ArtworkCard` + `GalleryGrid` (the gallery card/grid, reused on home and gallery), `FilterBar` (accessible toggle group), `Reveal` (scroll-reveal motion).

## Conventions

- **Images:** remote hosts must be allowlisted in `next.config.mjs` (currently `images.unsplash.com`). Every `next/image` needs explicit `sizes`; set `priority` only on above-the-fold/LCP images. Every artwork/product has an `imageAlt` field — use it.
- **Accessibility is expected, not optional:** focus-visible rings (ochre), `aria-current` nav, `aria-pressed` filters, `role="dialog"`+`aria-modal` cart with Escape/scroll-lock, `role="tablist"` contact tabs, labeled form fields. Match this bar in new UI. Motion must honor `prefers-reduced-motion` (handled globally in `globals.css` and per-component in `Reveal`).
- **Prices** are indicative JOD; format via `formatPrice` in `src/lib/format.ts`. `Artwork.price` may be `null` (on request) — handle that case.
- **SEO:** each route exports `metadata` (title/description); the root layout sets the title template and JSON-LD. Adding routes means updating `src/app/sitemap.ts`.
- Site-wide strings (brand, artist name, nav links, contact) come from `src/lib/site.ts` — edit there, not inline.
