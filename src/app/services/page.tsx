import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getContentServer } from "@/lib/cms";
import { getLocale } from "@/lib/i18n.server";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-spectrum architecture and construction services — concept design, structural engineering, interior fit-out, project management, and post-handover support.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — Alfisal",
    description:
      "Full-spectrum architecture and construction services from concept to completion.",
    url: "/services",
  },
};

export const revalidate = 0;

type ServiceRow = {
  id: string;
  title: string | null;
  title_ar: string | null;
  description: string | null;
  description_ar: string | null;
  image_url: string | null;
};

function pick(en: string | null, ar: string | null, locale: "en" | "ar") {
  if (locale === "ar") {
    const trimmed = (ar ?? "").trim();
    return trimmed.length > 0 ? trimmed : en;
  }
  return en;
}

export default async function ServicesPage() {
  const [cookieStore, locale] = await Promise.all([cookies(), getLocale()]);
  const supabase = await createClient(cookieStore);
  const [content, { data: dbServices }] = await Promise.all([
    getContentServer(supabase, "services", locale),
    supabase.from("services").select("*").order("created_at", { ascending: true }),
  ]);

  const services: ServiceRow[] = ((dbServices as ServiceRow[] | null) || []).map(
    (s) => ({
      ...s,
      title: pick(s.title, s.title_ar, locale),
      description: pick(s.description, s.description_ar, locale),
    })
  );

  return (
    <>
      {/* ── Masthead ───────────────────────────────────────────────── */}
      <section className="pt-28 sm:pt-36 md:pt-44 pb-14 sm:pb-20 md:pb-24 border-b border-[var(--color-hairline)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-4 sm:mb-6">
              {content.page_subtitle || "01 — Practice Areas"}
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h1 className="font-display text-[clamp(2.25rem,7vw,6.5rem)] leading-[1] tracking-[-0.035em] text-[var(--color-ink)]">
              {content.page_title || "Services."}
              <span className="text-[var(--color-saffron-deep)]">.</span>
            </h1>
            {content.intro_paragraph && (
              <p className="mt-6 sm:mt-10 max-w-[62ch] text-[var(--color-ink-soft)] leading-[1.8] text-base sm:text-lg">
                {content.intro_paragraph}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Services list (alternating editorial) ─────────────────── */}
      <section className="py-6 sm:py-8 md:py-16">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10">
          {services.length === 0 ? (
            <div className="border border-dashed border-[var(--color-hairline)] py-20 text-center text-[var(--color-muted)] font-mono text-xs uppercase tracking-[0.14em]">
              {content.empty_state || (locale === "ar" ? "لا توجد خدمات منشورة بعد." : "No services published yet.")}
            </div>
          ) : (
            <ol className="divide-y divide-[var(--color-ink)]/10 border-y border-[var(--color-ink)]/10">
              {services.map((s, i) => {
                const reverse = locale === "ar" ? i % 2 === 0 : i % 2 === 1;
                const phases =
                  locale === "ar"
                    ? ["التصور", "الهندسة", "الإنشاء", "التسليم"]
                    : ["Concept", "Engineering", "Construction", "Handover"];
                return (
                  <li key={s.id} className="py-10 sm:py-16 md:py-24">
                    <div className="grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-6 sm:gap-y-10 items-center">
                      <figure
                        className={`col-span-12 md:col-span-6 relative aspect-[4/3] sm:aspect-[5/4] overflow-hidden bg-[var(--color-linen)] ${
                          reverse ? "md:order-2" : ""
                        }`}
                      >
                        {s.image_url && (
                          <Image
                            src={s.image_url}
                            alt={s.title || "Service"}
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02]"
                          />
                        )}
                        <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[var(--color-ink)]/10" />
                      </figure>

                      <div className={`col-span-12 md:col-span-6 ${reverse ? "md:order-1 md:pr-12" : "md:pl-12"}`}>
                        <div className="flex items-baseline gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] tabular-nums">
                            S/0{i + 1}
                          </span>
                          <span className="h-px flex-1 bg-[var(--color-ink)]/15" />
                        </div>
                        <h2 className="font-display text-2xl sm:text-3xl md:text-[2.75rem] leading-[1.05] tracking-[-0.025em] text-[var(--color-ink)] mb-4 sm:mb-6">
                          {s.title}
                        </h2>
                        <p className="text-[var(--color-ink-soft)] leading-[1.8] text-[15px] sm:text-[17px] max-w-[52ch]">
                          {s.description}
                        </p>

                        <div className="mt-6 sm:mt-10 grid grid-cols-2 gap-y-3 gap-x-4 sm:gap-x-6 max-w-md font-mono text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-[var(--color-ink)]">
                          {phases.map((phase) => (
                            <span key={phase} className="flex items-center gap-2 sm:gap-3 min-h-[36px]">
                              <span aria-hidden className="h-px w-3 sm:w-4 bg-[var(--color-ink)] shrink-0" />
                              {phase}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--color-hairline)] bg-[var(--color-parchment)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 py-12 sm:py-20 md:py-28 grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-6 sm:gap-y-8 items-center">
          <h2 className="col-span-12 md:col-span-8 font-display text-2xl sm:text-3xl md:text-[3rem] leading-[1.1] tracking-[-0.025em] text-[var(--color-ink)] max-w-[22ch]">
            {content.cta_title || "Considering a project? Let's speak before the first drawing."}
          </h2>
          <div className="col-span-12 md:col-span-4 flex md:justify-end">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-[var(--color-ink)] text-[var(--color-bone)] px-7 min-h-[48px] py-3.5 text-[12px] font-medium tracking-[0.1em] uppercase hover:bg-[var(--color-saffron-deep)] active:bg-[var(--color-saffron-deep)] transition-colors duration-300 w-full sm:w-auto justify-center"
            >
              {content.cta_btn}
              <span aria-hidden className="material-symbols-outlined text-[18px]">
                {locale === "ar" ? "arrow_back" : "arrow_forward"}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
