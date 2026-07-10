import { cache } from 'react'
import { getPayloadClient } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import type { SiteSetting } from '@payload-types'

/**
 * Single source of the Site Settings global per request. Wrapped in React
 * `cache` so the several consumers (layout, footer, pages) share one DB read.
 */
const getRawSettings = cache(async (): Promise<SiteSetting | null> => {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'siteSettings', depth: 1 })
  return (doc as SiteSetting | null) ?? null
})

export interface CVItem {
  year: string | null
  text: string | null
}

export interface SiteSettings {
  heroHeadline: string | null
  heroSubtitle: string | null
  /** Resolved URL of the `hero` crop, or null when no image is set. */
  heroImage: string | null
  heroImageAlt: string | null
  heroPrimaryCta: string | null
  heroSecondaryCta: string | null
  /** Resolved URL of the `portrait` crop, or null. */
  artistPortrait: string | null
  artistPortraitAlt: string | null
  homeIntro: string | null
  aboutLead: string | null
  aboutBody: string | null
  exhibitions: CVItem[] | null
  volunteering: CVItem[] | null
}

/** Fallback portrait used until Farah uploads her own (Unsplash placeholder). */
export const FALLBACK_ARTIST_PORTRAIT =
  'https://images.unsplash.com/photo-1531123414780-f74242c2b052?auto=format&fit=crop&w=1200&q=80'

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const doc = await getRawSettings()
  if (!doc) return null

  return {
    heroHeadline: doc.heroHeadline ?? null,
    heroSubtitle: doc.heroSubtitle ?? null,
    heroImage: mediaUrl(doc.heroImage, 'hero') || null,
    heroImageAlt: doc.heroImageAlt ?? null,
    heroPrimaryCta: doc.heroPrimaryCta ?? null,
    heroSecondaryCta: doc.heroSecondaryCta ?? null,
    artistPortrait: mediaUrl(doc.artistPortrait, 'portrait') || null,
    artistPortraitAlt: doc.artistPortraitAlt ?? null,
    homeIntro: doc.homeIntro ?? null,
    aboutLead: doc.aboutLead ?? null,
    aboutBody: doc.aboutBody ?? null,
    exhibitions:
      doc.exhibitions?.map((t) => ({
        year: t.year ?? null,
        text: t.text ?? null,
      })) ?? null,
    volunteering:
      doc.volunteering?.map((t) => ({
        year: t.year ?? null,
        text: t.text ?? null,
      })) ?? null,
  }
}

// ── Studio details + per-page copy ──────────────────────────────────────────
// Editable in admin (Site Settings → "Studio & contact" / "Page intros"), each
// falling back to a hard default so the site reads well before anything is set.
// `site` (src/lib/site.ts) stays the client-safe static source for values that
// rarely change (artist name, nav links) and the defaults below.

import { site } from '@/lib/site'

export interface SocialLink {
  platform: string
  url: string
}

export interface SiteContent {
  brandName: string
  tagline: string
  location: string
  email: string
  socialLinks: SocialLink[]
  /** Resolved logo URL, or null when no upload is set. */
  logo: string | null
  seoDescription: string
  gallery: { eyebrow: string; intro: string }
  contact: {
    eyebrow: string
    intro: string
    responseTime: string
    note: string
    asideEyebrow: string
    emailLabel: string
    locationLabel: string
    responseTimeLabel: string
  }
  home: {
    featuredEyebrow: string
    featuredTitle: string
    introEyebrow: string
    closingEyebrow: string
    closingHeading: string
  }
  about: { ctaHeading: string }
  footer: { exploreLabel: string; studioLabel: string }
}

