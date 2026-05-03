"use client";

import { useState, useEffect } from "react";
import { X, Play } from "lucide-react";

interface DemoSectionProps {
  videoUrl?: string;
  title?: string;
}

export function DemoSection({
  videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4",
  title = "Watch how it works",
}: DemoSectionProps) {
  const [open, setOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setVideoSrc(videoUrl);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, videoUrl]);

  const handlePlay = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setVideoSrc(null);
  };

  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Video thumbnail */}
            <button
              onClick={handlePlay}
              className="w-full group relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent aspect-video flex items-center justify-center cursor-pointer"
              aria-label="Play demo video"
            >
              {/* Play button */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Play className="w-6 h-6 ml-1" fill="currentColor" />
              </div>

              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />
            </button>

            {/* Caption */}
            <p className="text-center text-muted-foreground mt-4 text-sm">
              {title}
            </p>
          </div>
        </div>
      </section>

      {/* Modal - only render when open */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Demo video"
        >
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Close video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video */}
            {videoSrc && (
              <video
                src={videoSrc}
                className="w-full h-full"
                controls
                autoPlay
                onEnded={handleClose}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}