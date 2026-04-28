"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  /** Animation preset */
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-in";
  /** Delay in ms (for stagger effects) */
  delay?: number;
  /** Duration in ms — defaults to 700 */
  duration?: number;
  /** IntersectionObserver threshold — defaults to 0.15 */
  threshold?: number;
  /** Extra className */
  className?: string;
  /** Render as a specific element */
  as?: React.ElementType;
}

const PRESETS: Record<string, { from: CSSProperties; to: CSSProperties }> = {
  "fade-up": {
    from: { opacity: 0, transform: "translate3d(0, 24px, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
  },
  "fade-in": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  "fade-left": {
    from: { opacity: 0, transform: "translate3d(-24px, 0, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
  },
  "fade-right": {
    from: { opacity: 0, transform: "translate3d(24px, 0, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
  },
  "scale-in": {
    from: { opacity: 0, transform: "scale(0.92)" },
    to: { opacity: 1, transform: "scale(1)" },
  },
};

/**
 * Scroll-triggered reveal with GPU-only animations (transform + opacity).
 * Uses IntersectionObserver — no layout thrashing.
 * Respects prefers-reduced-motion.
 */
export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  threshold = 0.15,
  className = "",
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Object.assign(el.style, PRESETS[animation].to);
      return;
    }

    // Apply initial (hidden) state
    Object.assign(el.style, PRESETS[animation].from);
    el.style.willChange = "transform, opacity";
    el.style.transition = `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          Object.assign(el.style, PRESETS[animation].to);
          // Clean up will-change after animation completes
          setTimeout(() => {
            el.style.willChange = "auto";
          }, duration + delay + 50);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation, delay, duration, threshold]);

  const Component = Tag as any;
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
