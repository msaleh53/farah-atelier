# Farah Atelier — Artist Portfolio

A fine-art portfolio site with a museum/editorial aesthetic and an inquiry-first acquisition model — no online checkout, just a direct conversation with the studio.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Payload CMS 3** (self-hosted, in-app) · **Postgres** via `@payloadcms/db-postgres`
- **Tailwind CSS** (design tokens for the full palette)
- **next/image** for optimized, responsive, lazy-loaded imagery
- **next/font** — Cormorant Garamond (headings) + Inter (body/UI)

## Getting started

Requires **Node 22** (see `.nvmrc`) and a reachable Postgres `DATABASE_URL` +
`PAYLOAD_SECRET` in `.env.local`.

```bash
npm install
npm run dev            # dev server — http://localhost:3000 (auto-picks 3001 if taken)
npm run build           # production build — also typechecks + prerenders every route
npm run start            # serve the production build
npm run lint              # eslint (next/core-web-vitals)
npm run seed               # idempotently seed Payload with sample artworks + Site Settings
npm run generate:types      # regenerate payload-types.ts after schema changes
```

There is no test suite — `npm run build` is the verification gate.

## Routes

| Path              | Description                                            |
| ----------------- | ------------------------------------------------------- |
| `/`               | Home — hero, featured works, artist intro, CTAs         |
| `/gallery`        | Filterable artwork grid (category)                      |
| `/gallery/[slug]` | Artwork detail — image, metadata, story, inquiry CTA     |
| `/journal`        | Journal listing                                          |
| `/journal/[slug]` | Journal post detail                                       |
| `/about`          | Artist bio, materials, timeline                            |
| `/contact`        | Tabbed inquiry + commission forms (URL-prefilled)            |
| `/admin`          | Payload CMS admin                                              |

## Content model

Content is authored in Payload CMS (mounted in-app at `/admin`) and read
through `src/data/` helpers (`getFeaturedArtworks`, `getArtworkBySlug`,
`getSiteSettings`, …), which query Payload's Local API and map documents onto
the component-facing types in `src/types/index.ts`. Collections:
`Users`, `Media`, `Artworks`, `Posts` (`src/payload/collections/`), plus the
`SiteSettings` global (`src/payload/globals/`). Editing content in `/admin`
triggers revalidation via `afterChange` hooks — no manual redeploy needed.

## Inquiry-first model

There is no checkout or payment. The flow is a direct conversation:

```
Artwork → "Inquire about this work" → Contact form (prefilled) → Studio confirms manually
```

Artwork pages deep-link to `/contact?artwork=<slug>`; commission intent
deep-links to `/contact?type=commission`.

## Project structure

```
src/
  app/
    (frontend)/   # public site routes, layout
    (payload)/    # Payload admin + REST/media API mount
  components/     # Navbar, Footer, Hero, ArtworkCard, GalleryGrid,
                  # FilterBar, PageHeader, SectionHeading, forms, …
  data/           # Payload-backed content helpers (typed contract for components)
  lib/            # site config, fonts, price format, Payload client, media URLs
  payload/        # collections, globals, hooks
  styles/         # global Tailwind layer + design-system utilities
  types/          # shared domain types
payload.config.ts  # Payload CMS config (Postgres, uploads, collections)
```

## Design system

Colors and fonts are defined as Tailwind tokens in `tailwind.config.ts`
(`canvas`, `charcoal`, `pigment`, `parchment`, `ochre`, `label-gray`;
`font-heading`, `font-body`). Reusable component classes (`.btn-primary`,
`.btn-outline`, `.eyebrow`, `.container-editorial`, `.link-underline`) live in
`src/styles/globals.css`.

## Accessibility & SEO

Skip link, semantic landmarks, keyboard-operable nav/filters/forms,
focus-visible rings, descriptive alt text, `prefers-reduced-motion` support,
per-page metadata, JSON-LD structured data, sitemap and robots.

## Deployment

Live on Vercel, with Neon (Postgres) and Cloudflare R2 (media storage) in
production, on the custom domain `www.farahramadan.art`. Pushing to `main`
deploys automatically via Vercel's GitHub integration. Required env vars,
non-obvious build/runtime gotchas (sharp, importMap, CORS/CSRF, image hosts),
and the custom-domain checklist are documented in `DEPLOYMENT.md`. Contact
form email + bot protection setup is in `EMAIL_SETUP.md`.
