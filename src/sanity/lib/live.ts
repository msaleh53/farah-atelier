import { type QueryParams } from 'next-sanity'
import { client } from './client'

// Revalidate every 60 seconds so Farah's edits appear within a minute.
const DEFAULT_REVALIDATE = 60

export async function sanityFetch<T = unknown>({
  query,
  params = {},
  revalidate = DEFAULT_REVALIDATE,
}: {
  query: string
  params?: QueryParams
  revalidate?: number | false
}): Promise<{ data: T }> {
  const data = await client.fetch<T>(query, params, {
    next: { revalidate },
  })
  return { data }
}
