import type { CollectionConfig } from 'payload'
import { formatSlug } from '../hooks/formatSlug'
import { revalidateProduct, revalidateProductDelete } from '../hooks/revalidate'

/** Mirrors the `Product` contract in src/types/index.ts. */
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'price'],
    group: 'Content',
  },
  hooks: {
    afterChange: [revalidateProduct],
    afterDelete: [revalidateProductDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      index: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-filled from the title if left blank.',
      },
      hooks: { beforeValidate: [formatSlug('title')] },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['Original', 'Limited Print', 'Open Edition Print'],
    },
    {
      name: 'artwork',
      type: 'relationship',
      relationTo: 'artworks',
      admin: {
        description: 'The original artwork this product depicts (if applicable).',
      },
    },
    {
      name: 'edition',
      type: 'text',
      admin: { placeholder: 'e.g. Edition of 25, Open edition, Unique work' },
    },
    { name: 'size', type: 'text' },
    {
      name: 'price',
      type: 'number',
      label: 'Price (JOD)',
      required: true,
      min: 0,
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'imageAlt',
      type: 'text',
      admin: { description: 'Describe the image for screen readers / SEO.' },
    },
  ],
}
