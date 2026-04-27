import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getContentServer, getImagesServer } from "@/lib/cms";
import { getLocale } from "@/lib/i18n.server";
import TypeWriter from "./TypeWriter";
import HeroVideo from "./HeroVideo";

export default async function Hero() {
  const [cookieStore, locale] = await Promise.all([cookies(), getLocale()]);
  const supabase = await createClient(cookieStore);

  const [content, images] = await Promise.all([
    getContentServer(supabase, "hero", locale),
    getImagesServer(supabase, "hero", locale),
  ]);

  const stats = [
    { n: content.stat1_number || "150", suffix: content.stat1_suffix || "+", label: content.stat1_label || "Landmark Projects" },
    { n: content.stat2_number || "30",  suffix: content.stat2_suffix || "",  label: content.stat2_label || "Years of Practice" },
    { n: content.stat3_number || "22",  suffix: content.stat3_suffix || "",  label: content.stat3_label || "Countries Served" },
  ];

  return (
    <section
      className="relative min-h-[100dvh] flex flex-col bg-[var(--color-bone)] pt-20 md:pt-24 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-[1440px] mx-auto w-full px-5 sm:px-6 md:px-10 flex-1 grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10 pb-10 md:pb-16">
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-end pb-6 lg:pb-20 pt-8 sm:pt-12 lg:pt-24">
          <div className="flex items-center gap-3 mb-6 sm:mb-10 text-[var(--color-ink-soft)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-saffron-deep)] shrink-0" />
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--color-ink-soft)]">
              {content.subtitle || "Structural precision since 1995"}
            </span>
          </div>

          <TypeWriter
            id="hero-heading"
            as="h1"
            className="font-display font-display-display text-[clamp(2.5rem,8vw,8.25rem)] leading-[0.95] tracking-[-0.035em] text-[var(--color-ink)]"
            lines={[
              { text: content.title_line1 || "Architecture" },
              { text: content.title_line2 || "of consequence", className: "italic font-light" },
            ]}
            suffix={<span className="text-[var(--color-saffron-deep)]">.</span>}
            speed={60}
            lineDelay={350}
          />

          <p className="mt-6 sm:mt-10 max-w-[46ch] text-[var(--color-ink-soft)] leading-[1.7] text-base sm:text-[17px]">
            {content.lead ||
              "We build landmark interiors, civic buildings, and private estates where structural intent and material restraint meet. Every project is measured, detailed, and signed."}
          </p>

          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/projects"
              className="group inline-flex items-center justify-center gap-3 bg-[var(--color-ink)] text-[var(--color-bone)] px-7 min-h-[48px] py-3.5 text-[12px] font-medium tracking-[0.1em] uppercase hover:bg-[var(--color-saffron-deep)] active:bg-[var(--color-saffron-deep)] transition-colors duration-300"
            >
              {content.cta_primary || "Browse the portfolio"}
              <span aria-hidden className="material-symbols-outlined text-[18px] transition-transform duration-500 group-hover:translate-x-1">arrow_forward</span>
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center justify-center gap-3 text-[var(--color-ink)] px-7 min-h-[48px] py-3.5 text-[12px] font-medium tracking-[0.1em] uppercase border border-[var(--color-ink)]/15 hover:border-[var(--color-ink)] active:bg-[var(--color-parchment)] transition-colors duration-300"
            >
              {content.cta_secondary || "Read the studio"}
            </Link>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 relative flex flex-col justify-end pb-6 lg:pb-20 pt-0 lg:pt-24">
          <HeroVideo
            src={content.slider_video_url || ""}
            fallbackSrc={images.background?.url || "/hero-bg.jpg"}
            fallbackAlt={images.background?.alt || "A landmark building by Alfisal"}
          />
          <figcaption className="mt-3 sm:mt-4 font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--color-muted)]">
            Fig. 01 — {images.background?.alt || "Zenith Tower, Dubai"}
          </figcaption>
        </div>
      </div>

      <div className="border-t border-[var(--color-hairline)] bg-[var(--color-parchment)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10">
          <dl className="grid grid-cols-3 md:grid-cols-4 divide-x divide-[var(--color-hairline)]">
            {stats.map((s, i) => (
              <div key={i} className="py-5 sm:py-6 md:py-7 px-2.5 sm:px-4 md:px-6 first:pl-0">
                <dt className="font-mono text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.18em] uppercase text-[var(--color-muted)] mb-1.5 sm:mb-2 line-clamp-1">
                  0{i + 1} — {s.label}
                </dt>
                <dd className="font-display text-[clamp(1.75rem,4vw,3.75rem)] leading-none text-[var(--color-ink)] tabular-nums tracking-tight">
                  {s.n}
                  <span className="text-[var(--color-saffron-deep)]">{s.suffix}</span>
                </dd>
              </div>
            ))}
            <div className="hidden md:flex items-center justify-end py-6 md:py-7 px-6 text-[var(--color-ink-soft)]">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase">
                Scroll
              </span>
              <span
                aria-hidden
                className="material-symbols-outlined text-[20px] ml-3 animate-[fade-in_1s_ease-in-out_infinite_alternate]"
              >
                south
              </span>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
