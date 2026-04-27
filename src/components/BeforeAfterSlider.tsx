"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  beforeAlt: string;
  afterVideoSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
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

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

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

  /* ── Fallback: no video URL set ── */
  if (!hasVideo) {
    return (
      <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden rounded-2xl">
        <Image
          src={fallbackSrc || beforeSrc}
          alt={fallbackAlt || beforeAlt}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none"
        />
      </div>
    );
  }

  /* ── Slider ── */
  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden rounded-2xl select-none touch-none cursor-grab active:cursor-grabbing"
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
      {/* ── After layer: video (behind, full width) ── */}
      <video
        src={afterVideoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ── Before layer: photo (clipped) ── */}
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

      {/* ── Divider line ── */}
      <div
        className="absolute top-0 bottom-0 z-20 pointer-events-none"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-[3px] h-full bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)]" />
      </div>

      {/* ── Center handle: circle with arrows ── */}
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          left: `${position}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-center justify-center gap-0.5">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            className="text-[var(--color-ink)]"
          >
            {/* Left arrow */}
            <path
              d="M14 12L8 18L14 24"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Right arrow */}
            <path
              d="M22 12L28 18L22 24"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* ── Bottom labels: pill badges ── */}
      <span
        className="absolute bottom-5 left-5 z-20 bg-[var(--color-saffron)] text-[var(--color-ink)] text-[11px] sm:text-xs font-bold tracking-[0.06em] uppercase px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.25)] pointer-events-none"
        style={{ opacity: position > 8 ? 1 : 0, transition: "opacity 0.2s" }}
      >
        {beforeLabel}
      </span>
      <span
        className="absolute bottom-5 right-5 z-20 bg-[var(--color-saffron)] text-[var(--color-ink)] text-[11px] sm:text-xs font-bold tracking-[0.06em] uppercase px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.25)] pointer-events-none"
        style={{ opacity: position < 92 ? 1 : 0, transition: "opacity 0.2s" }}
      >
        {afterLabel}
      </span>

      {/* ── Rounded corner overlay ── */}
      <div
        aria-hidden
        className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none z-10"
      />
    </div>
  );
}
