import { type SchemaTypeDefinition } from 'sanity'
import { artwork } from './artwork'
import { product } from './product'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artwork, product],
}
