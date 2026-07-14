# Logo Upload Wiring + Gallery Lightbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the already-existing Site Settings `logo` upload into the Navbar (with an updated static fallback image), and add a custom accessible lightbox to the Gallery page that lets visitors slide between artworks in the currently filtered set.

**Architecture:** Two independent vertical slices. (1) Logo: `layout.tsx` already fetches `getSiteContent()`; pass its existing `.logo` field into `Navbar`, which currently ignores it. (2) Lightbox: a new self-contained `Lightbox.tsx` client component, wired into the existing `GalleryView → GalleryGrid → ArtworkCard` chain via one new optional prop threaded through each layer, so the Home page's reuse of `ArtworkCard` is unaffected.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind. No new dependencies — the lightbox is hand-built (matches the project's existing custom `FilterBar`/`Reveal` components, no library).

## Global Constraints

- No test suite exists in this repo. Per `CLAUDE.md`, treat `npm run build` as the verification gate (typechecks all routes and statically prerenders every page) — use it in place of automated tests in every task below.
- `npm run build` requires a reachable `DATABASE_URL` (Postgres) and `PAYLOAD_SECRET` in `.env.local` — assumed already configured in this environment.
- Node 22 is pinned (`.nvmrc`) — do not run scripts under a different Node major version.
- Do not hardcode hex colors or fonts — use the existing Tailwind tokens (`canvas`, `charcoal`, `pigment`, `parchment`, `ochre`, `label-gray`, `sand`) and `font-heading`/`font-body`.
- Match the project's accessibility bar: `focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2`, `role="dialog"` + `aria-modal` for overlays, Escape + scroll-lock, honor `prefers-reduced-motion` via the `motion-reduce:` variant (see `Reveal.tsx`).
- The Payload `SiteSettings.logo` field and `getSiteContent().logo` resolver already exist and work (used today by `Footer.tsx`) — do not modify `src/payload/globals/SiteSettings.ts` or `src/data/settings.ts`.
- `Artwork.image` is already a pre-cropped 4:5 `card`-size URL (`src/data/artworks.ts`) — do not add new Media size variants or touch the data layer.

---

### Task 1: Wire the Site Settings logo into Navbar + swap the static fallback

**Files:**
- Modify: `public/logo-farah-ramadan.png` (binary replace)
- Modify: `src/components/Navbar.tsx:9`, `:41-50`
- Modify: `src/components/Footer.tsx:14-21`
- Modify: `src/app/(frontend)/layout.tsx:64`

**Interfaces:**
- Consumes: `getSiteContent().logo: string | null` (already implemented, `src/data/settings.ts:163`).
- Produces: `Navbar({ brandName, logo }: { brandName?: string; logo?: string | null })` — new `logo` prop other tasks/files don't currently depend on.

- [ ] **Step 1: Replace the static logo asset**

The confirmed new logo file is staged at the repo root (`farah-logo.png`, 1315×399px). Move it into `public/`, overwriting the old one:

```bash
mv farah-logo.png public/logo-farah-ramadan.png
```

- [ ] **Step 2: Verify the new file is in place**

```bash
sips -g pixelWidth -g pixelHeight public/logo-farah-ramadan.png
```

Expected: `pixelWidth: 1315` and `pixelHeight: 399`.

- [ ] **Step 3: Update Navbar to accept a `logo` prop and use the new intrinsic dimensions**

In `src/components/Navbar.tsx`, change line 9 from:

```tsx
export default function Navbar({ brandName = site.name }: { brandName?: string }) {
```

to:

```tsx
export default function Navbar({
  brandName = site.name,
  logo,
}: {
  brandName?: string;
  logo?: string | null;
}) {
```

Then change the `<Image>` block (currently lines 42-49) from:

```tsx
          <Image
            src="/logo-farah-ramadan.png"
            alt={brandName}
            width={821}
            height={312}
            className="h-[108px] w-auto"
            priority
          />
```

to:

