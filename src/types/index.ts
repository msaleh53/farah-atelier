export type ArtworkCategory =
  | "Painting"
  | "Works on Paper"
  | "Mixed Media"
  | "Sculpture";

export type Availability = "available" | "sold" | "reserved";

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  year: number;
  category: ArtworkCategory;
  medium: string;
  dimensions: string;
  availability: Availability;
  featured: boolean;
  image: string;
  imageAlt: string;
  story: string;
  /** Indicative price in JOD; null when inquiry-only / not for sale. */
  price: number | null;
}

export type ProductType = "Original" | "Limited Print" | "Open Edition Print";

export interface Product {
  id: string;
  slug: string;
  title: string;
  type: ProductType;
  /** Linked artwork slug, when the product depicts an existing artwork. */
  artworkSlug?: string;
  edition: string;
  size: string;
  price: number;
  image: string;
  imageAlt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
