"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  beforeAlt: string;
  afterVideoSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** Fallback image when no video URL is set */
  fallbackSrc?: string;
  fallbackAlt?: string;
}

export default function BeforeAfterSlider({
  beforeSrc,
  beforeAlt,
  afterVideoSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  fallbackSrc,
  fallbackAlt,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const hasVideo = afterVideoSrc.trim().length > 0;

  const updatePosition = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
      setPosition(pct);
    },
    [],
  );

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      e.preventDefault();
      updatePosition(e.clientX);
    };
    const onUp = () => setDragging(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, updatePosition]);

  if (!hasVideo) {
    return (
      <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden">
        <Image
          src={fallbackSrc || beforeSrc}
          alt={fallbackAlt || beforeAlt}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover grayscale-[40%] contrast-[1.05]"
        />
        <div
          aria-hidden
          className="absolute inset-0 ring-1 ring-inset ring-[var(--color-ink)]/10 pointer-events-none"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden select-none touch-none"
      onPointerDown={(e) => {
        setDragging(true);
        updatePosition(e.clientX);
      }}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 2));
        if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 2));
      }}
    >
      {/* After layer — video (full width, behind) */}
      <video
        src={afterVideoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before layer — photo (clipped by slider position) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 z-10 flex items-center"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        {/* Vertical line */}
        <div className="w-[2px] h-full bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.3)]" />

        {/* Drag handle */}
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing">
          <span className="material-symbols-outlined text-[var(--color-ink)] text-[20px]">
            drag_handle
          </span>
        </div>
      </div>

      {/* Labels */}
      <span
        className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm text-white text-[10px] font-mono tracking-[0.18em] uppercase px-3 py-1.5 rounded-sm pointer-events-none"
        style={{ opacity: position > 12 ? 1 : 0, transition: "opacity 0.2s" }}
      >
        {beforeLabel}
      </span>
      <span
        className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white text-[10px] font-mono tracking-[0.18em] uppercase px-3 py-1.5 rounded-sm pointer-events-none"
        style={{ opacity: position < 88 ? 1 : 0, transition: "opacity 0.2s" }}
      >
        {afterLabel}
      </span>

      {/* Border overlay */}
      <div
        aria-hidden
        className="absolute inset-0 ring-1 ring-inset ring-[var(--color-ink)]/10 pointer-events-none z-10"
      />
    </div>
  );
}