```tsx
          <Image
            src={logo || "/logo-farah-ramadan.png"}
            alt={brandName}
            width={1315}
            height={399}
            className="h-[108px] w-auto"
            priority
          />
```

- [ ] **Step 4: Update Footer's intrinsic dimensions to match the new aspect ratio**

In `src/components/Footer.tsx`, change the `<Image>` block (lines 15-21) from:

```tsx
            <Image
              src={content.logo}
              alt={content.brandName}
              width={821}
              height={312}
              className="h-16 w-auto"
            />
```

to:

```tsx
            <Image
              src={content.logo}
              alt={content.brandName}
              width={1315}
              height={399}
              className="h-16 w-auto"
            />
```

- [ ] **Step 5: Pass `content.logo` into Navbar from the root layout**

In `src/app/(frontend)/layout.tsx`, change line 64 from:

```tsx
        <Navbar brandName={content.brandName} />
```

to:

```tsx
        <Navbar brandName={content.brandName} logo={content.logo} />
```

- [ ] **Step 6: Run the build gate**

```bash
npm run build
```

Expected: `Compiled successfully`, all routes (including the 8 artwork detail pages) prerender with no type errors.

- [ ] **Step 7: Manual verification in dev server**

```bash
npm run dev
```

- Visit `/` and `/gallery` — confirm the Navbar shows the new hand-drawn logo at the same visual height as before (no layout shift), and the Footer logo also renders correctly at its smaller size.
- Visit `/admin` → Site Settings → "Studio & contact" tab → upload a different test image to the Logo field, save. Reload the public site — confirm Navbar (and Footer) now show the uploaded image instead of the static file.
- Remove the uploaded logo in `/admin` and save. Reload — confirm Navbar and Footer fall back to the new static asset (not the old one, not blank).

- [ ] **Step 8: Commit**

```bash
git add public/logo-farah-ramadan.png src/components/Navbar.tsx src/components/Footer.tsx "src/app/(frontend)/layout.tsx"
git commit -m "Wire Site Settings logo upload into Navbar, update static fallback asset"
```

---

### Task 2: Build the Lightbox component

**Files:**
- Create: `src/components/Lightbox.tsx`

**Interfaces:**
- Consumes: `Artwork` type (`src/types/index.ts:8-20`) — fields used: `id`, `slug`, `title`, `year`, `medium`, `image`, `imageAlt`.
- Produces: `export default function Lightbox({ artworks, index, onClose, onNavigate }: { artworks: Artwork[]; index: number; onClose: () => void; onNavigate: (index: number) => void })` — the exact signature Task 3 wires up.

- [ ] **Step 1: Create the component**

