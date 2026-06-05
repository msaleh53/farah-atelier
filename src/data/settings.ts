import type { SanityImageSource } from '@sanity/image-url'
import { sanityFetch } from '@/sanity/lib/live'

export interface SiteSettings {
  heroHeadline: string | null
  heroSubtitle: string | null
  /** Raw Sanity image object (asset ref + hotspot + crop) for urlFor(). */
  heroImage: SanityImageSource | null
  /** Low-quality blur placeholder, queried separately from the asset metadata. */
  heroImageLqip: string | null
  heroImageAlt: string | null
}

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  heroHeadline,
  heroSubtitle,
  heroImage,
  "heroImageLqip": heroImage.asset->metadata.lqip,
  heroImageAlt
}`

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data } = await sanityFetch({ query: SETTINGS_QUERY })
  return (data as SiteSettings | null) ?? null
}
