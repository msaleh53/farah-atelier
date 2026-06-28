import type { CollectionConfig } from 'payload'
import { formatSlug } from '../hooks/formatSlug'
import { revalidateArtwork, revalidateArtworkDelete } from '../hooks/revalidate'

/** Mirrors the `Artwork` contract in src/types/index.ts. */
export const Artworks: CollectionConfig = {
  slug: 'artworks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'availability', 'featured'],
    group: 'Content',
  },
  hooks: {
    afterChange: [revalidateArtwork],
    afterDelete: [revalidateArtworkDelete],
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
      name: 'year',
      type: 'number',
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: ['Painting', 'Works on Paper', 'Mixed Media', 'Sculpture'],
    },
    { name: 'medium', type: 'text' },
    { name: 'dimensions', type: 'text' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show on the homepage Featured section.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'imageAlt',
      type: 'text',
      admin: { description: 'Describe the image for screen readers / SEO.' },
    },
    {
      name: 'story',
      type: 'textarea',
      label: "The work (artist's note)",
    },
  ],
}
