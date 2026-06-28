import { getPayloadClient } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import type { Artwork as PayloadArtwork } from '@payload-types'
import type { Artwork } from '@/types'

/** Map a Payload `artworks` doc onto the component-facing `Artwork` shape. */
function toArtwork(doc: PayloadArtwork): Artwork {
  return {
    id: String(doc.id),
    slug: doc.slug ?? '',
    title: doc.title ?? '',
    year: doc.year ?? 0,
    category: doc.category,
    medium: doc.medium ?? '',
    dimensions: doc.dimensions ?? '',
    featured: Boolean(doc.featured),
    image: mediaUrl(doc.image, 'card'),
    imageAlt: doc.imageAlt ?? '',
    story: doc.story ?? '',
  }
}

export async function getAllArtworks(): Promise<Artwork[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'artworks',
    sort: '-year',
    depth: 1,
    limit: 100,
    pagination: false,
  })
  return docs.map(toArtwork)
}

export async function getFeaturedArtworks(): Promise<Artwork[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'artworks',
    where: { featured: { equals: true } },
    sort: '-year',
    depth: 1,
    limit: 100,
    pagination: false,
  })
  return docs.map(toArtwork)
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'artworks',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ? toArtwork(docs[0]) : null
}

export async function getArtworkSlugs(): Promise<{ slug: string }[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'artworks',
    depth: 0,
    limit: 100,
    pagination: false,
    select: { slug: true },
  })
  return docs
    .map((d) => ({ slug: (d.slug as string) ?? '' }))
    .filter((d) => d.slug)
}
