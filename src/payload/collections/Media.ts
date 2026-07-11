import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

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
  // Payload 3's upload config has no built-in max-size option (the old
  // express-fileupload `limits.fileSize` was dropped). Files reach here via
  // clientUploads (direct browser → R2), so filesize is already known on the
  // incoming doc — reject oversized ones before the doc is created.
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (
          (operation === 'create' || operation === 'update') &&
          typeof data?.filesize === 'number' &&
          data.filesize > MAX_FILE_SIZE_BYTES
        ) {
          throw new APIError(
            `File exceeds the ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB upload limit.`,
            400,
          )
        }
        return data
      },
    ],
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
