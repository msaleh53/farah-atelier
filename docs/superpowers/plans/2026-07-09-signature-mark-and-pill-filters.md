# Signature Mark and Pill-Style Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the hand-drawn signature mark to the nav/footer and restyle the gallery filter buttons as pills, per `docs/superpowers/specs/2026-07-09-signature-mark-and-pill-filters-design.md`.

**Architecture:** Two independent, additive UI changes to existing client components (`Navbar.tsx`, `Footer.tsx`, `FilterBar.tsx`). No new components, no data/schema changes, no routing changes.

**Tech Stack:** Next.js 15 App Router, `next/image`, Tailwind CSS.

## Global Constraints

- There is no test suite in this repo. `npm run build` is the verification gate — it typechecks all routes and statically prerenders every page (per `CLAUDE.md`).
- Every `next/image` needs explicit `sizes` unless using fixed `width`/`height` (no `fill`) — these images use fixed `width`/`height`, so `sizes` is not required.
- Do not hardcode hex colors; use existing Tailwind tokens (`charcoal`, `canvas`, `label-gray`, `ochre`) from `tailwind.config.ts`.
- Decorative images (the signature mark, which is adjacent to visible "Farah Ramadan" text) use `alt=""`.
- Local `/public` assets are not subject to the `next.config.mjs` remote-image `images.domains` allowlist — no config change needed.

---

### Task 1: Add the signature mark asset and render it in the nav

**Files:**
- Create: `public/signature.png` (copied from the design bundle)
- Modify: `src/components/Navbar.tsx:1-2` (imports), `src/components/Navbar.tsx:40-45` (brand `Link`)

**Interfaces:**
- Produces: `public/signature.png`, a 505×935px transparent PNG, reused by Task 2 for the footer.

- [ ] **Step 1: Copy the asset into `public/`**

```bash
cp "/Users/mayadasaleh/Desktop/Farah-portfolio/artist-portfolio-redesign/project/assets/signature-charcoal.png" "/Users/mayadasaleh/Projects/farah-atelier/public/signature.png"
```

- [ ] **Step 2: Verify the file copied correctly**

Run: `file /Users/mayadasaleh/Projects/farah-atelier/public/signature.png`
Expected: `PNG image data, 505 x 935, 8-bit/color RGBA, non-interlaced`

- [ ] **Step 3: Add the `Image` import to `Navbar.tsx`**

In `src/components/Navbar.tsx`, the current imports are:

```tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site";
```

Change to:

```tsx
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site";
```

- [ ] **Step 4: Render the signature mark next to the wordmark**

The current brand `Link` in `src/components/Navbar.tsx` (around line 40) is:

```tsx
        <Link
          href="/"
          className="font-heading text-2xl tracking-wide text-charcoal"
        >
          {brandName}
        </Link>
```

Replace it with:

```tsx
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/signature.png"
            alt=""
            width={35}
            height={64}
            className="h-16 w-auto"
            priority
          />
          <span className="font-heading text-2xl tracking-wide text-charcoal">
            {brandName}
          </span>
        </Link>
```

