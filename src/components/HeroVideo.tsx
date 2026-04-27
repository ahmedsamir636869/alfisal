"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface HeroVideoProps {
  src: string;
  fallbackSrc: string;
  fallbackAlt: string;
}

export default function HeroVideo({ src, fallbackSrc, fallbackAlt }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = src.trim().length > 0;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="relative w-full"
    >
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-amber-500/10 blur-[60px]" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-amber-500/10 sm:rounded-3xl"
           style={{ aspectRatio: "9/16" }}>
        {hasVideo ? (
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            src={fallbackSrc}
            alt={fallbackAlt}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
    </motion.div>
  );
}
