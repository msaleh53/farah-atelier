import { sanityFetch } from '@/sanity/lib/live'
import type { Product } from '@/types'

const projection = `{
  "id": _id,
  "slug": slug.current,
  title,
  type,
  "artworkSlug": artwork->slug.current,
  edition,
  size,
  price,
  "image": image.asset->url,
  imageAlt
}`

const ALL_PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt asc) ${projection}`
const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] ${projection}`

export async function getAllProducts(): Promise<Product[]> {
  const { data } = await sanityFetch({ query: ALL_PRODUCTS_QUERY })
  return (data as Product[]) ?? []
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data } = await sanityFetch({ query: PRODUCT_BY_SLUG_QUERY, params: { slug } })
  return (data as Product | null) ?? null
}

export const productTypes = [
  'Original',
  'Limited Print',
  'Open Edition Print',
] as const