Create `src/components/Lightbox.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/types";

const SWIPE_THRESHOLD_PX = 50;

/**
 * Full-screen overlay for viewing one artwork at a time, with prev/next
 * navigation through `artworks` (wraps at the ends). Callers own the current
 * index; this component is otherwise stateless.
 */
export default function Lightbox({
  artworks,
  index,
  onClose,
  onNavigate,
}: {
  artworks: Artwork[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const artwork = artworks[index];
  const prevIndex = (index - 1 + artworks.length) % artworks.length;
  const nextIndex = (index + 1) % artworks.length;

  // Focus the dialog on open, lock body scroll, restore both on close.
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      previouslyFocused.current?.focus();
    };
  }, []);

  // Keyboard: Escape closes, arrows navigate, Tab is trapped inside the dialog.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        onNavigate(prevIndex);
        return;
      }
      if (e.key === "ArrowRight") {
        onNavigate(nextIndex);
        return;
      }
      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>("button, a[href]");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onNavigate, prevIndex, nextIndex]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta > SWIPE_THRESHOLD_PX) {
      onNavigate(prevIndex);
    } else if (delta < -SWIPE_THRESHOLD_PX) {
      onNavigate(nextIndex);
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-charcoal/95 p-4 transition-opacity duration-300 ease-editorial motion-reduce:transition-none sm:p-10"
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal sm:right-8 sm:top-8"
      >
        <span aria-hidden="true" className="text-2xl leading-none">
          ×
        </span>
      </button>

      {artworks.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => onNavigate(prevIndex)}
            aria-label="Previous artwork"
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal sm:left-6"
          >
            <span aria-hidden="true" className="text-3xl leading-none">
              ‹
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate(nextIndex)}
            aria-label="Next artwork"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal sm:right-6"
          >
            <span aria-hidden="true" className="text-3xl leading-none">
              ›
            </span>
          </button>
        </>
      ) : null}

      <div className="relative aspect-[4/5] h-[55vh] max-h-[600px] max-w-[90vw]">
        {artwork.image ? (
          <Image
            src={artwork.image}
            alt={artwork.imageAlt}
            fill
            sizes="90vw"
            className="object-contain"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-parchment">
            <span className="font-body text-xs uppercase tracking-[0.2em] text-label-gray">
              Image coming soon
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 max-w-md text-center">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-sand">
          {index + 1} / {artworks.length}
        </p>
        <h2 id="lightbox-title" className="mt-2 font-heading text-2xl font-light text-canvas">
          {artwork.title}
        </h2>
        <p className="mt-1 font-body text-sm text-canvas/70">
          {artwork.medium}, {artwork.year}
        </p>
        <Link
          href={`/gallery/${artwork.slug}`}
          className="link-underline mt-4 inline-block font-body text-xs uppercase tracking-[0.2em] text-canvas"
        >
          View details →
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run the build gate**

```bash
npm run build
```

Expected: `Compiled successfully`, no type errors. (The component isn't imported anywhere yet, so there's nothing to visually check — Task 3 wires it up.)

- [ ] **Step 3: Commit**

```bash
git add src/components/Lightbox.tsx
git commit -m "Add Lightbox component for full-size artwork viewing"
```

---

### Task 3: Wire the Lightbox into the Gallery page

**Files:**
- Modify: `src/components/ArtworkCard.tsx`
- Modify: `src/components/GalleryGrid.tsx`
- Modify: `src/components/GalleryView.tsx`

**Interfaces:**
- Consumes: `Lightbox` from Task 2 (`src/components/Lightbox.tsx`), exact signature `{ artworks, index, onClose, onNavigate }`.
- Produces: `ArtworkCard({ artwork, priority, onOpenLightbox }: { artwork: Artwork; priority?: boolean; onOpenLightbox?: () => void })` and `GalleryGrid({ artworks, priorityCount, onOpenLightbox }: { artworks: Artwork[]; priorityCount?: number; onOpenLightbox?: (index: number) => void })` — both keep their existing props working unchanged for the Home page, which doesn't pass `onOpenLightbox`.

- [ ] **Step 1: Add an optional `onOpenLightbox` prop to ArtworkCard**

Replace the full contents of `src/components/ArtworkCard.tsx` with:

```tsx
import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/types";

