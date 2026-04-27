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

  const clamp = (v: number) => Math.min(85, Math.max(15, v));

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = (x / rect.width) * 100;
    setPosition(clamp(pct));
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

  const gap = 6;

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] sm:aspect-[4/5] w-full select-none touch-none cursor-grab active:cursor-grabbing"
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
        if (e.key === "ArrowLeft") setPosition((p) => clamp(p - 2));
        if (e.key === "ArrowRight") setPosition((p) => clamp(p + 2));
      }}
    >
      {/* ── Before panel: photo ── */}
      <div
        className="absolute top-0 bottom-0 left-0 overflow-hidden rounded-2xl"
        style={{ width: `calc(${position}% - ${gap}px)` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
        {/* Label */}
        <span className="absolute bottom-4 left-4 z-10 bg-[var(--color-saffron)] text-[var(--color-ink)] text-[10px] sm:text-xs font-bold tracking-[0.06em] uppercase px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.25)] pointer-events-none">
          {beforeLabel}
        </span>
        <div
          aria-hidden
          className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none"
        />
      </div>

      {/* ── After panel: video ── */}
      <div
        className="absolute top-0 bottom-0 right-0 overflow-hidden rounded-2xl"
        style={{ width: `calc(${100 - position}% - ${gap}px)` }}
      >
        {hasVideo ? (
          <video
            src={afterVideoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            src={fallbackSrc || beforeSrc}
            alt={fallbackAlt || beforeAlt}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        )}
        {/* Label */}
        <span className="absolute bottom-4 right-4 z-10 bg-[var(--color-saffron)] text-[var(--color-ink)] text-[10px] sm:text-xs font-bold tracking-[0.06em] uppercase px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.25)] pointer-events-none">
          {afterLabel}
        </span>
        <div
          aria-hidden
          className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none"
        />
      </div>

      {/* ── Center handle ── */}
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          left: `${position}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-center justify-center">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            className="text-[var(--color-ink)]"
          >
            <path
              d="M14 12L8 18L14 24"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
    </div>
  );
}
