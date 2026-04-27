"use client";

import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { motion } from "framer-motion";

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
  const hasVideo = afterVideoSrc.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="relative w-full"
    >
      {/* Glow behind the slider */}
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-amber-500/10 blur-[60px]" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-amber-500/10 sm:rounded-3xl">
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage
              src={beforeSrc}
              alt={beforeAlt}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          }
          itemTwo={
            hasVideo ? (
              <video
                src={afterVideoSrc}
                autoPlay
                muted
                loop
                playsInline
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            ) : (
              <ReactCompareSliderImage
                src={fallbackSrc || beforeSrc}
                alt={fallbackAlt || beforeAlt}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            )
          }
          style={{ width: "100%", height: "auto", aspectRatio: "9/16" }}
          handle={<SliderHandle beforeLabel={beforeLabel} afterLabel={afterLabel} />}
        />
      </div>
    </motion.div>
  );
}

function SliderHandle({
  beforeLabel,
  afterLabel,
}: {
  beforeLabel: string;
  afterLabel: string;
}) {
  return (
    <div className="flex h-full w-full items-center">
      {/* Before label — anchored to left of handle */}
      <span className="absolute bottom-5 left-4 bg-[var(--color-saffron)] text-[var(--color-ink)] text-[10px] sm:text-xs font-bold tracking-[0.06em] uppercase px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.25)] pointer-events-none">
        {beforeLabel}
      </span>

      {/* Vertical line */}
      <div className="mx-auto h-full w-[3px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)]" />

      {/* Center circle */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:h-16 sm:w-16">
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

      {/* After label — anchored to right of handle */}
      <span className="absolute bottom-5 right-4 bg-[var(--color-saffron)] text-[var(--color-ink)] text-[10px] sm:text-xs font-bold tracking-[0.06em] uppercase px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.25)] pointer-events-none">
        {afterLabel}
      </span>
    </div>
  );
}
