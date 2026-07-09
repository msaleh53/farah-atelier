import type { CollectionConfig } from 'payload'

/**
 * Uploaded images. Stored on local disk (`media/`) for now; a
 * `@payloadcms/storage-s3` plugin can be added in payload.config.ts at deploy
 * time without touching this collection.
 *
 * `imageSizes` bake the fixed crops the site needs — this replaces Sanity's
 * `urlFor().width().height().fit('crop')` calls. Each named size is exposed at
 * `doc.sizes.<name>.url`; the data-layer mapper (src/lib/media.ts) picks the
 * right one per surface. `crop: 'center'` + `position: 'centre'` keep the 4:5
 * frames the layout locks to.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  // Images are served over HTTP (next/image → /api/media/file/*), which enforces
  // collection access control — so read must be public. Writes stay admin-only.
  access: { read: () => true },
  upload: {
    // Read/write under <project>/media. Served same-origin via /api/media/file/*.
    staticDir: 'media',
    imageSizes: [
      // Gallery / featured cards (4:5)
      { name: 'card', width: 800, height: 1000, position: 'centre' },
      // Home hero (4:5)
      { name: 'hero', width: 1200, height: 1500, position: 'centre' },
      // Artist portrait, About + home intro (4:5)
      { name: 'portrait', width: 1000, height: 1250, position: 'centre' },
      // Small thumbnail for the admin list views
      { name: 'thumbnail', width: 400, height: 500, position: 'centre' },
    ],
    // Admin list/preview thumbnail
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description:
          'Optional fallback alt text. Each artwork/product also carries its own image description.',
      },
    },
  ],
}
