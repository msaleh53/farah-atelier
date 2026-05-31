# Artist Website PRD

## Product Vision
Build a premium artist portfolio + shop website with a museum/editorial aesthetic for showcasing artwork and handling inquiry-based purchases.

## Goals
- Showcase artwork elegantly
- Sell originals and prints through inquiry-first flow
- Responsive desktop/mobile experience
- Production-quality architecture

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript
- next/image

## Design System

### Typography
- Headings: Cormorant Garamond
- Body/UI: Inter

### Colors
- Canvas Light: #F4F1EA
- Atelier Charcoal: #1C1B1A
- Master Pigment: #2A2825
- Parchment White: #EAE5DA
- Antiqued Ochre: #C49A45
- Museum Label Gray: #76726A

## UX Principles
- Artwork-first layouts
- Generous whitespace
- Minimal UI chrome
- Editorial typography

## Information Architecture
- Home
- Gallery
- Artwork Detail
- Shop
- About
- Contact
- Cart

## Component Architecture
- Navbar
- Footer
- Hero
- ArtworkCard
- GalleryGrid
- ProductCard
- FilterBar
- InquiryForm
- CartDrawer

## Folder Structure
src/
- app/
- components/
- data/
- lib/
- styles/
- types/

## Page Requirements
### Home
Hero section, featured works, artist intro, CTA buttons.

### Gallery
Filterable artwork grid.

### Artwork Detail
Large image, metadata, story, inquiry CTA.

### Shop
Products, cart UI, inquiry purchase flow.

### Contact
Commission + inquiry form.

## Commerce Strategy
V1: inquiry-first purchase flow (Jordan-friendly).

Artwork -> Inquiry -> Artist Contact -> Manual Sale

## Accessibility
- Keyboard navigation
- Alt text for images
- WCAG AA contrast

## SEO
- Metadata per page
- Semantic HTML
- Optimized image loading

## Performance
- Use next/image
- Lazy load images
- Responsive assets

## Future Roadmap
- Sanity CMS
- Payments integration
