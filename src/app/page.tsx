import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getContentServer } from "@/lib/cms";
import { getLocale } from "@/lib/i18n.server";

export const metadata: Metadata = {
  // Home page inherits the default title — no override needed for title
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
  },
};

export const revalidate = 0;

type ProjectRow = {
  id: string;
  title: string | null;
  title_ar: string | null;
  location: string | null;
  location_ar: string | null;
  description: string | null;
  description_ar: string | null;
  category: string | null;
  category_ar: string | null;
  image_url: string | null;
};

function pickField(en: string | null, ar: string | null, locale: "en" | "ar") {
  if (locale === "ar") {
    const trimmed = (ar ?? "").trim();
    return trimmed.length > 0 ? trimmed : en;
  }
  return en;
}

function localizeProject(p: ProjectRow, locale: "en" | "ar"): ProjectRow {
  return {
    ...p,
    title: pickField(p.title, p.title_ar, locale),
    location: pickField(p.location, p.location_ar, locale),
    description: pickField(p.description, p.description_ar, locale),
    category: pickField(p.category, p.category_ar, locale),
  };
}

export default async function Page() {
  const [cookieStore, locale] = await Promise.all([cookies(), getLocale()]);
  const supabase = await createClient(cookieStore);

  const [valuesContent, projectsContent, ctaContent, { data: dbProjects }] =
    await Promise.all([
      getContentServer(supabase, "values", locale),
      getContentServer(supabase, "featured_projects", locale),
      getContentServer(supabase, "cta_banner", locale),
      supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

  const featured: ProjectRow[] = ((dbProjects as ProjectRow[] | null) || []).map(
    (p) => localizeProject(p, locale)
  );

  const principles = [
    {
      title: valuesContent.card1_title,
      text: valuesContent.card1_text,
    },
    {
      title: valuesContent.card2_title,
      text: valuesContent.card2_text,
    },
    {
      title: valuesContent.card3_title,
      text: valuesContent.card3_text,
    },
  ];

  return (
    <>
      <Hero />

      {/* ── Principles — editorial three-column with hairlines ──────────── */}
      <section
        aria-labelledby="principles-heading"
        className="bg-[var(--color-bone)] py-16 sm:py-28 md:py-40 border-t border-[var(--color-hairline)]"
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10 mb-12 sm:mb-20">
            <div className="col-span-12 md:col-span-4">
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-4 sm:mb-6">
                {valuesContent.section_label || "01 — Operating Principles"}
              </p>
            </div>
            <div className="col-span-12 md:col-span-8">
              <h2
                id="principles-heading"
                className="font-display text-[clamp(1.75rem,4.5vw,4rem)] leading-[1.1] tracking-[-0.025em] text-[var(--color-ink)] max-w-[22ch]"
              >
                {valuesContent.section_title ||
                  "We build with the restraint of a surgeon and the patience of a cartographer."}
              </h2>
              <p className="mt-5 sm:mt-8 max-w-[62ch] text-[var(--color-ink-soft)] leading-[1.8] text-base sm:text-lg">
                {valuesContent.section_description}
              </p>
            </div>
          </div>

          <div className="border-t border-[var(--color-ink)]/10">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {principles.map((p, i) => (
                <article
                  key={i}
                  className={`py-8 sm:py-12 md:py-16 md:pr-10 md:pl-10 first:md:pl-0 last:md:pr-0 ${
                    i !== 0 ? "border-t md:border-t-0 md:border-l border-[var(--color-ink)]/10" : ""
                  }`}
                >
                  <div className="flex items-baseline gap-4 mb-4 sm:mb-6">
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] tabular-nums">
                      0{i + 1}
                    </span>
                    <span className="h-px flex-1 bg-[var(--color-ink)]/15" />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl leading-[1.15] text-[var(--color-ink)] mb-3 sm:mb-5">
                    {p.title}
                  </h3>
                  <p className="text-[var(--color-ink-soft)] leading-[1.8] text-[15px] sm:text-base">
                    {p.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured projects — editorial spread ─────────────────────── */}
      <section
        aria-labelledby="featured-heading"
        className="bg-[var(--color-parchment)] py-16 sm:py-28 md:py-40 border-t border-[var(--color-hairline)]"
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-10 mb-10 sm:mb-16 md:mb-24">
            <div>
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-3 sm:mb-5">
                {projectsContent.section_label || "02 — Selected Works"}
              </p>
              <h2
                id="featured-heading"
                className="font-display text-[clamp(1.75rem,5vw,4.75rem)] leading-[1.05] tracking-[-0.03em] text-[var(--color-ink)] max-w-[16ch]"
              >
                {projectsContent.section_title || "Architectural landmarks."}
              </h2>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 text-[var(--color-ink)] text-[12px] tracking-[0.1em] uppercase border-b border-[var(--color-ink)] pb-1 self-start md:self-auto hover:text-[var(--color-saffron-deep)] hover:border-[var(--color-saffron-deep)] transition-colors min-h-[44px]"
            >
              {locale === "ar" ? "عرض الأرشيف الكامل" : "View the full archive"}
              <span
                aria-hidden
                className={`material-symbols-outlined text-[16px] transition-transform duration-500 group-hover:translate-x-1 ${locale === "ar" ? "rotate-180" : ""}`}
              >
                arrow_forward
              </span>
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="border border-dashed border-[var(--color-hairline)] py-16 sm:py-20 text-center text-[var(--color-muted)] font-mono text-xs uppercase tracking-[0.14em]">
              {locale === "ar" ? "لا توجد مشاريع منشورة بعد." : "No projects published yet."}
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-10 sm:gap-y-14 md:gap-y-24">
              {/* Large feature */}
              {featured[0] && (
                <FeatureLarge project={featured[0]} index={1} locale={locale} />
              )}

              {/* Secondary pair */}
              {featured[1] && <FeatureSmall project={featured[1]} index={2} colSpan="md:col-span-6" locale={locale} />}
              {featured[2] && <FeatureSmall project={featured[2]} index={3} colSpan="md:col-span-6" locale={locale} />}

              {/* Fourth if present */}
              {featured[3] && <FeatureWide project={featured[3]} index={4} locale={locale} />}
            </div>
          )}
        </div>
      </section>

      {/* ── Pull quote CTA ───────────────────────────────────────────── */}
      <section
        aria-labelledby="cta-heading"
        className="bg-[var(--color-ink)] text-[var(--color-bone)] relative overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-saffron-deep)]/80 to-transparent"
        />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 py-16 sm:py-28 md:py-40 grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10 items-start">
          <div className="col-span-12 md:col-span-2 mb-4 sm:mb-10 md:mb-0">
            <span
              aria-hidden
              className="font-display text-[4rem] sm:text-[6rem] leading-none text-[var(--color-saffron)] block -mt-2 sm:-mt-6"
            >
              “
            </span>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2
              id="cta-heading"
              className="font-display text-[clamp(1.5rem,4.5vw,4.5rem)] leading-[1.12] tracking-[-0.02em] text-[var(--color-bone)]"
            >
              {ctaContent.title ||
                "Ready to construct your vision?"}
            </h2>
            <p className="mt-5 sm:mt-8 max-w-[56ch] text-[var(--color-bone)]/70 leading-[1.8] text-base sm:text-lg">
              {ctaContent.description}
            </p>
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-3 bg-[var(--color-bone)] text-[var(--color-ink)] px-7 min-h-[48px] py-3.5 text-[12px] font-medium tracking-[0.1em] uppercase hover:bg-[var(--color-saffron)] active:bg-[var(--color-saffron)] transition-colors duration-300"
              >
                {ctaContent.cta_primary || (locale === "ar" ? "ابدأ محادثة" : "Start a conversation")}
                <span aria-hidden className={`material-symbols-outlined text-[18px] transition-transform duration-500 group-hover:translate-x-1 ${locale === "ar" ? "rotate-180" : ""}`}>arrow_forward</span>
              </Link>
              <a
                href={`tel:${ctaContent.phone || ""}`}
                className="inline-flex items-center justify-center gap-3 text-[var(--color-bone)] px-7 min-h-[48px] py-3.5 text-[12px] font-medium tracking-[0.1em] uppercase border border-[var(--color-bone)]/20 hover:border-[var(--color-bone)] active:bg-[var(--color-bone)]/10 transition-colors duration-300"
              >
                {ctaContent.cta_secondary || (locale === "ar" ? "اتصل بالاستوديو" : "Call the studio")}
              </a>
            </div>
          </div>
          <div className="hidden md:block md:col-span-2">
            <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-bone)]/50">
              {locale === "ar" ? "٠٤ — استفسار" : "04 — Enquiry"}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Feature tiles ───────────────────────────────────────────────── */

function FeatureLarge({ project, index, locale = "en" }: { project: ProjectRow; index: number; locale?: "en" | "ar" }) {
  return (
    <Link
      href="/projects"
      className="col-span-12 grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10 items-end group"
    >
      <figure className="col-span-12 md:col-span-8 relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[var(--color-linen)]">
        {project.image_url && (
          <Image
            src={project.image_url}
            alt={project.title || "Project image"}
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />
        )}
        <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[var(--color-ink)]/10" />
      </figure>
      <div className="col-span-12 md:col-span-4 md:pb-4">
        <div className="flex items-baseline gap-3 sm:gap-4 mb-3 sm:mb-5 mt-4 sm:mt-6 md:mt-0">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] tabular-nums">
            W/0{index}
          </span>
          <span className="h-px flex-1 bg-[var(--color-ink)]/15" />
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)]">
            {project.category}
          </span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl md:text-[2.4rem] leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)] group-hover:text-[var(--color-saffron-deep)] transition-colors duration-500">
          {project.title}
        </h3>
        <p className="mt-2 sm:mt-3 text-[var(--color-muted)] text-sm tracking-wide">
          {project.location}
        </p>
        {project.description && (
          <p className="mt-3 sm:mt-5 text-[var(--color-ink-soft)] leading-[1.8] text-[15px] max-w-[42ch]">
            {project.description}
          </p>
        )}
        <span className="mt-5 sm:mt-7 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] uppercase text-[var(--color-ink)] border-b border-[var(--color-ink)] pb-1 group-hover:text-[var(--color-saffron-deep)] group-hover:border-[var(--color-saffron-deep)] transition-colors min-h-[44px]">
          {locale === "ar" ? "عرض الدراسة" : "Case study"}
          <span aria-hidden className={`material-symbols-outlined text-[14px] ${locale === "ar" ? "rotate-180" : ""}`}>arrow_forward</span>
        </span>
      </div>
    </Link>
  );
}

