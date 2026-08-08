"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/types";
import { shimmerBlurDataURL } from "@/lib/media";

const SWIPE_THRESHOLD_PX = 50;

/**
 * Full-screen overlay for viewing one artwork at a time, with prev/next
 * navigation through `artworks` (wraps at the ends). Callers own the current
 * index; this component is otherwise stateless.
 */
export default function Lightbox({
  artworks,
  index,
  onClose,
  onNavigate,
}: {
  artworks: Artwork[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const artwork = artworks[index];
  const prevIndex = (index - 1 + artworks.length) % artworks.length;
  const nextIndex = (index + 1) % artworks.length;

  // Focus the dialog on open, lock body scroll, restore both on close.
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      previouslyFocused.current?.focus();
    };
  }, []);

  // Keyboard: Escape closes, arrows navigate, Tab is trapped inside the dialog.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        onNavigate(prevIndex);
        return;
      }
      if (e.key === "ArrowRight") {
        onNavigate(nextIndex);
        return;
      }
      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>("button, a[href]");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onNavigate, prevIndex, nextIndex]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta > SWIPE_THRESHOLD_PX) {
      onNavigate(prevIndex);
    } else if (delta < -SWIPE_THRESHOLD_PX) {
      onNavigate(nextIndex);
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-charcoal/95 p-4 transition-opacity duration-300 ease-editorial motion-reduce:transition-none sm:p-10"
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal sm:right-8 sm:top-8"
      >
        <span aria-hidden="true" className="text-2xl leading-none">
          ×
        </span>
      </button>

      {artworks.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => onNavigate(prevIndex)}
            aria-label="Previous artwork"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal sm:left-6"
          >
            <span aria-hidden="true" className="text-3xl leading-none">
              ‹
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate(nextIndex)}
            aria-label="Next artwork"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal sm:right-6"
          >
            <span aria-hidden="true" className="text-3xl leading-none">
              ›
            </span>
          </button>
        </>
      ) : null}

      <div className="flex max-h-[80vh] max-w-[90vw] items-center justify-center">
        {artwork.imageFull ? (
          <Image
            src={artwork.imageFull.url}
            alt={artwork.imageAlt}
            width={artwork.imageFull.width}
            height={artwork.imageFull.height}
            sizes="90vw"
            placeholder="blur"
            blurDataURL={shimmerBlurDataURL}
            className="max-h-[80vh] w-auto max-w-[90vw] object-contain"
            priority
          />
        ) : artwork.image ? (
          <div className="relative aspect-[4/5] h-[55vh] max-h-[600px]">
            <Image
              src={artwork.image}
              alt={artwork.imageAlt}
              fill
              sizes="90vw"
              placeholder="blur"
              blurDataURL={shimmerBlurDataURL}
              className="object-contain"
              priority
            />
          </div>
        ) : (
          <div className="flex aspect-[4/5] h-[55vh] max-h-[600px] items-center justify-center bg-parchment">
            <span className="font-body text-xs uppercase tracking-[0.2em] text-label-gray">
              Image coming soon
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 max-w-md text-center">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-sand">
          {index + 1} / {artworks.length}
        </p>
        <h2 id="lightbox-title" className="mt-2 font-heading text-2xl font-light text-canvas">
          {artwork.title}
        </h2>
        <p className="mt-1 font-body text-sm text-canvas/70">
          {artwork.medium}, {artwork.year}
        </p>
        <Link
          href={`/gallery/${artwork.slug}`}
          className="link-underline mt-4 inline-block font-body text-xs uppercase tracking-[0.2em] text-canvas"
        >
          View details →
        </Link>
      </div>
    </div>
  );
}
