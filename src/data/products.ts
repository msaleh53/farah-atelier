import { getPayloadClient } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import type { Product as PayloadProduct } from '@payload-types'
import type { Product } from '@/types'

/** Map a Payload `products` doc onto the component-facing `Product` shape. */
function toProduct(doc: PayloadProduct): Product {
  // `artwork` is a relationship: populated object (depth>=1) or an id.
  const artwork = doc.artwork
  const artworkSlug =
    artwork && typeof artwork === 'object' ? artwork.slug : undefined

  return {
    id: String(doc.id),
    slug: doc.slug ?? '',
    title: doc.title ?? '',
    type: doc.type,
    ...(artworkSlug ? { artworkSlug } : {}),
    edition: doc.edition ?? '',
    size: doc.size ?? '',
    price: doc.price ?? 0,
    image: mediaUrl(doc.image, 'card'),
    imageAlt: doc.imageAlt ?? '',
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    sort: 'createdAt',
    depth: 1,
    limit: 100,
    pagination: false,
  })
  return docs.map(toProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ? toProduct(docs[0]) : null
}
