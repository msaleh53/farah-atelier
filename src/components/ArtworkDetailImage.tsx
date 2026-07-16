"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";
import type { Artwork } from "@/types";

/**
 * The detail-page hero image. Renders at the artwork's true aspect ratio
 * (unlike the grid's fixed 4:5 crop) and opens into the Lightbox for a
 * closer look — the same enlarge affordance the gallery grid already has.
 */
export default function ArtworkDetailImage({ artwork }: { artwork: Artwork }) {
  const [open, setOpen] = useState(false);
  const full = artwork.imageFull;

  if (!full && !artwork.image) {
    return (
      <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
        <div className="flex h-full items-center justify-center">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-label-gray">
            Image coming soon
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${artwork.title} full size`}
        className="group relative block w-full overflow-hidden bg-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        style={full ? { aspectRatio: `${full.width} / ${full.height}` } : undefined}
      >
        {full ? (
          <Image
            src={full.url}
            alt={artwork.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-contain transition-transform duration-700 ease-editorial group-hover:scale-[1.02]"
          />
        ) : (
          <div className="relative aspect-[4/5]">
            <Image
              src={artwork.image}
              alt={artwork.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.02]"
            />
          </div>
        )}
      </button>

      {open ? (
        <Lightbox
          artworks={[artwork]}
          index={0}
          onClose={() => setOpen(false)}
          onNavigate={() => {}}
        />
      ) : null}
    </>
  );
}
