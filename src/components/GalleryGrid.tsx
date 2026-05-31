import type { Artwork } from "@/types";
import ArtworkCard from "@/components/ArtworkCard";

export default function GalleryGrid({
  artworks,
  priorityCount = 0,
}: {
  artworks: Artwork[];
  /** Number of leading images to mark high-priority for LCP. */
  priorityCount?: number;
}) {
  if (artworks.length === 0) {
    return (
      <p className="py-24 text-center font-body text-label-gray">
        No works match this selection yet.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.map((artwork, i) => (
        <li key={artwork.id}>
          <ArtworkCard artwork={artwork} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
