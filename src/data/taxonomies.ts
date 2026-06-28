// Static taxonomy constants, kept free of any Payload/server imports so they
// can be used from client components (e.g. GalleryView's FilterBar) without
// pulling the database driver into the browser bundle.

export const artworkCategories = [
  'Paintings',
  'Drawings',
  'Intaglio',
  'Ceramics',
  'Watercolor',
] as const
