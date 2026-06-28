import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * On-demand revalidation, replacing the old 60s Sanity ISR. When content
 * changes in the admin, refresh the statically-prerendered pages that read it.
 *
 * `revalidatePath` only works inside a Next request context, so it's imported
 * lazily and guarded — during the seed script (plain Node) these calls are
 * simply skipped instead of throwing.
 */
function revalidate(paths: string[], dynamic?: { route: string }) {
  try {
    // Lazy require so importing this module in non-Next contexts is harmless.
    const { revalidatePath } = require('next/cache') as typeof import('next/cache')
    for (const path of paths) revalidatePath(path)
    if (dynamic) revalidatePath(dynamic.route, 'page')
  } catch {
    // Outside a Next request (e.g. seeding) — nothing to revalidate.
  }
}

/** Artworks appear on home, the gallery grid, and each detail page. */
export const revalidateArtwork: CollectionAfterChangeHook = ({ doc }) => {
  revalidate(['/', '/gallery'], { route: '/gallery/[slug]' })
  return doc
}
export const revalidateArtworkDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidate(['/', '/gallery'], { route: '/gallery/[slug]' })
  return doc
}

/** Journal posts appear on the journal index and each post detail page. */
export const revalidatePost: CollectionAfterChangeHook = ({ doc }) => {
  revalidate(['/journal'], { route: '/journal/[slug]' })
  return doc
}
export const revalidatePostDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidate(['/journal'], { route: '/journal/[slug]' })
  return doc
}

/**
 * Site Settings feeds the hero/about content AND site-wide chrome (footer,
 * navbar, SEO) plus every page's intro copy — so refresh the whole frontend.
 */
export const revalidateSettings: GlobalAfterChangeHook = ({ doc }) => {
  revalidate(['/', '/gallery', '/journal', '/about', '/contact'], {
    route: '/gallery/[slug]',
  })
  return doc
}