function FeatureSmall({ project, index, colSpan, locale = "en" }: { project: ProjectRow; index: number; colSpan: string; locale?: "en" | "ar" }) {
  return (
    <Link href="/projects" className={`col-span-12 ${colSpan} group flex flex-col`}>
      <figure className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[var(--color-linen)]">
        {project.image_url && (
          <Image
            src={project.image_url}
            alt={project.title || "Project image"}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />
        )}
        <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[var(--color-ink)]/10" />
      </figure>
      <div className="flex items-baseline gap-3 sm:gap-4 mt-4 sm:mt-6 mb-2 sm:mb-3">
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] tabular-nums">
          W/0{index}
        </span>
        <span className="h-px flex-1 bg-[var(--color-ink)]/15" />
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)]">
          {project.category}
        </span>
      </div>
      <h3 className="font-display text-xl sm:text-2xl md:text-[2rem] leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)] group-hover:text-[var(--color-saffron-deep)] transition-colors duration-500">
        {project.title}
      </h3>
      <p className="mt-1.5 sm:mt-2 text-[var(--color-muted)] text-sm">{project.location}</p>
    </Link>
  );
}

function FeatureWide({ project, index, locale = "en" }: { project: ProjectRow; index: number; locale?: "en" | "ar" }) {
  return (
    <Link href="/projects" className="col-span-12 grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10 items-end group">
      <figure className="col-span-12 md:col-span-12 relative aspect-[16/10] sm:aspect-[21/9] overflow-hidden bg-[var(--color-linen)]">
        {project.image_url && (
          <Image
            src={project.image_url}
            alt={project.title || "Project image"}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/60 via-[var(--color-ink)]/10 to-transparent" />
        <div className="absolute left-4 right-4 bottom-4 sm:left-6 sm:right-6 sm:bottom-6 md:left-10 md:right-10 md:bottom-10 text-[var(--color-bone)] flex flex-col md:flex-row md:items-end md:justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 sm:mb-3 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase opacity-80">
              W/0{index} · {project.category}
            </div>
            <h3 className="font-display text-xl sm:text-3xl md:text-[2.6rem] leading-[1.05] tracking-[-0.02em]">
              {project.title}
            </h3>
            <p className="mt-1.5 sm:mt-2 opacity-80 text-sm">{project.location}</p>
          </div>
          <span className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] uppercase border-b border-[var(--color-bone)] pb-1 min-h-[44px]">
            {locale === "ar" ? "عرض الدراسة" : "Case study"}
            <span aria-hidden className={`material-symbols-outlined text-[14px] ${locale === "ar" ? "rotate-180" : ""}`}>arrow_forward</span>
          </span>
        </div>
      </figure>
    </Link>
  );
}
