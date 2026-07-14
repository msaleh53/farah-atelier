# Logo upload wiring + gallery lightbox slider

## Context

Two independent, additive changes to the public site:

1. The Navbar currently hardcodes `/logo-farah-ramadan.png` and ignores the `logo` upload field that already exists on `SiteSettings` (and is already wired up and used by `Footer.tsx` via `getSiteContent().logo`). This spec wires that same value into the Navbar, and also replaces the static fallback asset with an updated logo file.
2. The Gallery page has no way to view an artwork full-size without leaving the grid. This spec adds a custom lightbox overlay that opens on thumbnail click and lets visitors slide between artworks in the currently filtered set.

Neither change touches commerce/inquiry flow, routing, or the Payload schema beyond what already exists.

## 1. Logo: wire the existing upload field into Navbar

- `SiteSettings.logo` (upload → media) and `getSiteContent().logo` (resolved URL or `null`) already exist and already work — no Payload or `src/data/settings.ts` changes needed.
- `src/app/(frontend)/layout.tsx`: pass `content.logo` into `<Navbar logo={content.logo} brandName={content.brandName} />` (currently only `brandName` is passed).
- `src/components/Navbar.tsx`: accept a `logo: string | null` prop. Render `<Image src={logo ?? "/logo-farah-ramadan.png"} alt={brandName} .../>`, replacing the hardcoded `src="/logo-farah-ramadan.png"` at `Navbar.tsx:43`. Keep existing dimensions/classes (`width={821} height={312}`, `h-[108px] w-auto`, `priority`).
- **Static fallback asset swap:** replace `public/logo-farah-ramadan.png` with the new logo (confirmed file, currently staged at repo root as `farah-logo.png`, 1315×399px). This is the image shown when no logo is uploaded in `/admin`. The new file's aspect ratio (~3.30:1) differs from the current one (821×312, ~2.63:1), so the `width`/`height` props on both `Navbar` (`Navbar.tsx:45-46`) and `Footer` (`Footer.tsx:18-19`) must be updated to `1315`/`399` to match — keeping the same rendered heights via the existing `h-[108px]` (navbar) / `h-16` (footer) classes, with `w-auto` scaling the width accordingly.
- No changes to `Footer.tsx`'s logic — it already consumes `content.logo` correctly; only its `width`/`height` attributes need updating if the new asset's aspect ratio changes.

## 2. Gallery lightbox with slider

- **New `src/components/Lightbox.tsx`** (client component):
  - Full-screen fixed overlay, `role="dialog"`, `aria-modal="true"`, labelled via `aria-labelledby` pointing at the artwork title.
  - Props: `artworks: Artwork[]`, `index: number`, `onClose: () => void`, `onNavigate: (index: number) => void`.
  - Displays the artwork image (`artwork.image`, the existing pre-cropped `card` size — no new Media size or data-layer change), title, medium/year caption, a slide counter ("3 / 12"), and a "View details →" link to `/gallery/${artwork.slug}`.
  - Close via ×-button, `Escape` key, or backdrop click.
  - Navigate via on-screen prev/next arrow buttons, `ArrowLeft`/`ArrowRight` keys, and touch swipe (simple pointer-position delta, threshold ~50px). Navigation wraps at the ends (last → first, first → last) — consistent with a continuous "slider" feel.
  - Focus moves into the dialog on open (to the close button) and returns to the triggering thumbnail on close. Focus is trapped inside the dialog while open (Tab/Shift+Tab cycle within it).
  - Body scroll locked while open (matches the accessibility bar already established elsewhere in the codebase — `role="dialog"`+`aria-modal`, Escape, scroll-lock).
  - Respects `prefers-reduced-motion` for open/close and slide transitions.
- **`src/components/GalleryView.tsx`**: owns `lightboxIndex: number | null` state, scoped to the `filtered` array (so the slider only moves through the currently-active category filter, per product decision). Renders `<Lightbox>` conditionally when `lightboxIndex !== null`.
- **`src/components/ArtworkCard.tsx`**: add an optional `onOpenLightbox?: () => void` prop.
  - When provided, the card renders as a `<button type="button">` (instead of `<Link>`) wrapping the existing figure markup, calling `onOpenLightbox` on click. `aria-label` describes the action (e.g. "View {title} full size").
  - When omitted (its other consumer, the home page Featured section in `src/app/(frontend)/page.tsx`), behavior is unchanged — still a `<Link>` to the detail page.
- **`src/components/GalleryGrid.tsx`**: accepts an optional `onOpenLightbox?: (index: number) => void` prop and threads `() => onOpenLightbox?.(i)` into each `ArtworkCard`.
- Detail page (`src/app/(frontend)/gallery/[slug]/page.tsx`) is untouched — still reachable directly and via the lightbox's "View details" link.

## Out of scope

- Per-artwork multiple images / photo carousel (the `Artworks` collection has a single `image` field; not changed here).
- Lightbox on the artwork detail page itself (only the gallery grid, per the request).
- Any change to `Artworks`/`Media` Payload schema or image size variants.
- Dark mode, unrelated visual redesign.

## Verification

- `npm run build` — typechecks and prerenders every route, including the gallery page.
- Manual check in `npm run dev`:
  - Site Settings → Logo: upload an image, confirm Navbar updates; remove it, confirm Navbar falls back to the new static asset; confirm Footer still renders correctly at its size.
  - Gallery: click a thumbnail → lightbox opens on the correct artwork; arrow keys/buttons and swipe slide through the *filtered* set only, wrapping at the ends; Escape/×/backdrop close and return focus to the thumbnail; Tab cycles within the dialog only; "View details" link goes to the right detail page; reduced-motion setting suppresses transitions.
  - Home page Featured section: confirm `ArtworkCard` still links to the detail page as before (lightbox is gallery-only).
