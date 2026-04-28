import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getContentServer } from "@/lib/cms";
import { getLocale } from "@/lib/i18n.server";
import { responsiveFs } from "@/lib/responsive-fs";
import ProjectGallery from "@/components/ProjectGallery";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A portfolio of landmark architecture and construction projects by Alfisal across Saudi Arabia and the Gulf — residential, commercial, and civic.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Alfisal",
    description:
      "A portfolio of landmark architecture and construction projects by Alfisal.",
    url: "/projects",
  },
};

export const revalidate = 0;

function pick(en: string | null, ar: string | null, locale: "en" | "ar") {
  if (locale === "ar") {
    const trimmed = (ar ?? "").trim();
    return trimmed.length > 0 ? trimmed : en;
  }
  return en;
}

export default async function ProjectsPage() {
  const [cookieStore, locale] = await Promise.all([cookies(), getLocale()])
  const supabase = await createClient(cookieStore);

  const [content, { data: dbProjects }] = await Promise.all([
    getContentServer(supabase, "projects", locale),
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
  ]);

  const projectsList =
    (dbProjects || []).map((p) => {
      const title = pick(p.title, p.title_ar, locale);
      return {
        title,
        location: pick(p.location, p.location_ar, locale),
        desc: pick(p.description, p.description_ar, locale),
        category: pick(p.category, p.category_ar, locale),
        img: { url: p.image_url, alt: title },
      };
    }) || [];

  return (
    <>
      {/* ── Masthead ───────────────────────────────────────────────── */}
      <section className="pt-28 sm:pt-36 md:pt-44 pb-10 sm:pb-14 md:pb-20 border-b border-[var(--color-hairline)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-4 sm:mb-6" style={responsiveFs(content, "page_subtitle")}>
              {content.page_subtitle || "01 — The Archive"}
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h1 className="font-display text-[clamp(2.25rem,7vw,6.5rem)] leading-[1] tracking-[-0.035em] text-[var(--color-ink)]" style={responsiveFs(content, "page_title")}>
              {content.page_title || "Selected works."}
              <span className="text-[var(--color-saffron-deep)]">.</span>
            </h1>
            {content.intro_paragraph && (
              <p className="mt-5 sm:mt-8 max-w-[62ch] text-[var(--color-ink-soft)] leading-[1.8] text-base sm:text-lg" style={responsiveFs(content, "intro_paragraph")}>
                {content.intro_paragraph}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10">
          <ProjectGallery projects={projectsList} locale={locale} />
        </div>
      </section>
    </>
  );
}
