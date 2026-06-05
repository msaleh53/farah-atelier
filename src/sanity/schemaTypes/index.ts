import { type SchemaTypeDefinition } from 'sanity'
import { artwork } from './artwork'
import { product } from './product'
import { siteSettings } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artwork, product, siteSettings],
}
