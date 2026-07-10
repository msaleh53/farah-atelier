import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

import { Users } from './src/payload/collections/Users'
import { Media } from './src/payload/collections/Media'
import { Artworks } from './src/payload/collections/Artworks'
import { Posts } from './src/payload/collections/Posts'
import { SiteSettings } from './src/payload/globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export default buildConfig({
  serverURL,
  // Whitelist the deployment origin so Payload accepts the auth cookie on
  // mutations (uploads/saves). Without this, the admin renders but client-side
  // create/update POSTs come through unauthenticated → "You are not allowed to
  // perform this action." Local dev is same-origin so it works without it.
  cors: [serverURL],
  csrf: [serverURL],
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
  plugins: [
    // ── Image storage (R2 / S3) ───────────────────────────────────────────────
    // Only active when S3_BUCKET is set (i.e. in production).
    // Locally, uploads still go to the media/ directory on disk.
    ...(process.env.S3_BUCKET
      ? [
          s3Storage({
            collections: { media: true },
            bucket: process.env.S3_BUCKET,
            config: {
              endpoint: process.env.S3_ENDPOINT,
              region: process.env.S3_REGION || 'auto',
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
              },
            },
          }),
        ]
      : []),
  ],
})
