"use client";

import { type FC, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface FlickrGalleryProps {
  images: string[];
  launchName: string;
}

export const FlickrGallery: FC<FlickrGalleryProps> = ({ images, launchName }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setSelectedIndex(null), []);

  useEffect(() => {
    if (selectedIndex === null) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === firstEl) {
          event.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          event.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, close]);

  if (images.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">No photos available for this launch.</p>
    );
  }

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-opacity"
            aria-label={`View photo ${index + 1} of ${images.length} from ${launchName}`}
          >
            <Image
              src={src}
              alt={`${launchName} launch photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {selectedImage !== null && selectedIndex !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${selectedIndex + 1} of ${images.length} from ${launchName}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={close}
        >
          <div
            className="relative max-w-4xl w-full aspect-video"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={`${launchName} launch photo ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
              aria-label="Close photo"
            >
              ✕
            </button>
            {selectedIndex > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIndex(selectedIndex - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
                aria-label="Previous photo"
              >
                ‹
              </button>
            )}
            {selectedIndex < images.length - 1 && (
              <button
                type="button"
                onClick={() => setSelectedIndex(selectedIndex + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
                aria-label="Next photo"
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
