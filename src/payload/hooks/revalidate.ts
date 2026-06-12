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

/** Products appear on the shop and can surface a "print available" link on details. */
export const revalidateProduct: CollectionAfterChangeHook = ({ doc }) => {
  revalidate(['/shop'], { route: '/gallery/[slug]' })
  return doc
}
export const revalidateProductDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidate(['/shop'], { route: '/gallery/[slug]' })
  return doc
}

/** Site Settings feeds the home hero/intro and the About page. */
export const revalidateSettings: GlobalAfterChangeHook = ({ doc }) => {
  revalidate(['/', '/about'])
  return doc
}
