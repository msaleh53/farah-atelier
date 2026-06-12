import { getPayloadClient } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'

export interface TimelineItem {
  year: string | null
  text: string | null
}

export interface SiteSettings {
  heroHeadline: string | null
  heroSubtitle: string | null
  /** Resolved URL of the `hero` crop, or null when no image is set. */
  heroImage: string | null
  heroImageAlt: string | null
  /** Resolved URL of the `portrait` crop, or null. */
  artistPortrait: string | null
  artistPortraitAlt: string | null
  homeIntro: string | null
  aboutLead: string | null
  aboutBody: string | null
  timeline: TimelineItem[] | null
}

/** Fallback portrait used until Farah uploads her own (Unsplash placeholder). */
export const FALLBACK_ARTIST_PORTRAIT =
  'https://images.unsplash.com/photo-1531123414780-f74242c2b052?auto=format&fit=crop&w=1200&q=80'

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'siteSettings', depth: 1 })
  if (!doc) return null

  return {
    heroHeadline: (doc.heroHeadline as string) ?? null,
    heroSubtitle: (doc.heroSubtitle as string) ?? null,
    heroImage: mediaUrl(doc.heroImage, 'hero') || null,
    heroImageAlt: (doc.heroImageAlt as string) ?? null,
    artistPortrait: mediaUrl(doc.artistPortrait, 'portrait') || null,
    artistPortraitAlt: (doc.artistPortraitAlt as string) ?? null,
    homeIntro: (doc.homeIntro as string) ?? null,
    aboutLead: (doc.aboutLead as string) ?? null,
    aboutBody: (doc.aboutBody as string) ?? null,
    timeline:
      (doc.timeline as TimelineItem[] | undefined)?.map((t) => ({
        year: t.year ?? null,
        text: t.text ?? null,
      })) ?? null,
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
