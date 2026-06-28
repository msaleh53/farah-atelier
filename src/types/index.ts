export type ArtworkCategory =
  | "Paintings"
  | "Drawings"
  | "Intaglio"
  | "Ceramics"
  | "Watercolor";

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  year: number;
  category: ArtworkCategory;
  medium: string;
  dimensions: string;
  featured: boolean;
  image: string;
  imageAlt: string;
  story: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  coverImage: string;
  coverImageAlt: string;
  excerpt: string;
  body: unknown;
  tags: string[];
}
