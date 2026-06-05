import type { MetadataRoute } from "next";
import { getArtworkSlugs } from "@/data/artworks";

const BASE_URL = "https://farah-ramadan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/gallery", "/shop", "/about", "/contact"].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const slugs = await getArtworkSlugs();
  const artworkRoutes = slugs.map((a) => ({
    url: `${BASE_URL}/gallery/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...artworkRoutes];
}
