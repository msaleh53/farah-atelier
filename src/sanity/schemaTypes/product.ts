import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TagIcon,
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
      name: 'type',
      type: 'string',
      options: {
        list: [
          { title: 'Original', value: 'Original' },
          { title: 'Limited Print', value: 'Limited Print' },
          { title: 'Open Edition Print', value: 'Open Edition Print' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artwork',
      title: 'Linked artwork',
      description: 'The original artwork this product depicts (if applicable)',
      type: 'reference',
      to: [{ type: 'artwork' }],
    }),
    defineField({
      name: 'edition',
      type: 'string',
      placeholder: 'e.g. Edition of 25, Open edition, Unique work',
    }),
    defineField({
      name: 'size',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Price (JOD)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
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
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      media: 'image',
    },
    prepare({ title, type, media }) {
      return {
        title,
        subtitle: type,
        media,
      }
    },
  },
})
