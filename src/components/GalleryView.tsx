"use client";

import { useMemo, useState } from "react";
import type { Artwork } from "@/types";
import { artworkCategories } from "@/data/taxonomies";
import FilterBar from "@/components/FilterBar";
import GalleryGrid from "@/components/GalleryGrid";
import Lightbox from "@/components/Lightbox";

export default function GalleryView({ artworks }: { artworks: Artwork[] }) {
  const [category, setCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
      return category === "All" || a.category === category;
    });
  }, [artworks, category]);

  return (
    <div>
      <div className="mb-10 border-y border-charcoal/10 py-6">
        <FilterBar
          label="Filter by category"
          options={artworkCategories}
          active={category}
          onChange={setCategory}
        />
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mb-8 font-body text-xs uppercase tracking-[0.2em] text-label-gray"
      >
        {filtered.length} {filtered.length === 1 ? "work" : "works"}
      </p>

      <GalleryGrid
        artworks={filtered}
        priorityCount={3}
        onOpenLightbox={setLightboxIndex}
      />

      {lightboxIndex !== null ? (
        <Lightbox
          artworks={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </div>
  );
}
