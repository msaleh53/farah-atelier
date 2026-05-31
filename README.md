# Atelier — Artist Portfolio & Shop

A premium artist portfolio and inquiry-first shop with a museum/editorial aesthetic, built per the project PRD.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS** (design tokens for the full PRD palette)
- **next/image** for optimized, responsive, lazy-loaded imagery
- **next/font** — Cormorant Garamond (headings) + Inter (body/UI)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint (next/core-web-vitals)
```

## Routes

| Path               | Description                                        |
| ------------------ | -------------------------------------------------- |
| `/`                | Home — hero, featured works, artist intro, CTAs    |
| `/gallery`         | Filterable artwork grid (category + availability)  |
| `/gallery/[slug]`  | Artwork detail — image, metadata, story, inquiry   |
| `/shop`            | Prints & originals, inquiry-first add-to-cart      |
| `/about`           | Artist bio, materials, timeline                    |
| `/contact`         | Tabbed inquiry + commission forms (URL-prefilled)  |

## Commerce model (V1)

Inquiry-first, no online payment:

```
Artwork / Print → Inquiry list → Request → Studio confirms → Manual sale
```

The cart (`src/lib/cart-context.tsx`) persists to `localStorage`. "Request these works"
deep-links to `/contact?inquiry=cart`, which prefills the message with a line-item
summary. Artwork pages deep-link to `/contact?artwork=<slug>`.

## Project structure

```
src/
  app/         # routes, layout, sitemap, robots, not-found
  components/  # Navbar, Footer, Hero, ArtworkCard, GalleryGrid,
               # ProductCard, FilterBar, CartDrawer, forms, …
  data/        # artworks + products (typed, swap for a CMS later)
  lib/         # site config, fonts, price format, cart context
  styles/      # global Tailwind layer + design-system utilities
  types/       # shared domain types
```

## Design system

Colors and fonts are defined as Tailwind tokens in `tailwind.config.ts`
(`canvas`, `charcoal`, `pigment`, `parchment`, `ochre`, `label-gray`;
`font-heading`, `font-body`). Reusable component classes (`.btn-primary`,
`.btn-outline`, `.eyebrow`, `.container-editorial`, `.link-underline`) live in
`src/styles/globals.css`.

## Accessibility & SEO

Skip link, semantic landmarks, keyboard-operable nav/filters/cart/forms,
focus-visible rings, descriptive alt text, `prefers-reduced-motion` support,
per-page metadata, JSON-LD structured data, sitemap and robots.

## Future roadmap

- Sanity CMS for artworks/products
- Real form submission + email/notifications
- Payments integration
