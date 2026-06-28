import type { CollectionConfig } from 'payload'
import { formatSlug } from '../hooks/formatSlug'
import { revalidatePost, revalidatePostDelete } from '../hooks/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'tags'],
    group: 'Content',
  },
  hooks: {
    afterChange: [revalidatePost],
    afterDelete: [revalidatePostDelete],
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
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'coverImageAlt',
      type: 'text',
      admin: { description: 'Describe the image for screen readers / SEO.' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'Short summary shown in the journal listing and used for SEO.' },
    },
    { name: 'body', type: 'richText' },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text', required: true }],
      admin: { description: 'e.g. Process, Exhibition, Sketchbook' },
    },
  ],
}
