"use client";

import { useEffect, useState } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

interface HeroSliderProps {
  beforePhotoUrl: string;
  beforePhotoAlt: string;
  afterVideoUrl: string;
  afterVideoAlt: string;
}

export default function HeroSlider({
  beforePhotoUrl,
  beforePhotoAlt,
  afterVideoUrl,
  afterVideoAlt,
}: HeroSliderProps) {
  // Defer ReactCompareSlider rendering to client only to avoid hydration
  // mismatch — the library injects camelCase styles on the client that
  // differ from the kebab-case SSR output.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // SSR placeholder — a static image that matches the layout exactly
  if (!mounted || !afterVideoUrl) {
    return (
      <img
        src={beforePhotoUrl}
        alt={beforePhotoAlt}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
    );
  }

  return (
    <ReactCompareSlider
      itemOne={
        <ReactCompareSliderImage
          src={beforePhotoUrl}
          alt={beforePhotoAlt}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      }
      itemTwo={
        <video
          src={afterVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          aria-label={afterVideoAlt}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      }
      style={{ width: "100%", height: "100%" }}
    />
  );
}
