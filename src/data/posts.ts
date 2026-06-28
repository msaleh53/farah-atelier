import { getPayloadClient } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import type { Post as PayloadPost } from '@payload-types'
import type { Post } from '@/types'

function toPost(doc: PayloadPost): Post {
  return {
    id: String(doc.id),
    slug: doc.slug ?? '',
    title: doc.title ?? '',
    publishedAt: doc.publishedAt ?? '',
    coverImage: mediaUrl(doc.coverImage, 'card'),
    coverImageAlt: doc.coverImageAlt ?? '',
    excerpt: doc.excerpt ?? '',
    body: (doc.body as unknown) ?? null,
    tags: (doc.tags ?? []).map((t) => t.tag).filter(Boolean) as string[],
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    depth: 1,
    limit: 100,
    pagination: false,
  })
  return docs.map(toPost)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ? toPost(docs[0]) : null
}

export async function getPostSlugs(): Promise<{ slug: string }[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 100,
    pagination: false,
    select: { slug: true },
  })
  return docs
    .map((d) => ({ slug: (d.slug as string) ?? '' }))
    .filter((d) => d.slug)
}
