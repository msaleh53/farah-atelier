import type { GlobalConfig } from 'payload'
import { revalidateSettings } from '../hooks/revalidate'

/**
 * Singleton for editable home + about content. Mirrors the old Sanity
 * `siteSettings` schema, grouped with tabs (Home hero / Home intro / About).
 * Brand/name/email/location stay static in src/lib/site.ts.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  label: 'Site Settings',
  admin: { group: 'Content' },
  hooks: { afterChange: [revalidateSettings] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Home hero',
          fields: [
            {
              name: 'heroHeadline',
              type: 'text',
              maxLength: 80,
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'heroImageAlt',
              type: 'text',
              label: 'Hero image description (alt text)',
            },
          ],
        },
        {
          label: 'Home intro',
          fields: [
            {
              name: 'homeIntro',
              type: 'textarea',
              label: 'Home intro text',
              admin: {
                description:
                  'Shown beside the portrait on the home page. Leave a blank line between paragraphs.',
              },
            },
          ],
        },
        {
          label: 'About page',
          fields: [
            {
              name: 'aboutLead',
              type: 'textarea',
              label: 'About lead statement',
              admin: { description: 'The large opening sentence on the About page.' },
            },
            {
              name: 'aboutBody',
              type: 'textarea',
              label: 'About body text',
              admin: {
                description: 'The bio paragraphs. Leave a blank line between paragraphs.',
              },
            },
            {
              name: 'timeline',
              type: 'array',
              label: 'Selected timeline',
              fields: [
                { name: 'year', type: 'text', required: true },
                { name: 'text', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
    // Shared artist portrait (home intro + about). Kept outside the tabs so it's
    // visible regardless of which tab is open — it feeds two surfaces.
    {
      name: 'artistPortrait',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Shown on the home page intro and the About page.' },
    },
    {
      name: 'artistPortraitAlt',
      type: 'text',
      label: 'Portrait description (alt text)',
    },
  ],
}
