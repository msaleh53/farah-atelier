/**
 * Turn a populated Payload `upload` field (a Media doc) into a plain URL string
 * for `next/image`, picking a baked size variant when available.
 *
 * The Media collection generates fixed crops (`card`, `hero`, `portrait`,
 * `thumbnail`) — see src/payload/collections/Media.ts. This replaces Sanity's
 * `urlFor().width().height().fit('crop')` chains; the crop now happens on
 * upload, so the data layer just selects the right pre-cropped URL.
 *
 * Falls back to the original `url` if the requested size is missing, and
 * returns `""` when there's no image (callers treat empty as "no image", which
 * the components already render as an "Image coming soon" placeholder).
 */
export type MediaSize = 'card' | 'hero' | 'portrait' | 'thumbnail'

type SizeMap = Partial<Record<string, { url?: string | null } | null>>
type PopulatedMedia = {
  url?: string | null
  width?: number | null
  height?: number | null
  sizes?: SizeMap | null
}

export function mediaUrl(
  image: unknown,
  size?: MediaSize,
): string {
  // depth=0 leaves the field as an id (number/string) — not usable as a URL.
  if (!image || typeof image !== 'object') return ''
  const media = image as PopulatedMedia
  if (size) {
    const sized = media.sizes?.[size]?.url
    if (sized) return sized
  }
  return media.url ?? ''
}

export interface FullImage {
  url: string
  width: number
  height: number
}

/**
 * The original, uncropped upload plus its true dimensions — unlike every
 * named size in `imageSizes` (Media.ts), which are all baked 4:5 crops for
 * grid/hero tiling. Surfaces that need to show an artwork's real composition
 * (the detail page, the lightbox) should use this instead of `mediaUrl`.
 */
export function mediaFull(image: unknown): FullImage | null {
  if (!image || typeof image !== 'object') return null
  const media = image as PopulatedMedia
  if (!media.url || !media.width || !media.height) return null
  return { url: media.url, width: media.width, height: media.height }
}
