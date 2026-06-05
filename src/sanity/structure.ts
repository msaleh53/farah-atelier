import type { StructureResolver } from 'sanity/structure'
import { ImageIcon, TagIcon } from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Studio')
    .items([
      S.documentTypeListItem('artwork').title('Artworks').icon(ImageIcon),
      S.documentTypeListItem('product').title('Products').icon(TagIcon),
    ])
