import type { SanityImageSource } from '@sanity/image-url'
import { sanityFetch } from '@/sanity/lib/live'

export interface TimelineItem {
  year: string | null
  text: string | null
}

export interface SiteSettings {
  heroHeadline: string | null
  heroSubtitle: string | null
  /** Raw Sanity image object (asset ref + hotspot + crop) for urlFor(). */
  heroImage: SanityImageSource | null
  /** Low-quality blur placeholder, queried separately from the asset metadata. */
  heroImageLqip: string | null
  heroImageAlt: string | null
  artistPortrait: SanityImageSource | null
  artistPortraitLqip: string | null
  artistPortraitAlt: string | null
  homeIntro: string | null
  aboutLead: string | null
  aboutBody: string | null
  timeline: TimelineItem[] | null
}

/** Fallback portrait used until Farah uploads her own (Unsplash placeholder). */
export const FALLBACK_ARTIST_PORTRAIT =
  'https://images.unsplash.com/photo-1531123414780-f74242c2b052?auto=format&fit=crop&w=1200&q=80'

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  heroHeadline,
  heroSubtitle,
  heroImage,
  "heroImageLqip": heroImage.asset->metadata.lqip,
  heroImageAlt,
  artistPortrait,
  "artistPortraitLqip": artistPortrait.asset->metadata.lqip,
  artistPortraitAlt,
  homeIntro,
  aboutLead,
  aboutBody,
  timeline[]{ year, text }
}`

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data } = await sanityFetch({ query: SETTINGS_QUERY })
  return (data as SiteSettings | null) ?? null
}

/** Split a multi-paragraph text field (blank-line separated) into paragraphs. */
export function toParagraphs(text: string | null | undefined): string[] {
  if (!text) return []
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}
