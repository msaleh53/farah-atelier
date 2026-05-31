"use client";

import { useMemo, useState } from "react";
import type { Artwork } from "@/types";
import { artworkCategories } from "@/data/artworks";
import FilterBar from "@/components/FilterBar";
import GalleryGrid from "@/components/GalleryGrid";

const availabilityOptions = ["Available", "Reserved", "Sold"] as const;

export default function GalleryView({ artworks }: { artworks: Artwork[] }) {
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
      const matchCategory = category === "All" || a.category === category;
      const matchAvailability =
        availability === "All" ||
        a.availability === availability.toLowerCase();
      return matchCategory && matchAvailability;
    });
  }, [artworks, category, availability]);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-6 border-y border-charcoal/10 py-6 lg:flex-row lg:items-center lg:justify-between">
        <FilterBar
          label="Filter by category"
          options={artworkCategories}
          active={category}
          onChange={setCategory}
        />
        <FilterBar
          label="Filter by availability"
          options={availabilityOptions}
          active={availability}
          onChange={setAvailability}
        />
      </div>

      <p className="mb-8 font-body text-xs uppercase tracking-[0.2em] text-label-gray">
        {filtered.length} {filtered.length === 1 ? "work" : "works"}
      </p>

      <GalleryGrid artworks={filtered} priorityCount={3} />
    </div>
  );
}
