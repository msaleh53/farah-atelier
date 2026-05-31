import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: "pr-01",
    slug: "morning-tide-print",
    title: "Morning Tide",
    type: "Limited Print",
    artworkSlug: "morning-tide",
    edition: "Edition of 25",
    size: "60 × 45 cm",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=80",
    imageAlt:
      "Limited-edition giclée print of the abstract painting Morning Tide.",
  },
  {
    id: "pr-02",
    slug: "ochre-field-print",
    title: "Ochre Field",
    type: "Limited Print",
    artworkSlug: "ochre-field",
    edition: "Edition of 25",
    size: "55 × 75 cm",
    price: 240,
    image:
      "https://images.unsplash.com/photo-1502759683299-cdcd6974244f?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Limited-edition giclée print of the warm abstract Ochre Field.",
  },
  {
    id: "pr-03",
    slug: "olive-grove-print",
    title: "Olive Grove, Study",
    type: "Open Edition Print",
    artworkSlug: "olive-grove-study",
    edition: "Open edition",
    size: "42 × 30 cm",
    price: 95,
    image:
      "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Open-edition print of the ink and wash study Olive Grove.",
  },
  {
    id: "pr-04",
    slug: "parchment-horizon-print",
    title: "Parchment Horizon",
    type: "Open Edition Print",
    artworkSlug: "parchment-horizon",
    edition: "Open edition",
    size: "50 × 35 cm",
    price: 85,
    image:
      "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Open-edition print of the minimal charcoal work Parchment Horizon.",
  },
  {
    id: "pr-05",
    slug: "desert-geometry-original",
    title: "Desert Geometry",
    type: "Original",
    artworkSlug: "desert-geometry",
    edition: "Unique work",
    size: "100 × 100 cm",
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Original mixed-media work Desert Geometry with sand and gold leaf.",
  },
  {
    id: "pr-06",
    slug: "vessel-i-original",
    title: "Vessel I",
    type: "Original",
    artworkSlug: "vessel-i",
    edition: "Unique work",
    size: "38 × 24 × 24 cm",
    price: 1100,
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Original hand-built stoneware sculpture Vessel I with ash glaze.",
  },
];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const productTypes = [
  "Original",
  "Limited Print",
  "Open Edition Print",
] as const;
