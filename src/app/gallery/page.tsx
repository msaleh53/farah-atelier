import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import GalleryView from "@/components/GalleryView";
import { getAllArtworks } from "@/data/artworks";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse original paintings, works on paper, mixed media and sculpture. Filter by category and availability.",
};

export default async function GalleryPage() {
  const artworks = await getAllArtworks();

  return (
    <>
      <PageHeader
        eyebrow="The collection"
        title="Gallery"
        intro="A continuously evolving body of work. Filter by medium or availability; select any piece to read its story and begin an inquiry."
      />
      <section className="container-editorial pb-8">
        <GalleryView artworks={artworks} />
      </section>
    </>
  );
}
