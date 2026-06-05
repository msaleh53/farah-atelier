/**
 * Seeds Sanity with the original 8 artworks + 6 products from the old local data.
 *
 * Run with:  npm run seed
 * (which calls `sanity exec scripts/seed.ts --with-user-token`, authenticating
 *  with your logged-in Sanity user — no API token needed.)
 *
 * Idempotent: uses deterministic _ids (artwork-<slug> / product-<slug>) and
 * createOrReplace, so re-running updates rather than duplicates.
 *
 * NOTE: images are intentionally omitted — the originals were Unsplash
 * placeholders. Documents will show a "required image" warning in the Studio
 * until Farah uploads real photos. All text content is populated.
 */
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

type ArtworkSeed = {
  slug: string
  title: string
  year: number
  category: string
  medium: string
  dimensions: string
  availability: string
  featured: boolean
  imageAlt: string
  story: string
  price: number | null
}

type ProductSeed = {
  slug: string
  title: string
  type: string
  artworkSlug?: string
  edition: string
  size: string
  price: number
  imageAlt: string
}

const artworks: ArtworkSeed[] = [
  {
    slug: 'morning-tide',
    title: 'Morning Tide',
    year: 2024,
    category: 'Painting',
    medium: 'Oil on linen',
    dimensions: '120 × 90 cm',
    availability: 'available',
    featured: true,
    imageAlt:
      'Abstract oil painting in soft blues and ochre suggesting a calm tide at dawn.',
    story:
      'Painted over three weeks beside the Gulf of Aqaba, Morning Tide chases the single moment when night colour drains from the water and the first warmth arrives. The pigment is laid thin, then scraped, so the linen breathes through the surface.',
    price: 2400,
  },
  {
    slug: 'olive-grove-study',
    title: 'Olive Grove, Study',
    year: 2023,
    category: 'Works on Paper',
    medium: 'Ink and wash on cotton paper',
    dimensions: '56 × 42 cm',
    availability: 'available',
    featured: true,
    imageAlt:
      'Loose ink and wash study of silver-green olive trees on warm cotton paper.',
    story:
      'A field study made among century-old olive trees outside Ajloun. Working quickly in ink, I let the wash pool and dry in the sun, recording the heat as much as the form.',
    price: 680,
  },
  {
    slug: 'desert-geometry',
    title: 'Desert Geometry',
    year: 2024,
    category: 'Mixed Media',
    medium: 'Acrylic, sand and gold leaf on board',
    dimensions: '100 × 100 cm',
    availability: 'reserved',
    featured: true,
    imageAlt:
      'Square mixed-media work with sand texture, ochre planes and gold-leaf lines.',
    story:
      'Desert Geometry maps the architecture I find in dunes — wind-cut planes that read almost like drafting. Real sand from Wadi Rum is bound into the surface, and gold leaf marks the ridgelines where light gathers.',
    price: 3200,
  },
  {
    slug: 'night-figure',
    title: 'Night Figure',
    year: 2022,
    category: 'Painting',
    medium: 'Oil on canvas',
    dimensions: '90 × 70 cm',
    availability: 'sold',
    featured: false,
    imageAlt:
      'Moody figurative oil painting of a seated figure emerging from deep charcoal shadow.',
    story:
      'A portrait built almost entirely in shadow, Night Figure asks how little light a face needs to remain a face. The sitter was a fellow painter who held the pose by candle.',
    price: null,
  },
  {
    slug: 'parchment-horizon',
    title: 'Parchment Horizon',
    year: 2023,
    category: 'Works on Paper',
    medium: 'Charcoal and chalk on toned paper',
    dimensions: '70 × 50 cm',
    availability: 'available',
    featured: false,
    imageAlt:
      'Minimal charcoal and chalk horizon line drawn across warm toned paper.',
    story:
      'One line, many attempts. Parchment Horizon distils a week of looking at the same ridge into a single charcoal stroke balanced by chalk light.',
    price: 540,
  },
  {
    slug: 'vessel-i',
    title: 'Vessel I',
    year: 2024,
    category: 'Sculpture',
    medium: 'Hand-built stoneware, ash glaze',
    dimensions: '38 × 24 × 24 cm',
    availability: 'available',
    featured: false,
    imageAlt:
      'Hand-built stoneware vessel with a muted ash glaze on a neutral background.',
    story:
      'Vessel I began as a drawing that refused to stay flat. Coiled by hand and finished with a wood-ash glaze, it carries the same restraint as the works on paper.',
    price: 1100,
  },
  {
    slug: 'ochre-field',
    title: 'Ochre Field',
    year: 2023,
    category: 'Painting',
    medium: 'Oil and cold wax on panel',
    dimensions: '80 × 110 cm',
    availability: 'available',
    featured: true,
    imageAlt:
      'Warm ochre and umber abstract field painting with a softly scraped wax surface.',
    story:
      'Ochre Field is a meditation on a single pigment. Layered with cold wax and scraped back many times, it holds the colour of late afternoon on bare earth.',
    price: 1950,
  },
  {
    slug: 'fragment-series-iii',
    title: 'Fragment Series III',
    year: 2024,
    category: 'Mixed Media',
    medium: 'Collage, plaster and graphite on board',
    dimensions: '60 × 60 cm',
    availability: 'available',
    featured: false,
    imageAlt:
      'Textured collage with plaster, torn paper and graphite marks in muted neutrals.',
    story:
      'Built from torn studio drawings set into plaster, Fragment Series III treats failure as material — every discarded mark returns as part of the whole.',
    price: 920,
  },
]

