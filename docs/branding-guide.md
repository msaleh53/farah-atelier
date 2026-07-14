# Farah Ramadan Atelier — Branding Guide

Extracted from the current implementation (`tailwind.config.ts`, `src/styles/globals.css`, `src/lib/fonts.ts`, `src/lib/site.ts`) and the live copy at farah-atelier.vercel.app as edited in `/admin`. This documents what's actually built and actually shown, not aspirational direction — treat it as the source of truth for staying consistent, and update it when the design system or live copy changes.

**Note:** `scripts/seed.ts` contains different, more literary placeholder copy ("Quiet paintings for considered spaces," "the thresholds of the Jordanian landscape") that is no longer what's live — it was overwritten via `/admin` at some point. Seed copy is a first-run default, not a voice reference; don't quote it for tone.

## Identity

- **Artist / brand name:** Farah Ramadan
- **Tagline:** Paintings, drawings, intaglio, ceramics, and watercolor
- **Location:** Amman, Jordan
- **Positioning (live headline):** "Classical techniques through a modern lens." — the site frames Farah as a student in training (classical/Old Masters technique) applying it to contemporary subjects, not as an established professional. It's a portfolio-in-progress, explicitly.
- **Commerce model:** Inquiry-first gallery — the site sells a *relationship with the work*, not a transaction. No checkout, no cart-as-payment; browsing leads to a conversation ("Commission a work," "Get in touch," "Say hello").

## Voice & Tone

Plain, direct, first-person, present-tense — a student narrating her own practice, not a gallery narrating an artist. No metaphor or landscape-poetics; specifics are named factually (medium, technique, status), not evoked. Live copy, verbatim:

> "Classical techniques through a modern lens."
> "As a fine art student, I use this portfolio to document my studies in oil painting, drawing, and visual projects. Here, you'll find a look into my daily practice, my growth, and the journey I'm on."
> "I am a final-year fine art student based in Amman, working primarily in oil painting, drawing, printmaking, and ceramics."
> "My current practice includes studying the techniques of the Old Masters, while also creating my own landscapes and contemporary portraits. I am currently preparing for my graduation exhibition while continuously exploring new ideas and searching for my distinct voice. I'm always excited to connect with the art community, explore residencies, or take on new creative projects."
> "Interested in my work or want to collaborate? Get in touch."
> "Explore the work, or reach out to say hello."

**Patterns to reuse:**
- First person, present/progressive tense ("I use," "I'm always excited," "searching for") — a practice-in-motion, not a finished body of work.
- Concrete media and process nouns (oil painting, drawing, printmaking, ceramics, Old Masters) instead of abstract art-speak.
- Openly names being a student and still developing ("searching for my distinct voice," "the journey I'm on") — don't polish this into a more authoritative/established-artist voice, it would misrepresent the actual positioning.
- Commerce/contact CTAs vary by context but stay conversational and low-pressure: "Commission a work" (hero), "Get in touch" (closing band), "Say hello" (about page) — none say "Buy," "Shop," or "Checkout."
- Section eyebrows are short and literal ("The Artist," "Selected Works," "In the Studio," "Say Hello") — not clever or figurative.

## Color System

Defined in `tailwind.config.ts`. Warm, muted, gallery-wall palette — no pure white/black, no saturated color except the single ochre accent.

| Token | Hex | Role |
|---|---|---|
| `canvas` | `#F4F1EA` | Primary background (warm off-white) |
| `charcoal` | `#1C1B1A` | Primary text, dark surfaces (near-black, warm) |
| `pigment` | `#2A2825` | Hover/active state for dark surfaces (slightly lighter than charcoal) |
| `parchment` | `#EAE5DA` | Secondary background (footer, cards) — one step warmer/darker than canvas |
| `ochre` | `#C49A45` | Sole accent — focus rings, selection highlight. Used sparingly and consistently, never as a second brand color |
| `label-gray` | `#76726A` | Secondary/muted text (captions, labels, eyebrows) |
| `sand` | `#B8AD98` | Tertiary accent, warm neutral between parchment and label-gray |

**Rule:** never hardcode hex values in components — always the Tailwind token. `::selection` uses `ochre/30`.

## Typography

| Role | Font | Tailwind class | Notes |
|---|---|---|---|
| Headings (h1–h4) | Cormorant Garamond | `font-heading` | Serif, editorial — weights 300–700 loaded |
| Body | Inter | `font-body` | Sans, weights 300–600 loaded |

Loaded via `next/font/google` in `src/lib/fonts.ts` as CSS variables (`--font-cormorant`, `--font-inter`), applied through the Tailwind `fontFamily` extension — never `<link>`-tag Google Fonts directly.

**Recurring text treatment — the "eyebrow":** `text-xs uppercase tracking-[0.25em] text-label-gray` (`.eyebrow` class). Used as a small label above section headings site-wide; this letter-spaced uppercase micro-label is a signature detail, not incidental.

## Spacing & Layout

- Page width: `.container-editorial` → `max-w-[1400px]`, responsive horizontal padding (`px-6` → `px-10` → `px-16`).
- No other custom spacing scale — standard Tailwind spacing throughout.

## Motion

- Custom easing token: `ease-editorial` = `cubic-bezier(0.22, 1, 0.36, 1)` — a soft decelerate, used on every transition (buttons, links, reveals). This specific curve is part of the brand's felt texture — don't substitute a default Tailwind ease.
- `.fade-up` utility: 0.8s fade + 16px rise, using the same easing — the standard scroll-reveal animation (see `Reveal` component).
- All motion respects `prefers-reduced-motion` globally (`globals.css`) — animation/transition durations collapse to ~0 when set.

## Components (reusable classes, `@layer components`)

| Class | Use | Visual signature |
|---|---|---|
| `.btn-primary` | Primary CTA | Solid charcoal fill, canvas text, uppercase tracked-out label, hover → pigment |
| `.btn-outline` | Secondary CTA | Charcoal outline, hover fills solid | 
| `.link-underline` | Inline text links | Underline animates in from the left on hover (0→100% width) |
| `.eyebrow` | Section/label micro-copy | See Typography above |

All interactive elements: `focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-canvas` — the ochre focus ring is the one place saturated color always appears; keep it exclusive to that role (don't reuse ochre as a decorative color elsewhere, it would dilute the focus signal).

## Imagery

- Full-bleed, editorial photography of artwork and studio process — no stock-photo gloss, no illustration/iconography as a visual layer.
- Every image ships an explicit `imageAlt`/`alt` — treated as content, not decoration (except intentionally decorative marks like the signature, which get `alt=""`).
- Image variants resolved via `mediaUrl()` (`src/lib/media.ts`): `card`, `hero`, `portrait` crops per context — don't reuse one crop across contexts it wasn't sized for.

## What NOT to do

- Don't introduce a second accent color alongside ochre — the palette's restraint is the point.
- Don't use a sans-serif for headings or a serif for body — the heading/body split is load-bearing to the "editorial" feel.
- Don't write commerce copy in checkout/buy language — everything routes through "inquiry" framing.
- Don't write new copy in a literary/poetic register (that's the unused seed placeholder, not the live voice) — match the plain, first-person, student-practice tone that's actually live.
- Don't hardcode hex colors, font names, or the easing curve — always the Tailwind tokens (`tailwind.config.ts` is the single source of truth).
