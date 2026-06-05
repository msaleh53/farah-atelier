import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export const artwork = defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      type: 'number',
      validation: (rule) => rule.required().min(1900).max(new Date().getFullYear()),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Painting', value: 'Painting' },
          { title: 'Works on Paper', value: 'Works on Paper' },
          { title: 'Mixed Media', value: 'Mixed Media' },
          { title: 'Sculpture', value: 'Sculpture' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'medium',
      type: 'string',
    }),
    defineField({
      name: 'dimensions',
      type: 'string',
    }),
    defineField({
      name: 'availability',
      type: 'string',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Reserved', value: 'reserved' },
          { title: 'Sold', value: 'sold' },
        ],
        layout: 'radio',
      },
      initialValue: 'available',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image description (alt text)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'story',
      title: "The work (artist's note)",
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'price',
      title: 'Price (JOD)',
      description: 'Leave blank for "on request / inquiry only"',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      media: 'image',
      availability: 'availability',
    },
    prepare({ title, year, media, availability }) {
      return {
        title,
        subtitle: `${year} · ${availability}`,
        media,
      }
    },
  },
})
