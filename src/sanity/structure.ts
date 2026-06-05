import type { StructureResolver } from 'sanity/structure'
import { CogIcon, ImageIcon, TagIcon } from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Studio')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        ),
      S.divider(),
      S.documentTypeListItem('artwork').title('Artworks').icon(ImageIcon),
      S.documentTypeListItem('product').title('Products').icon(TagIcon),
    ])
