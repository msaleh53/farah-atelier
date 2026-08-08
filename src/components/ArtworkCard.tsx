import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/types";
import { shimmerBlurDataURL } from "@/lib/media";

export default function ArtworkCard({
  artwork,
  priority = false,
  onOpenLightbox,
}: {
  artwork: Artwork;
  priority?: boolean;
  /** When provided, the card opens the lightbox instead of linking to the detail page. */
  onOpenLightbox?: () => void;
}) {
  const figure = (
    <figure>
      <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
        {artwork.image ? (
          <Image
            src={artwork.image}
            alt={artwork.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            priority={priority}
            placeholder="blur"
            blurDataURL={shimmerBlurDataURL}
            className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-label-gray">
              Image coming soon
            </span>
          </div>
        )}
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl leading-tight text-charcoal">
            <span className="link-underline">{artwork.title}</span>
          </h3>
          <p className="mt-1 font-body text-sm text-label-gray">
            {artwork.medium}, {artwork.year}
          </p>
        </div>
        <p className="shrink-0 font-body text-xs uppercase tracking-[0.15em] text-label-gray">
          {artwork.category}
        </p>
      </figcaption>
    </figure>
  );

  if (onOpenLightbox) {
    return (
      <button
        type="button"
        onClick={onOpenLightbox}
        aria-label={`View ${artwork.title} full size`}
        className="group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        {figure}
      </button>
    );
  }

  return (
    <Link
      href={`/gallery/${artwork.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      {figure}
    </Link>
  );
}
