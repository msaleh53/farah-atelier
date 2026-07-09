# Signature mark + pill-style gallery filters

**Source:** Claude Design handoff bundle at `artist-portfolio-redesign/project/Farah Ramadan Portfolio (Logo 1c) - export-src.dc.html` (see `../../../Desktop/Farah-portfolio/artist-portfolio-redesign/`).

## Context

The redesign bundle is a full HTML/CSS/JS mockup of the site. Comparing it against the current implementation (`portfolio-redesign` branch) shows the two are already structurally aligned: same nav links, same page sections (Home/Gallery/About/Journal/Contact), same fonts (Cormorant + Inter), same content-driven approach via Payload. The mockup also includes a light/dark theme toggle, which was evaluated and explicitly deferred — the current site's color system is static Tailwind classes throughout every component, and wiring in a CSS-variable-driven theme touches too much surface for this pass.

What's left, and in scope for this spec, are two additive, low-risk visual changes:

1. A hand-drawn signature mark next to the "Farah Ramadan" wordmark in the nav and footer.
2. Pill-style gallery filter buttons, replacing the current underline-text filter style.

Both are isolated to existing components and don't touch data flow, Payload schema, or routing.

## 1. Signature mark

- Source asset: `artist-portfolio-redesign/project/assets/signature-charcoal.png` (505×935px PNG, transparent background). Only the charcoal variant is needed since the site stays light-only.
- Copy to `public/signature.png`.
- `src/components/Navbar.tsx`: render the image at 64px tall immediately to the left of the "Farah Ramadan" text, inside the existing `<Link href="/">` brand block. Decorative — `alt=""`.
- `src/components/Footer.tsx`: render the same image at ~26px tall next to the brand name in the first footer column. Decorative — `alt=""`.
- No `next.config.mjs` change: local `/public` assets bypass the remote-image allowlist that governs `next/image`.

## 2. Pill-style gallery filters

- `src/components/FilterBar.tsx` is the only consumer-facing filter component in the codebase (confirmed via grep — only used by `GalleryView.tsx`), so the restyle happens directly in that file rather than via a variant/new component.
- Replace the current underline-on-active treatment with rounded pill buttons matching the mockup:
  - Base: `rounded-full border px-[18px] py-[9px] font-body text-xs uppercase tracking-[0.2em] transition-colors`
  - Active: `bg-charcoal text-canvas border-charcoal`
  - Inactive: `border-charcoal/10 text-label-gray hover:text-charcoal`
  - Keep existing `role="group"`, `aria-pressed`, and `focus-visible:ring-ochre` accessibility behavior unchanged.

## Out of scope

- Dark mode / theme toggle (deferred, separate future pass).
- Any other mockup-only visual details (e.g. gallery column count toggle, contact page sidebar layout) — not requested, current implementation already covers the equivalent content.

## Verification

- `npm run build` — typechecks and prerenders every route, including the gallery page.
- Manual check in `npm run dev`: signature mark renders correctly in nav (all pages) and footer; gallery filter default/hover/active/focus-visible states match the pill style.
