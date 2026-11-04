import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

export type LightboxPhoto = {
  title: string;
  image: string;
  description?: string | null;
  category?: string | null;
  link?: string | null;
};

type Props = {
  photos: LightboxPhoto[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function PhotoLightbox({ photos, index, onClose, onNavigate }: Props) {
  const open = index !== null && photos.length > 0;
  const photo = open ? photos[index] : null;

  const goPrev = useCallback(() => {
    if (index === null || photos.length === 0) return;
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onNavigate]);

  const goNext = useCallback(() => {
    if (index === null || photos.length === 0) return;
    onNavigate((index + 1) % photos.length);
  }, [index, photos.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open || !photo) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer: ${photo.title}`}
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
        <p className="text-sm font-medium tabular-nums">
          {index + 1} / {photos.length}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full text-white hover:bg-white/15 hover:text-white"
          onClick={onClose}
          aria-label="Close photo viewer"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Image area */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        {photos.length > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 z-10 h-11 w-11 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/25 hover:text-white sm:left-4"
            onClick={goPrev}
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-7 w-7" />
          </Button>
        )}

        <img
          key={photo.image}
          src={photo.image}
          alt={photo.title}
          className="max-h-full max-w-full rounded-lg object-contain"
        />

        {photos.length > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 z-10 h-11 w-11 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/25 hover:text-white sm:right-4"
            onClick={goNext}
            aria-label="Next photo"
          >
            <ChevronRight className="h-7 w-7" />
          </Button>
        )}
      </div>

      {/* Caption */}
      <div
        className="mx-auto w-full max-w-3xl px-4 pb-6 pt-3 text-center text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-base font-semibold sm:text-lg">{photo.title}</p>
        {photo.description ? (
          <p className="mt-1 text-sm text-white/75">{photo.description}</p>
        ) : null}
        {photo.link ? (
          <a
            href={photo.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white/25"
          >
            Open link <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
