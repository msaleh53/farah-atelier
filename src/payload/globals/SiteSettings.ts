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
            {
              name: 'heroPrimaryCta',
              type: 'text',
              label: 'Primary button label',
              admin: { placeholder: 'View the Gallery' },
            },
            {
              name: 'heroSecondaryCta',
              type: 'text',
              label: 'Secondary button label',
              admin: { placeholder: 'Commission a Work' },
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
              name: 'exhibitions',
              type: 'array',
              label: 'Exhibitions',
              fields: [
                { name: 'year', type: 'text', required: true },
                { name: 'text', type: 'text', required: true },
              ],
            },
            {
              name: 'volunteering',
              type: 'array',
              label: 'Volunteering & community',
              fields: [
                { name: 'year', type: 'text', required: true },
                { name: 'text', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Studio & contact',
          description:
            'Brand, contact details and SEO blurb. Shown in the footer, contact page and search results.',
          fields: [
            { name: 'brandName', type: 'text', admin: { description: 'Wordmark in the header & footer. Default: Atelier.' } },
            { name: 'tagline', type: 'text' },
            { name: 'location', type: 'text', admin: { placeholder: 'Amman, Jordan' } },
            { name: 'email', type: 'email' },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social links',
              admin: { description: 'Shown in the footer, e.g. Instagram, Behance, LinkedIn.' },
              fields: [
                { name: 'platform', type: 'text', required: true, admin: { placeholder: 'Instagram' } },
                { name: 'url', type: 'text', required: true, admin: { placeholder: 'https://instagram.com/...' } },
              ],
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
              admin: { description: 'Shown in the navbar and footer.' },
            },
            {
              name: 'footerExploreLabel',
              type: 'text',
              admin: { placeholder: 'Explore' },
            },
            {
              name: 'footerStudioLabel',
              type: 'text',
              admin: { placeholder: 'Studio' },
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              label: 'Default SEO description',
              admin: { description: 'Used as the site-wide search/social description.' },
            },
          ],
        },
        {
          label: 'Page intros',
          description: 'The eyebrow + intro paragraph at the top of each page, and the home/about call-to-action headings.',
          fields: [
            { name: 'galleryEyebrow', type: 'text' },
            { name: 'galleryIntro', type: 'textarea' },
            { name: 'contactEyebrow', type: 'text' },
            { name: 'contactIntro', type: 'textarea' },
            {
              name: 'contactResponseTime',
              type: 'text',
              admin: { placeholder: 'Within two business days' },
            },
            { name: 'contactNote', type: 'textarea', admin: { description: 'The fine print under the contact details.' } },
            {
              name: 'contactAsideEyebrow',
              type: 'text',
              label: 'Contact sidebar eyebrow',
              admin: { placeholder: 'The studio' },
            },
            {
              name: 'contactEmailLabel',
              type: 'text',
              admin: { placeholder: 'Email' },
            },
            {
              name: 'contactLocationLabel',
              type: 'text',
              admin: { placeholder: 'Location' },
            },
            {
              name: 'contactResponseTimeLabel',
              type: 'text',
              admin: { placeholder: 'Response time' },
            },
            { name: 'homeFeaturedEyebrow', type: 'text', admin: { placeholder: 'Selected works' } },
            { name: 'homeFeaturedTitle', type: 'text', admin: { placeholder: 'Featured' } },
            {
              name: 'homeIntroEyebrow',
              type: 'text',
              label: 'Home artist intro eyebrow',
              admin: { placeholder: 'In the studio' },
            },
            { name: 'homeClosingEyebrow', type: 'text', admin: { placeholder: 'Acquire a work' } },
            { name: 'homeClosingHeading', type: 'textarea' },
            { name: 'aboutCtaHeading', type: 'textarea' },
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
