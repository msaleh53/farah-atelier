import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './src/payload/collections/Users'
import { Media } from './src/payload/collections/Media'
import { Artworks } from './src/payload/collections/Artworks'
import { Posts } from './src/payload/collections/Posts'
import { SiteSettings } from './src/payload/globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '· Portfolio CMS',
    },
  },
  collections: [Users, Media, Artworks, Posts],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
  }),
  sharp,
  // ── Image storage ───────────────────────────────────────────────────────────
  // Uploads currently live on local disk (Media.staticDir = 'media'). Hosted
  // platforms wipe that on redeploy, so before production add the S3/R2 adapter:
  //
  //   import { s3Storage } from '@payloadcms/storage-s3'
  //   plugins: [
  //     s3Storage({
  //       collections: { media: true },
  //       bucket: process.env.S3_BUCKET!,
  //       config: {
  //         endpoint: process.env.S3_ENDPOINT,            // R2/S3 endpoint
  //         region: process.env.S3_REGION || 'auto',
  //         credentials: {
  //           accessKeyId: process.env.S3_ACCESS_KEY_ID!,
  //           secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  //         },
  //       },
  //     }),
  //   ],
  plugins: [],
})