const DEFAULTS = {
  galleryEyebrow: 'Selected works',
  galleryIntro:
    'A continuously evolving body of work across painting, drawing, and mixed media. Select any piece to read its story.',
  contactEyebrow: 'Get in touch',
  contactIntro:
    'Whether you have your eye on a particular piece or want something made for your space, every conversation starts here.',
  contactResponseTime: 'Within two business days',
  contactNote:
    'I try to respond to all messages within two business days.',
  contactAsideEyebrow: 'The studio',
  contactEmailLabel: 'Email',
  contactLocationLabel: 'Location',
  contactResponseTimeLabel: 'Response time',
  homeFeaturedEyebrow: 'Selected works',
  homeFeaturedTitle: 'Featured',
  homeIntroEyebrow: 'In the studio',
  homeClosingEyebrow: 'Say hello',
  homeClosingHeading: 'Interested in my work or want to collaborate? Get in touch.',
  aboutCtaHeading: 'Explore the work, or reach out to say hello.',
  footerExploreLabel: 'Explore',
  footerStudioLabel: 'Studio',
} as const

/** Use the CMS value when it's a non-empty string, otherwise the fallback. */
function pick(value: string | null | undefined, fallback: string): string {
  const trimmed = typeof value === 'string' ? value.trim() : ''
  return trimmed.length > 0 ? trimmed : fallback
}

/** Resolved studio details + page copy, CMS over static defaults. */
export async function getSiteContent(): Promise<SiteContent> {
  const doc = await getRawSettings()
  const socialLinks: SocialLink[] =
    doc?.socialLinks
      ?.filter((link): link is { platform: string; url: string; id?: string | null } =>
        Boolean(link.platform && link.url),
      )
      .map((link) => ({ platform: link.platform, url: link.url })) ??
    (site.instagram ? [{ platform: 'Instagram', url: site.instagram }] : [])

  return {
    brandName: pick(doc?.brandName, site.name),
    tagline: pick(doc?.tagline, site.tagline),
    location: pick(doc?.location, site.location),
    email: pick(doc?.email, site.email),
    socialLinks,
    logo: mediaUrl(doc?.logo) || null,
    seoDescription: pick(doc?.seoDescription, site.description),
    gallery: {
      eyebrow: pick(doc?.galleryEyebrow, DEFAULTS.galleryEyebrow),
      intro: pick(doc?.galleryIntro, DEFAULTS.galleryIntro),
    },
    contact: {
      eyebrow: pick(doc?.contactEyebrow, DEFAULTS.contactEyebrow),
      intro: pick(doc?.contactIntro, DEFAULTS.contactIntro),
      responseTime: pick(doc?.contactResponseTime, DEFAULTS.contactResponseTime),
      note: pick(doc?.contactNote, DEFAULTS.contactNote),
      asideEyebrow: pick(doc?.contactAsideEyebrow, DEFAULTS.contactAsideEyebrow),
      emailLabel: pick(doc?.contactEmailLabel, DEFAULTS.contactEmailLabel),
      locationLabel: pick(doc?.contactLocationLabel, DEFAULTS.contactLocationLabel),
      responseTimeLabel: pick(doc?.contactResponseTimeLabel, DEFAULTS.contactResponseTimeLabel),
    },
    home: {
      featuredEyebrow: pick(doc?.homeFeaturedEyebrow, DEFAULTS.homeFeaturedEyebrow),
      featuredTitle: pick(doc?.homeFeaturedTitle, DEFAULTS.homeFeaturedTitle),
      introEyebrow: pick(doc?.homeIntroEyebrow, DEFAULTS.homeIntroEyebrow),
      closingEyebrow: pick(doc?.homeClosingEyebrow, DEFAULTS.homeClosingEyebrow),
      closingHeading: pick(doc?.homeClosingHeading, DEFAULTS.homeClosingHeading),
    },
    about: {
      ctaHeading: pick(doc?.aboutCtaHeading, DEFAULTS.aboutCtaHeading),
    },
    footer: {
      exploreLabel: pick(doc?.footerExploreLabel, DEFAULTS.footerExploreLabel),
      studioLabel: pick(doc?.footerStudioLabel, DEFAULTS.footerStudioLabel),
    },
  }
}

/** Split a multi-paragraph text field (blank-line separated) into paragraphs. */
export function toParagraphs(text: string | null | undefined): string[] {
  if (!text) return []
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}
