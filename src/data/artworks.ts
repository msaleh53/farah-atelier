import { sanityFetch } from '@/sanity/lib/live'
import type { Artwork } from '@/types'

const projection = `{
  "id": _id,
  "slug": slug.current,
  title,
  year,
  category,
  medium,
  dimensions,
  availability,
  featured,
  "image": image.asset->url,
  imageAlt,
  story,
  price
}`

const ALL_ARTWORKS_QUERY = `*[_type == "artwork"] | order(year desc) ${projection}`
const FEATURED_ARTWORKS_QUERY = `*[_type == "artwork" && featured == true] | order(year desc) ${projection}`
const ARTWORK_BY_SLUG_QUERY = `*[_type == "artwork" && slug.current == $slug][0] ${projection}`
const ARTWORK_SLUGS_QUERY = `*[_type == "artwork"] { "slug": slug.current }`

export async function getAllArtworks(): Promise<Artwork[]> {
  const { data } = await sanityFetch({ query: ALL_ARTWORKS_QUERY })
  return (data as Artwork[]) ?? []
}

export async function getFeaturedArtworks(): Promise<Artwork[]> {
  const { data } = await sanityFetch({ query: FEATURED_ARTWORKS_QUERY })
  return (data as Artwork[]) ?? []
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const { data } = await sanityFetch({ query: ARTWORK_BY_SLUG_QUERY, params: { slug } })
  return (data as Artwork | null) ?? null
}

export async function getArtworkSlugs(): Promise<{ slug: string }[]> {
  const { data } = await sanityFetch({ query: ARTWORK_SLUGS_QUERY })
  return (data as { slug: string }[]) ?? []
}

export const artworkCategories = [
  'Painting',
  'Works on Paper',
  'Mixed Media',
  'Sculpture',
] as const
