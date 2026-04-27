"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import EnquiryModal from "./EnquiryModal";

interface Project {
  title: string | null;
  location: string | null;
  desc: string | null;
  category: string | null;
  img: { url: string | null; alt: string | null };
}

interface ProjectGalleryProps {
  projects: Project[];
  locale?: Locale;
}

const UI: Record<Locale, {
  all: string;
  view: string;
  empty: string;
  viewStudy: string;
  ariaFilter: string;
  ariaSpread: string;
  ariaGrid: string;
}> = {
  en: {
    all: "All",
    view: "View",
    empty: "No projects in this category.",
    viewStudy: "View study",
    ariaFilter: "Filter by category",
    ariaSpread: "Editorial spread",
    ariaGrid: "Compact grid",
  },
  ar: {
    all: "الكل",
    view: "عرض",
    empty: "لا توجد مشاريع في هذه الفئة.",
    viewStudy: "عرض الدراسة",
    ariaFilter: "تصفية حسب الفئة",
    ariaSpread: "عرض تحريري",
    ariaGrid: "شبكة مدمجة",
  },
};

const ALL_KEY_EN = "All";
const ALL_KEY_AR = "الكل";

export default function ProjectGallery({ projects, locale = "en" }: ProjectGalleryProps) {
  const t = UI[locale];
  const allKey = locale === "ar" ? ALL_KEY_AR : ALL_KEY_EN;

  const [active, setActive] = useState<string>(allKey);
  const [view, setView] = useState<"spread" | "grid">("spread");
  const [enquiryProject, setEnquiryProject] = useState<string | null>(null);

  const categories = useMemo(
    () => [allKey, ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean) as string[]))],
    [projects, allKey]
  );

  const filtered = useMemo(
    () => (active === allKey ? projects : projects.filter((p) => p.category === active)),
    [active, projects, allKey]
  );

  return (
    <div>
      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 border-y border-[var(--color-ink)]/10 py-3 sm:py-5">
        <div
          role="radiogroup"
          aria-label={t.ariaFilter}
          className="flex flex-wrap items-center gap-1.5 -mx-1 sm:mx-0"
        >
          {categories.map((c) => {
            const isActive = active === c;
            return (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setActive(c)}
                className={`px-3 sm:px-4 min-h-[44px] py-2.5 text-[11px] font-medium tracking-[0.14em] uppercase transition-colors duration-300 active:opacity-80 ${
                  isActive
                    ? "bg-[var(--color-ink)] text-[var(--color-bone)]"
                    : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                }`}
              >
                {c}
                <span className={`ml-1.5 sm:ml-2 tabular-nums ${isActive ? "opacity-70" : "opacity-50"}`}>
                  {c === allKey
                    ? projects.length.toString().padStart(2, "0")
                    : projects.filter((p) => p.category === c).length.toString().padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="radiogroup"
          aria-label="Layout"
          className="flex items-center gap-1.5 text-[var(--color-ink)]"
        >
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-muted)] mr-2">
            {t.view}
          </span>
          <button
            type="button"
            role="radio"
            aria-checked={view === "spread"}
            onClick={() => setView("spread")}
            className={`h-11 w-11 flex items-center justify-center transition-colors active:opacity-80 ${
              view === "spread"
                ? "bg-[var(--color-ink)] text-[var(--color-bone)]"
                : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            }`}
            aria-label={t.ariaSpread}
          >
            <span aria-hidden className="material-symbols-outlined text-[20px]">view_agenda</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={view === "grid"}
            onClick={() => setView("grid")}
            className={`h-11 w-11 flex items-center justify-center transition-colors active:opacity-80 ${
              view === "grid"
                ? "bg-[var(--color-ink)] text-[var(--color-bone)]"
                : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            }`}
            aria-label={t.ariaGrid}
          >
            <span aria-hidden className="material-symbols-outlined text-[20px]">grid_view</span>
          </button>
        </div>
      </div>

      {/* ── Gallery ─────────────────────────────────────────────── */}
      <div className="pt-8 sm:pt-12 md:pt-16">
        {filtered.length === 0 ? (
          <div className="border border-dashed border-[var(--color-hairline)] py-14 sm:py-20 text-center text-[var(--color-muted)] font-mono text-xs uppercase tracking-[0.14em]">
            {t.empty}
          </div>
        ) : view === "spread" ? (
          <div className="space-y-14 sm:space-y-20 md:space-y-32">
            {filtered.map((project, index) => {
              const reverse = index % 2 === 1;
              return (
                <article
                  key={`${project.title}-${index}`}
                  className="cv-auto grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-6 sm:gap-y-10 items-end animate-fade-in-up"
                >
                  <figure
                    className={`col-span-12 md:col-span-8 relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[var(--color-linen)] ${
                      reverse ? "md:order-2" : ""
                    }`}
                  >
                    {project.img?.url && (
                      <Image
                        src={project.img.url}
                        alt={project.img.alt || project.title || "Project"}
                        fill
                        sizes="(min-width: 768px) 66vw, 100vw"
                        className="object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
                      />
                    )}
                    <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[var(--color-ink)]/10" />
                    {project.category && (
                      <span className="absolute top-3 left-3 sm:top-5 sm:left-5 bg-[var(--color-bone)] text-[var(--color-ink)] px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-[9px] sm:text-[10px] tracking-[0.18em] uppercase">
                        {project.category}
                      </span>
                    )}
                  </figure>

                  <div className={`col-span-12 md:col-span-4 ${reverse ? "md:order-1 md:pr-8" : "md:pl-8"} md:pb-4`}>
                    <div className="flex items-baseline gap-3 sm:gap-4 mb-3 sm:mb-5">
                      <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] tabular-nums">
                        W/{(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="h-px flex-1 bg-[var(--color-ink)]/15" />
                    </div>

                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-saffron-deep)] mb-2 sm:mb-3">
                      {project.location}
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl md:text-[2.4rem] leading-[1.05] tracking-[-0.025em] text-[var(--color-ink)]">
                      {project.title}
                    </h2>
                    {project.desc && (
                      <p className="mt-3 sm:mt-5 text-[var(--color-ink-soft)] leading-[1.8] text-[15px] max-w-[48ch]">
                        {project.desc}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => setEnquiryProject(project.title || "")}
                      className="mt-5 sm:mt-7 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] uppercase text-[var(--color-ink)] border-b border-[var(--color-ink)] pb-1 min-h-[44px] cursor-pointer hover:text-[var(--color-saffron-deep)] hover:border-[var(--color-saffron-deep)] transition-colors"
                    >
                      {t.viewStudy}
                      <span aria-hidden className={`material-symbols-outlined text-[14px] ${locale === "ar" ? "rotate-180" : ""}`}>arrow_forward</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-10 sm:gap-y-14">
            {filtered.map((project, index) => (
              <article key={`${project.title}-${index}`} className="cv-auto group animate-fade-in-up">
                <figure className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[var(--color-linen)] mb-4 sm:mb-5">
                  {project.img?.url && (
                    <Image
                      src={project.img.url}
                      alt={project.img.alt || project.title || "Project"}
                      fill
                      sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                      className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    />
                  )}
                  <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[var(--color-ink)]/10" />
                </figure>

                <div className="flex items-baseline gap-3 mb-2 sm:mb-3">
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-muted)] tabular-nums">
                    W/{(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-[var(--color-ink)]/15" />
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-muted)]">
                    {project.category}
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl md:text-2xl leading-[1.15] tracking-[-0.02em] text-[var(--color-ink)]">
                  {project.title}
                </h3>
                <p className="mt-1 sm:mt-1.5 text-[var(--color-muted)] text-sm">{project.location}</p>
                <button
                  type="button"
                  onClick={() => setEnquiryProject(project.title || "")}
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.14em] uppercase text-[var(--color-ink)] border-b border-[var(--color-ink)] pb-0.5 min-h-[44px] cursor-pointer hover:text-[var(--color-saffron-deep)] hover:border-[var(--color-saffron-deep)] transition-colors"
                >
                  {t.viewStudy}
                  <span aria-hidden className={`material-symbols-outlined text-[14px] ${locale === "ar" ? "rotate-180" : ""}`}>arrow_forward</span>
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      <EnquiryModal
        open={enquiryProject !== null}
        onClose={() => setEnquiryProject(null)}
        projectTitle={enquiryProject || ""}
        locale={locale}
      />
    </div>
  );
}
