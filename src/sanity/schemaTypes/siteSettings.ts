import { defineField, defineType, defineArrayMember } from 'sanity'
import { CogIcon } from '@sanity/icons'

// Requires alt text once the given image field has been filled in.
const requireAltIfImageSet =
  (imageField: string) => (alt: string | undefined, context: { parent?: unknown }) => {
    const parent = context.parent as Record<string, unknown> | undefined
    if (parent?.[imageField] && !alt) return 'Add alt text describing the image'
    return true
  }

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'hero', title: 'Home hero', default: true },
    { name: 'home', title: 'Home intro' },
    { name: 'about', title: 'About page' },
  ],
  fields: [
    // ---- Home hero ----
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
      validation: (rule) => rule.custom(requireAltIfImageSet('heroImage')),
    }),

    // ---- Shared artist portrait (used on Home intro + About) ----
    defineField({
      name: 'artistPortrait',
      title: 'Artist portrait',
      description: 'Shown on the home page intro and the About page.',
      type: 'image',
      options: { hotspot: true },
      group: ['home', 'about'],
    }),
    defineField({
      name: 'artistPortraitAlt',
      title: 'Portrait description (alt text)',
      type: 'string',
      group: ['home', 'about'],
      validation: (rule) => rule.custom(requireAltIfImageSet('artistPortrait')),
    }),

    // ---- Home intro ----
    defineField({
      name: 'homeIntro',
      title: 'Home intro text',
      description: 'Shown beside the portrait on the home page. Leave a blank line between paragraphs.',
      type: 'text',
      rows: 6,
      group: 'home',
    }),

    // ---- About page ----
    defineField({
      name: 'aboutLead',
      title: 'About lead statement',
      description: 'The large opening sentence on the About page.',
      type: 'text',
      rows: 3,
      group: 'about',
    }),
    defineField({
      name: 'aboutBody',
      title: 'About body text',
      description: 'The bio paragraphs. Leave a blank line between paragraphs.',
      type: 'text',
      rows: 10,
      group: 'about',
    }),
    defineField({
      name: 'timeline',
      title: 'Selected timeline',
      type: 'array',
      group: 'about',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'milestone',
          fields: [
            defineField({
              name: 'year',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'year', subtitle: 'text' } },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
