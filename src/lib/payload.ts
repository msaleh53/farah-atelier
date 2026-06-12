import { getPayload, type Payload } from 'payload'
import config from '../../payload.config'

/**
 * Cached Payload Local API client. Server Components and the data helpers call
 * this to query content directly (no HTTP) — the replacement for the old
 * `sanityFetch`/GROQ client. The instance is memoised across the process so we
 * don't re-init Payload on every request.
 */
let cached: Promise<Payload> | null = null

export function getPayloadClient(): Promise<Payload> {
  if (!cached) cached = getPayload({ config })
  return cached
}
