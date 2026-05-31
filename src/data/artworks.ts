import type { Artwork } from "@/types";

export const artworks: Artwork[] = [
  {
    id: "aw-01",
    slug: "morning-tide",
    title: "Morning Tide",
    year: 2024,
    category: "Painting",
    medium: "Oil on linen",
    dimensions: "120 × 90 cm",
    availability: "available",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=80",
    imageAlt:
      "Abstract oil painting in soft blues and ochre suggesting a calm tide at dawn.",
    story:
      "Painted over three weeks beside the Gulf of Aqaba, Morning Tide chases the single moment when night colour drains from the water and the first warmth arrives. The pigment is laid thin, then scraped, so the linen breathes through the surface.",
    price: 2400,
  },
  {
    id: "aw-02",
    slug: "olive-grove-study",
    title: "Olive Grove, Study",
    year: 2023,
    category: "Works on Paper",
    medium: "Ink and wash on cotton paper",
    dimensions: "56 × 42 cm",
    availability: "available",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?auto=format&fit=crop&w=1200&q=80",
    imageAlt:
      "Loose ink and wash study of silver-green olive trees on warm cotton paper.",
    story:
      "A field study made among century-old olive trees outside Ajloun. Working quickly in ink, I let the wash pool and dry in the sun, recording the heat as much as the form.",
    price: 680,
  },
  {
    id: "aw-03",
    slug: "desert-geometry",
    title: "Desert Geometry",
    year: 2024,
    category: "Mixed Media",
    medium: "Acrylic, sand and gold leaf on board",
    dimensions: "100 × 100 cm",
    availability: "reserved",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=1200&q=80",
    imageAlt:
      "Square mixed-media work with sand texture, ochre planes and gold-leaf lines.",
    story:
      "Desert Geometry maps the architecture I find in dunes — wind-cut planes that read almost like drafting. Real sand from Wadi Rum is bound into the surface, and gold leaf marks the ridgelines where light gathers.",
    price: 3200,
  },
  {
    id: "aw-04",
    slug: "night-figure",
    title: "Night Figure",
    year: 2022,
    category: "Painting",
    medium: "Oil on canvas",
    dimensions: "90 × 70 cm",
    availability: "sold",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80",
    imageAlt:
      "Moody figurative oil painting of a seated figure emerging from deep charcoal shadow.",
    story:
      "A portrait built almost entirely in shadow, Night Figure asks how little light a face needs to remain a face. The sitter was a fellow painter who held the pose by candle.",
    price: null,
  },
  {
    id: "aw-05",
    slug: "parchment-horizon",
    title: "Parchment Horizon",
    year: 2023,
    category: "Works on Paper",
    medium: "Charcoal and chalk on toned paper",
    dimensions: "70 × 50 cm",
    availability: "available",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?auto=format&fit=crop&w=1200&q=80",
    imageAlt:
      "Minimal charcoal and chalk horizon line drawn across warm toned paper.",
    story:
      "One line, many attempts. Parchment Horizon distils a week of looking at the same ridge into a single charcoal stroke balanced by chalk light.",
    price: 540,
  },
  {
    id: "aw-06",
    slug: "vessel-i",
    title: "Vessel I",
    year: 2024,
    category: "Sculpture",
    medium: "Hand-built stoneware, ash glaze",
    dimensions: "38 × 24 × 24 cm",
    availability: "available",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80",
    imageAlt:
      "Hand-built stoneware vessel with a muted ash glaze on a neutral background.",
    story:
      "Vessel I began as a drawing that refused to stay flat. Coiled by hand and finished with a wood-ash glaze, it carries the same restraint as the works on paper.",
    price: 1100,
  },
  {
    id: "aw-07",
    slug: "ochre-field",
    title: "Ochre Field",
    year: 2023,
    category: "Painting",
    medium: "Oil and cold wax on panel",
    dimensions: "80 × 110 cm",
    availability: "available",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1502759683299-cdcd6974244f?auto=format&fit=crop&w=1200&q=80",
    imageAlt:
      "Warm ochre and umber abstract field painting with a softly scraped wax surface.",
    story:
      "Ochre Field is a meditation on a single pigment. Layered with cold wax and scraped back many times, it holds the colour of late afternoon on bare earth.",
    price: 1950,
  },
  {
    id: "aw-08",
    slug: "fragment-series-iii",
    title: "Fragment Series III",
    year: 2024,
    category: "Mixed Media",
    medium: "Collage, plaster and graphite on board",
    dimensions: "60 × 60 cm",
    availability: "available",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=1200&q=80",
    imageAlt:
      "Textured collage with plaster, torn paper and graphite marks in muted neutrals.",
    story:
      "Built from torn studio drawings set into plaster, Fragment Series III treats failure as material — every discarded mark returns as part of the whole.",
    price: 920,
  },
];

export function getAllArtworks(): Artwork[] {
  return artworks;
}

export function getFeaturedArtworks(): Artwork[] {
  return artworks.filter((a) => a.featured);
}

export function getArtworkBySlug(slug: string): Artwork | undefined {
  return artworks.find((a) => a.slug === slug);
}

export const artworkCategories = [
  "Painting",
  "Works on Paper",
  "Mixed Media",
  "Sculpture",
] as const;