const products: ProductSeed[] = [
  {
    slug: 'morning-tide-print',
    title: 'Morning Tide',
    type: 'Limited Print',
    artworkSlug: 'morning-tide',
    edition: 'Edition of 25',
    size: '60 × 45 cm',
    price: 220,
    imageAlt: 'Limited-edition giclée print of the abstract painting Morning Tide.',
  },
  {
    slug: 'ochre-field-print',
    title: 'Ochre Field',
    type: 'Limited Print',
    artworkSlug: 'ochre-field',
    edition: 'Edition of 25',
    size: '55 × 75 cm',
    price: 240,
    imageAlt: 'Limited-edition giclée print of the warm abstract Ochre Field.',
  },
  {
    slug: 'olive-grove-print',
    title: 'Olive Grove, Study',
    type: 'Open Edition Print',
    artworkSlug: 'olive-grove-study',
    edition: 'Open edition',
    size: '42 × 30 cm',
    price: 95,
    imageAlt: 'Open-edition print of the ink and wash study Olive Grove.',
  },
  {
    slug: 'parchment-horizon-print',
    title: 'Parchment Horizon',
    type: 'Open Edition Print',
    artworkSlug: 'parchment-horizon',
    edition: 'Open edition',
    size: '50 × 35 cm',
    price: 85,
    imageAlt: 'Open-edition print of the minimal charcoal work Parchment Horizon.',
  },
  {
    slug: 'desert-geometry-original',
    title: 'Desert Geometry',
    type: 'Original',
    artworkSlug: 'desert-geometry',
    edition: 'Unique work',
    size: '100 × 100 cm',
    price: 3200,
    imageAlt: 'Original mixed-media work Desert Geometry with sand and gold leaf.',
  },
  {
    slug: 'vessel-i-original',
    title: 'Vessel I',
    type: 'Original',
    artworkSlug: 'vessel-i',
    edition: 'Unique work',
    size: '38 × 24 × 24 cm',
    price: 1100,
    imageAlt: 'Original hand-built stoneware sculpture Vessel I with ash glaze.',
  },
]

async function seed() {
  const tx = client.transaction()

  for (const a of artworks) {
    tx.createOrReplace({
      _id: `artwork-${a.slug}`,
      _type: 'artwork',
      title: a.title,
      slug: { _type: 'slug', current: a.slug },
      year: a.year,
      category: a.category,
      medium: a.medium,
      dimensions: a.dimensions,
      availability: a.availability,
      featured: a.featured,
      imageAlt: a.imageAlt,
      story: a.story,
      // price omitted when null → renders as "on request"
      ...(a.price !== null ? { price: a.price } : {}),
    })
  }

  for (const p of products) {
    tx.createOrReplace({
      _id: `product-${p.slug}`,
      _type: 'product',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      type: p.type,
      ...(p.artworkSlug
        ? {
            artwork: {
              _type: 'reference',
              _ref: `artwork-${p.artworkSlug}`,
            },
          }
        : {}),
      edition: p.edition,
      size: p.size,
      price: p.price,
      imageAlt: p.imageAlt,
    })
  }

  const result = await tx.commit()
  console.log(
    `✅ Seeded ${artworks.length} artworks + ${products.length} products ` +
      `(${result.results.length} documents written).`
  )
  console.log('⚠️  Images still need uploading per document in the Studio.')
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
