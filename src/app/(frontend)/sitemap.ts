import type { MetadataRoute } from "next";
import { getArtworkSlugs } from "@/data/artworks";
import { getPostSlugs } from "@/data/posts";

const BASE_URL = "https://farah-ramadan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/gallery", "/journal", "/about", "/contact"].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const [artworkSlugs, postSlugs] = await Promise.all([
    getArtworkSlugs(),
    getPostSlugs(),
  ]);

  const artworkRoutes = artworkSlugs.map((a) => ({
    url: `${BASE_URL}/gallery/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const postRoutes = postSlugs.map((p) => ({
    url: `${BASE_URL}/journal/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...artworkRoutes, ...postRoutes];
}
