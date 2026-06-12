import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import GalleryView from "@/components/GalleryView";
import { getAllArtworks } from "@/data/artworks";
import { getSiteContent } from "@/data/settings";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse original paintings, works on paper, mixed media and sculpture. Filter by category and availability.",
};

export default async function GalleryPage() {
  const [artworks, content] = await Promise.all([
    getAllArtworks(),
    getSiteContent(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={content.gallery.eyebrow}
        title="Gallery"
        intro={content.gallery.intro}
      />
      <section className="container-editorial pb-8">
        <GalleryView artworks={artworks} />
      </section>
    </>
  );
}