(`width`/`height` of 35×64 preserve the source's ~0.54 aspect ratio at a 64px render height; the `h-16 w-auto` classes are what actually control the rendered size.)

- [ ] **Step 5: Run the dev server and visually confirm**

Run: `npm run dev`

Open `http://localhost:3000` (or the printed port) and confirm the signature mark renders to the left of "Farah Ramadan" in the nav, at roughly 64px tall, on every page (home, gallery, about, journal, contact). Stop the dev server after checking (`Ctrl+C`).

- [ ] **Step 6: Commit**

```bash
git add public/signature.png src/components/Navbar.tsx
git commit -m "Add signature mark to the nav brand block"
```

---

### Task 2: Render the signature mark in the footer

**Files:**
- Modify: `src/components/Footer.tsx:1-2` (imports), `src/components/Footer.tsx:12-17` (brand block)

**Interfaces:**
- Consumes: `public/signature.png` (produced by Task 1).

- [ ] **Step 1: Add the `Image` import to `Footer.tsx`**

Current imports in `src/components/Footer.tsx`:

```tsx
import Link from "next/link";
import { navLinks, site } from "@/lib/site";
import { getSiteContent } from "@/data/settings";
```

Change to:

```tsx
import Image from "next/image";
import Link from "next/link";
import { navLinks, site } from "@/lib/site";
import { getSiteContent } from "@/data/settings";
```

- [ ] **Step 2: Add the signature mark above the brand name**

The current first footer column in `src/components/Footer.tsx` (around line 12) is:

```tsx
        <div>
          <p className="font-heading text-2xl text-charcoal">{content.brandName}</p>
          <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-label-gray">
            {content.tagline}. Studio practice based in {content.location}.
          </p>
        </div>
```

Replace it with:

```tsx
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src="/signature.png"
              alt=""
              width={14}
              height={26}
              className="h-[26px] w-auto"
            />
            <p className="font-heading text-2xl text-charcoal">{content.brandName}</p>
          </div>
          <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-label-gray">
            {content.tagline}. Studio practice based in {content.location}.
          </p>
        </div>
```

- [ ] **Step 3: Run the dev server and visually confirm**

Run: `npm run dev`

Scroll to the footer on any page and confirm the signature mark renders at ~26px tall next to "{content.brandName}" in the first column. Stop the dev server after checking (`Ctrl+C`).

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "Add signature mark to the footer brand block"
```

---

### Task 3: Restyle gallery filters as pills

**Files:**
- Modify: `src/components/FilterBar.tsx:26-44` (button rendering)

**Interfaces:**
- Consumes: existing `FilterBarProps` (`options`, `active`, `onChange`, `allLabel`, `label`) — unchanged.
- Produces: same public interface; only the rendered button classes change. `GalleryView.tsx` (the sole consumer) needs no changes.

- [ ] **Step 1: Replace the button styling**

The current button block in `src/components/FilterBar.tsx` (lines 26-44) is:

```tsx
      {items.map((item) => {
        const isActive = item === active;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-pressed={isActive}
            className={`relative font-body text-xs uppercase tracking-[0.2em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
              isActive
                ? "text-charcoal after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-ochre"
                : "text-label-gray hover:text-charcoal"
            }`}
          >
            {item}
          </button>
        );
      })}
```

Replace it with:

```tsx
      {items.map((item) => {
        const isActive = item === active;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-pressed={isActive}
            className={`rounded-full border px-[18px] py-[9px] font-body text-xs uppercase tracking-[0.2em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
              isActive
                ? "border-charcoal bg-charcoal text-canvas"
                : "border-charcoal/10 text-label-gray hover:text-charcoal"
            }`}
          >
            {item}
          </button>
        );
      })}
```

- [ ] **Step 2: Run the dev server and visually confirm**

Run: `npm run dev`

Open `http://localhost:3000/gallery` and confirm:
- Filter buttons render as rounded pills.
- The active filter has a solid charcoal background with canvas (light) text.
- Inactive filters are outlined with muted (`label-gray`) text, and darken on hover.
- Tabbing to a filter button shows the ochre focus-visible ring.
- Clicking a filter still updates the visible gallery grid.

Stop the dev server after checking (`Ctrl+C`).

- [ ] **Step 3: Commit**

```bash
git add src/components/FilterBar.tsx
git commit -m "Restyle gallery filters as pill buttons"
```

---

### Task 4: Full build verification

**Files:** none (verification only)

- [ ] **Step 1: Run the production build**

Run: `npm run build`
Expected: Build completes with no TypeScript errors and no prerender failures across all routes (including the 8 artwork detail pages and the gallery page).

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 3: If both pass, this plan is complete.** No commit needed for this task (verification only, no file changes).
