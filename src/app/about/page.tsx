import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getContentServer, getImagesServer, getVideosServer } from "@/lib/cms";
import { getLocale } from "@/lib/i18n.server";
import { responsiveFs } from "@/lib/responsive-fs";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover Alfisal's founding story, studio philosophy, and the values that shape every project — from first sketch to final stone.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Alfisal",
    description:
      "Discover Alfisal's founding story, studio philosophy, and the values that shape every project.",
    url: "/about",
  },
};

export const revalidate = 0;

export default async function AboutPage() {
  const [cookieStore, locale] = await Promise.all([cookies(), getLocale()]);
  const supabase = await createClient(cookieStore);
  const [content, images, videos] = await Promise.all([
    getContentServer(supabase, "about", locale),
    getImagesServer(supabase, "about", locale),
    getVideosServer(supabase, "about", locale),
  ]);

  const stats = [
    { n: content.stat1_number, suffix: content.stat1_suffix, label: content.stat1_label },
    { n: content.stat2_number, suffix: content.stat2_suffix, label: content.stat2_label },
    { n: content.stat3_number, suffix: content.stat3_suffix, label: content.stat3_label },
    { n: content.stat4_number, suffix: content.stat4_suffix, label: content.stat4_label },
  ];

  const principles = [
    { title: content.principle1_title, text: content.principle1_text, tKey: "principle1_title", xKey: "principle1_text" },
    { title: content.principle2_title, text: content.principle2_text, tKey: "principle2_title", xKey: "principle2_text" },
    { title: content.principle3_title, text: content.principle3_text, tKey: "principle3_title", xKey: "principle3_text" },
    { title: content.principle4_title, text: content.principle4_text, tKey: "principle4_title", xKey: "principle4_text" },
  ];

  const fs = (key: string) => responsiveFs(content, key);

  return (
    <>
      {/* ── Editorial masthead ─────────────────────────────────────── */}
      <section className="pt-28 sm:pt-36 md:pt-44 pb-14 sm:pb-20 md:pb-28 border-b border-[var(--color-hairline)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-4 sm:mb-6" style={fs("subtitle")}>
              {content.subtitle}
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h1 className="font-display text-[clamp(2.25rem,7vw,6.5rem)] leading-[1] tracking-[-0.035em] text-[var(--color-ink)]" style={fs("page_title")}>
              {content.page_title}
              <span className="text-[var(--color-saffron-deep)]">.</span>
            </h1>
            {content.intro_paragraph && (
              <p className="mt-6 sm:mt-10 max-w-[62ch] font-display text-[1.15rem] sm:text-[1.5rem] leading-[1.5] text-[var(--color-ink-soft)] italic" style={fs("intro_paragraph")}>
                {content.intro_paragraph}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Mission / Vision split with figure ─────────────────────── */}
      <section className="py-14 sm:py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-10 sm:gap-y-16 items-start">
          <figure className="col-span-12 md:col-span-7 relative">
            <div className="relative aspect-[5/6] md:aspect-[4/5] overflow-hidden bg-[var(--color-linen)]">
              {videos.hero_image?.url ? (
                <video
                  src={videos.hero_image.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : images.hero_image?.url ? (
                <Image
                  src={images.hero_image.url}
                  alt={images.hero_image.alt || "Inside the Alfisal studio"}
                  fill
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover grayscale-[25%] hover:grayscale-0 transition-[filter,transform] duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02]"
                />
              ) : null}
              <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[var(--color-ink)]/10" />
            </div>
            <figcaption className="mt-4 font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--color-muted)]">
              {locale === "ar" ? "شكل ٠٢ —" : "Fig. 02 —"} {images.hero_image?.alt || (locale === "ar" ? "الاستوديو في العمل" : "The studio at work")}
            </figcaption>
          </figure>

          <div className="col-span-12 md:col-span-5 md:pt-8 space-y-14">
            <div>
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] tabular-nums">01</span>
                <span className="h-px flex-1 bg-[var(--color-ink)]/15" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)] mb-5" style={fs("mission_title")}>
                {content.mission_title}
              </h2>
              <p className="text-[var(--color-ink-soft)] leading-[1.8] text-[17px]" style={fs("mission_text")}>
                {content.mission_text}
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] tabular-nums">02</span>
                <span className="h-px flex-1 bg-[var(--color-ink)]/15" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)] mb-5" style={fs("vision_title")}>
                {content.vision_title}
              </h2>
              <p className="text-[var(--color-ink-soft)] leading-[1.8] text-[17px]" style={fs("vision_text")}>
                {content.vision_text}
              </p>
            </div>

            {content.philosophy_title && (
              <div>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] tabular-nums">03</span>
                  <span className="h-px flex-1 bg-[var(--color-ink)]/15" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)] mb-5" style={fs("philosophy_title")}>
                  {content.philosophy_title}
                </h2>
                <p className="text-[var(--color-ink-soft)] leading-[1.8] text-[17px]" style={fs("philosophy_text")}>
                  {content.philosophy_text}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Statistics band ────────────────────────────────────────── */}
      <section className="bg-[var(--color-parchment)] border-y border-[var(--color-hairline)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10">
          <dl className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 ${
                  i % 2 !== 0 ? "border-l border-[var(--color-hairline)]" : ""
                } ${i >= 2 ? "border-t border-[var(--color-hairline)] md:border-t-0" : ""} ${
                  i >= 1 ? "md:border-l md:border-[var(--color-hairline)]" : ""
                }`}
              >
                <dt className="font-mono text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.18em] uppercase text-[var(--color-muted)] mb-2 sm:mb-4 line-clamp-1">
                  0{i + 1} — {s.label}
                </dt>
                <dd className="font-display text-[clamp(2rem,5vw,5.5rem)] leading-none tracking-tight text-[var(--color-ink)] tabular-nums">
                  {s.n}
                  <span className="text-[var(--color-saffron-deep)]">{s.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Principles list ────────────────────────────────────────── */}
      <section className="py-14 sm:py-24 md:py-36">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10">
          <div className="col-span-12 md:col-span-4 md:sticky md:top-28 self-start mb-8 sm:mb-12 md:mb-0">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-5" style={fs("principles_label")}>
              {content.principles_label}
            </p>
            <h2 className="font-display text-4xl md:text-[3.25rem] leading-[1.05] tracking-[-0.03em] text-[var(--color-ink)]" style={fs("principles_heading")}>
              {content.principles_heading}
            </h2>
          </div>

          <ol className="col-span-12 md:col-span-8 divide-y divide-[var(--color-ink)]/10 border-y border-[var(--color-ink)]/10">
            {principles.map((p, i) => (
              <li key={i} className="py-7 sm:py-10 md:py-14 grid grid-cols-12 gap-x-4 sm:gap-x-6 items-baseline">
                <span className="col-span-12 md:col-span-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] tabular-nums mb-2 sm:mb-3 md:mb-0">
                  P/0{i + 1}
                </span>
                <div className="col-span-12 md:col-span-10">
                  <h3 className="font-display text-xl sm:text-2xl md:text-[2rem] leading-[1.15] tracking-[-0.02em] text-[var(--color-ink)] mb-3 sm:mb-4" style={fs(p.tKey)}>
                    {p.title}
                  </h3>
                  <p className="text-[var(--color-ink-soft)] leading-[1.8] max-w-[58ch] text-[15px] sm:text-base" style={fs(p.xKey)}>
                    {p.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTA strip ──────────────────────────────────────────────── */}
      <section className="border-t border-[var(--color-hairline)] bg-[var(--color-bone)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-3 sm:mb-4" style={fs("cta_label")}>
              {content.cta_label}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-[2.4rem] leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)] max-w-[28ch]" style={fs("cta_title")}>
              {content.cta_title}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 bg-[var(--color-ink)] text-[var(--color-bone)] px-7 min-h-[48px] py-3.5 text-[12px] font-medium tracking-[0.1em] uppercase hover:bg-[var(--color-saffron-deep)] active:bg-[var(--color-saffron-deep)] transition-colors duration-300"
            >
              {content.cta_enquire_btn}
              <span aria-hidden className="material-symbols-outlined text-[18px]">
                {locale === "ar" ? "arrow_back" : "arrow_forward"}
              </span>
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-3 text-[var(--color-ink)] px-7 min-h-[48px] py-3.5 text-[12px] font-medium tracking-[0.1em] uppercase border border-[var(--color-ink)]/20 hover:border-[var(--color-ink)] active:bg-[var(--color-parchment)] transition-colors duration-300"
            >
              {content.cta_see_work_btn}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
