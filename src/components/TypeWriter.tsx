"use client";

import { useEffect, useRef, useState } from "react";

interface TypeWriterProps {
  lines: { text: string; className?: string }[];
  /** Milliseconds between each character */
  speed?: number;
  /** Milliseconds to pause between lines */
  lineDelay?: number;
  /** Extra element appended after all lines are typed */
  suffix?: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "div" | "span";
  id?: string;
}

export default function TypeWriter({
  lines,
  speed = 55,
  lineDelay = 400,
  suffix,
  className,
  as: Tag = "h1",
  id,
}: TypeWriterProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced.current) {
      setLineIndex(lines.length - 1);
      setCharIndex(lines[lines.length - 1].text.length);
      setDone(true);
    }
  }, [lines]);

  useEffect(() => {
    if (prefersReduced.current || done) return;

    const currentLine = lines[lineIndex];
    if (!currentLine) { setDone(true); return; }

    if (charIndex < currentLine.text.length) {
      const timer = setTimeout(() => setCharIndex((c) => c + 1), speed);
      return () => clearTimeout(timer);
    }

    if (lineIndex < lines.length - 1) {
      const timer = setTimeout(() => {
        setLineIndex((l) => l + 1);
        setCharIndex(0);
      }, lineDelay);
      return () => clearTimeout(timer);
    }

    setDone(true);
  }, [lineIndex, charIndex, lines, speed, lineDelay, done]);

  return (
    <Tag id={id} className={className}>
      {lines.map((line, i) => {
        let display: string;
        if (i < lineIndex) {
          display = line.text;
        } else if (i === lineIndex) {
          display = line.text.slice(0, charIndex);
        } else {
          display = "";
        }

        if (!display && i > lineIndex) return null;

        return (
          <span key={i}>
            {i > 0 && i <= lineIndex && <br />}
            <span className={line.className}>
              {display}
              {i === lineIndex && !done && (
                <span
                  aria-hidden
                  className="inline-block w-[3px] sm:w-[4px] bg-[var(--color-saffron-deep)] animate-blink align-baseline"
                  style={{ height: "0.85em", marginInlineStart: "2px", verticalAlign: "baseline" }}
                />
              )}
            </span>
          </span>
        );
      })}
      {done && suffix}
    </Tag>
  );
}