export default function ArtworkCard({
  artwork,
  priority = false,
  onOpenLightbox,
}: {
  artwork: Artwork;
  priority?: boolean;
  /** When provided, the card opens the lightbox instead of linking to the detail page. */
  onOpenLightbox?: () => void;
}) {
  const figure = (
    <figure>
      <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
        {artwork.image ? (
          <Image
            src={artwork.image}
            alt={artwork.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-label-gray">
              Image coming soon
            </span>
          </div>
        )}
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl leading-tight text-charcoal">
            <span className="link-underline">{artwork.title}</span>
          </h3>
          <p className="mt-1 font-body text-sm text-label-gray">
            {artwork.medium}, {artwork.year}
          </p>
        </div>
        <p className="shrink-0 font-body text-xs uppercase tracking-[0.15em] text-label-gray">
          {artwork.category}
        </p>
      </figcaption>
    </figure>
  );

  if (onOpenLightbox) {
    return (
      <button
        type="button"
        onClick={onOpenLightbox}
        aria-label={`View ${artwork.title} full size`}
        className="group block w-full text-left focus-visible:outline-none"
      >
        {figure}
      </button>
    );
  }

  return (
    <Link
      href={`/gallery/${artwork.slug}`}
      className="group block focus-visible:outline-none"
    >
      {figure}
    </Link>
  );
}
```

- [ ] **Step 2: Thread the prop through GalleryGrid**

Replace the full contents of `src/components/GalleryGrid.tsx` with:

```tsx
import type { Artwork } from "@/types";
import ArtworkCard from "@/components/ArtworkCard";

export default function GalleryGrid({
  artworks,
  priorityCount = 0,
  onOpenLightbox,
}: {
  artworks: Artwork[];
  /** Number of leading images to mark high-priority for LCP. */
  priorityCount?: number;
  /** When provided, clicking a card opens the lightbox at that card's index. */
  onOpenLightbox?: (index: number) => void;
}) {
  if (artworks.length === 0) {
    return (
      <p className="py-24 text-center font-body text-label-gray">
        No works match this selection yet.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.map((artwork, i) => (
        <li key={artwork.id}>
          <ArtworkCard
            artwork={artwork}
            priority={i < priorityCount}
            onOpenLightbox={onOpenLightbox ? () => onOpenLightbox(i) : undefined}
          />
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: Own the lightbox state in GalleryView and render it**

Replace the full contents of `src/components/GalleryView.tsx` with:

```tsx
"use client";

import { useMemo, useState } from "react";
import type { Artwork } from "@/types";
import { artworkCategories } from "@/data/taxonomies";
import FilterBar from "@/components/FilterBar";
import GalleryGrid from "@/components/GalleryGrid";
import Lightbox from "@/components/Lightbox";

export default function GalleryView({ artworks }: { artworks: Artwork[] }) {
  const [category, setCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
      return category === "All" || a.category === category;
    });
  }, [artworks, category]);

  return (
    <div>
      <div className="mb-10 border-y border-charcoal/10 py-6">
        <FilterBar
          label="Filter by category"
          options={artworkCategories}
          active={category}
          onChange={setCategory}
        />
      </div>

      <p className="mb-8 font-body text-xs uppercase tracking-[0.2em] text-label-gray">
        {filtered.length} {filtered.length === 1 ? "work" : "works"}
      </p>

      <GalleryGrid
        artworks={filtered}
        priorityCount={3}
        onOpenLightbox={setLightboxIndex}
      />

      {lightboxIndex !== null ? (
        <Lightbox
          artworks={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Run the build gate**

```bash
npm run build
```

Expected: `Compiled successfully`, no type errors, gallery and home routes prerender.

- [ ] **Step 5: Manual verification in dev server**

```bash
npm run dev
```

- On `/gallery`: click a thumbnail — the lightbox opens showing that artwork (not a navigation to the detail page).
- Press `ArrowRight`/`ArrowLeft` and click the on-screen ‹/› buttons — confirm it slides through artworks, wrapping from the last back to the first and vice versa.
- On a touchpad/touch device (or Chrome DevTools touch emulation), swipe left/right on the image — confirm it navigates.
- Filter to a single category (e.g. "Ceramics"), open the lightbox, and navigate — confirm it only cycles through ceramics pieces, not the full gallery.
- Press `Escape`, click the × button, and click the dark backdrop (not the image) — confirm each closes the lightbox, and keyboard focus returns to the thumbnail that was clicked.
- Press `Tab` repeatedly while the lightbox is open — confirm focus cycles only among the lightbox's own controls (close, prev, next, "View details"), never escaping to the page behind it.
- Click "View details →" — confirm it navigates to the correct `/gallery/[slug]` detail page.
- Enable "reduce motion" in OS accessibility settings (or DevTools rendering emulation) — confirm the lightbox still opens/closes but without the opacity transition.
- Visit `/` (home page) — confirm the Featured section's `ArtworkCard`s still link directly to their detail pages as before (no lightbox there).

- [ ] **Step 6: Commit**

```bash
git add src/components/ArtworkCard.tsx src/components/GalleryGrid.tsx src/components/GalleryView.tsx
git commit -m "Wire Lightbox into the Gallery page with filter-scoped slider navigation"
```
