/**
 * Seeds Payload with the 8 artworks + 6 products + Site Settings text.
 *
 * Run with:  npm run seed
 *
 * Idempotent: skips any artwork/product whose slug already exists, and only
 * fills Site Settings fields that are still empty — so re-running never wipes
 * edits or uploaded images made in the admin.
 *
 * NOTE: images are intentionally omitted (originals were Unsplash placeholders).
 * Documents render an "Image coming soon" placeholder on the site until Farah
 * uploads real photos in /admin.
 */
import { config as loadEnv } from 'dotenv'
loadEnv({ path: '.env.local' })

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

const siteSettings = {
  heroHeadline: 'Quiet paintings for considered spaces.',
  heroSubtitle:
    'Farah Ramadan works in oil, paper and clay, drawing on the light and geology of Jordan. Each piece is available to acquire through a direct, inquiry-first conversation with the studio.',
  homeIntro:
    'For two decades I have painted the thresholds of the Jordanian landscape — the moment a colour turns, the line where dune meets sky. My work moves between oil, ink and clay, but always returns to restraint: the fewest marks that still hold a feeling.\n\nEvery work leaves the studio through conversation. I prefer to know where a painting is going, so each acquisition begins with a simple inquiry rather than a checkout.',
  aboutLead:
    'I make quiet work about the light and geology of Jordan — paintings, drawings and objects that ask to be lived with slowly.',
  aboutBody:
    'My practice moves between oil, ink and clay, but it is held together by restraint: the fewest marks that still carry a feeling. I work in long looking sessions, often returning to the same ridge, the same tide, until a single gesture holds it.\n\nMaterials matter. Sand from Wadi Rum is bound into the mixed-media panels; wood ash glazes the vessels; the works on paper are made in the field, drying in the sun. The landscape is not only the subject but, often, the medium.\n\nI prefer to know where a work is going. That is why everything leaves the studio through conversation rather than a checkout — an inquiry-first approach that lets each acquisition begin with care.',
  timeline: [
    { year: '2003', text: 'Begins formal study in painting and printmaking.' },
    { year: '2011', text: 'First solo exhibition of works on paper in Amman.' },
    { year: '2018', text: 'Expands the practice into clay and mixed media.' },
    { year: '2024', text: 'Opens the studio for direct, inquiry-first acquisition.' },
  ],
}

async function seed() {
  // Import the config AFTER env is loaded — buildConfig reads DATABASE_URL at
  // module-eval time.
  const { getPayload } = await import('payload')
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  // ── Artworks ──────────────────────────────────────────────────────────────
  const artworkIdBySlug = new Map<string, number>()
  for (const a of artworks) {
    const existing = await payload.find({
      collection: 'artworks',
      where: { slug: { equals: a.slug } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs[0]) {
      artworkIdBySlug.set(a.slug, existing.docs[0].id)
      payload.logger.info(`artwork exists, skipping: ${a.slug}`)
      continue
    }
    const created = await payload.create({
      collection: 'artworks',
      data: {
        slug: a.slug,
        title: a.title,
        year: a.year,
        category: a.category as never,
        medium: a.medium,
        dimensions: a.dimensions,
        availability: a.availability as never,
        featured: a.featured,
        imageAlt: a.imageAlt,
        story: a.story,
        price: a.price,
      },
    })
    artworkIdBySlug.set(a.slug, created.id)
    payload.logger.info(`created artwork: ${a.slug}`)
  }

  // ── Products (link to artworks by slug) ─────────────────────────────────────
  for (const p of products) {
    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: p.slug } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs[0]) {
      payload.logger.info(`product exists, skipping: ${p.slug}`)
      continue
    }
    const artworkId = p.artworkSlug ? artworkIdBySlug.get(p.artworkSlug) : undefined
    await payload.create({
      collection: 'products',
      data: {
        slug: p.slug,
        title: p.title,
        type: p.type as never,
        ...(artworkId ? { artwork: artworkId } : {}),
        edition: p.edition,
        size: p.size,
        price: p.price,
        imageAlt: p.imageAlt,
      },
    })
    payload.logger.info(`created product: ${p.slug}`)
  }

  // ── Site Settings (only fill empty fields) ──────────────────────────────────
  const current = await payload.findGlobal({ slug: 'siteSettings', depth: 0 })
  const currentRecord = current as unknown as Record<string, unknown>
  const data: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(siteSettings)) {
    const existingValue = currentRecord?.[key]
    const isEmpty =
      existingValue == null ||
      existingValue === '' ||
      (Array.isArray(existingValue) && existingValue.length === 0)
    if (isEmpty) data[key] = value
  }
  if (Object.keys(data).length > 0) {
    await payload.updateGlobal({ slug: 'siteSettings', data: data as never })
    payload.logger.info(`updated site settings: ${Object.keys(data).join(', ')}`)
  } else {
    payload.logger.info('site settings already populated, skipping')
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
