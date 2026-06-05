import { sanityFetch } from '@/sanity/lib/live'

export interface SiteSettings {
  heroHeadline: string | null
  heroSubtitle: string | null
  heroImage: string | null
  heroImageAlt: string | null
}

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  heroHeadline,
  heroSubtitle,
  "heroImage": heroImage.asset->url,
  heroImageAlt
}`

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data } = await sanityFetch({ query: SETTINGS_QUERY })
  return (data as SiteSettings | null) ?? null
}
