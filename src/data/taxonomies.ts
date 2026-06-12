// Static taxonomy constants, kept free of any Payload/server imports so they
// can be used from client components (e.g. GalleryView's FilterBar) without
// pulling the database driver into the browser bundle.

export const artworkCategories = [
  'Painting',
  'Works on Paper',
  'Mixed Media',
  'Sculpture',
] as const

export const productTypes = [
  'Original',
  'Limited Print',
  'Open Edition Print',
] as const
