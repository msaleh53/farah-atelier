import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [{ name: 'hero', title: 'Home hero', default: true }],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero headline',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero subtitle',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Hero image description (alt text)',
      type: 'string',
      group: 'hero',
      validation: (rule) =>
        rule.custom((alt, context) => {
          const parent = context.parent as { heroImage?: unknown } | undefined
          if (parent?.heroImage && !alt) {
            return 'Add alt text describing the hero image'
          }
          return true
        }),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
