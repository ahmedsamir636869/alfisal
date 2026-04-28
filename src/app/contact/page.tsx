import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getContentServer } from "@/lib/cms";
import { getLocale } from "@/lib/i18n.server";
import { responsiveFs } from "@/lib/responsive-fs";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with Alfisal. Reach us for new commissions, consultations, media enquiries, or careers.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Alfisal",
    description:
      "Start a conversation with Alfisal. Reach us for new commissions, consultations, or careers.",
    url: "/contact",
  },
};

export const revalidate = 0;

export default async function ContactPage() {
  const [cookieStore, locale] = await Promise.all([cookies(), getLocale()]);
  const supabase = await createClient(cookieStore);
  const content = await getContentServer(supabase, "contact", locale);

  return (
    <>
      {/* ── Masthead ──────────────────────────────────────────────── */}
      <section className="pt-28 sm:pt-36 md:pt-44 pb-14 sm:pb-20 md:pb-28 border-b border-[var(--color-hairline)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-4 sm:mb-6" style={responsiveFs(content, "page_subtitle")}>
              {content.page_subtitle || "01 — Get in touch"}
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h1 className="font-display text-[clamp(2.25rem,7vw,6.5rem)] leading-[1] tracking-[-0.035em] text-[var(--color-ink)]" style={responsiveFs(content, "page_title")}>
              {content.page_title || "Begin a correspondence."}
              <span className="text-[var(--color-saffron-deep)]">.</span>
            </h1>
            <p className="mt-6 sm:mt-10 max-w-[62ch] text-[var(--color-ink-soft)] leading-[1.8] text-base sm:text-lg" style={responsiveFs(content, "page_description")}>
              {content.page_description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact split: form + info ───────────────────────────── */}
      <section className="py-12 sm:py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-10 sm:gap-y-16">
          <div className="col-span-12 md:col-span-7">
            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] tabular-nums">
                B/01
              </span>
              <span className="h-px flex-1 bg-[var(--color-ink)]/15" />
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)]">
                {content.form_title || "Send a brief"}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-[2.5rem] leading-[1.05] tracking-[-0.025em] text-[var(--color-ink)] mb-4" style={responsiveFs(content, "form_heading")}>
              {content.form_heading || "Tell us what you're building."}
            </h2>
            <p className="text-[var(--color-ink-soft)] leading-[1.8] max-w-[52ch] mb-10" style={responsiveFs(content, "form_intro")}>
              {content.form_intro ||
                "Share the broad shape of the project — location, scale, programme. We reply within one working day with first questions and next steps."}
            </p>

            <ContactForm locale={locale} />
          </div>

          <aside className="col-span-12 md:col-span-4 md:col-start-9 space-y-12">
            <ContactBlock
              index="C/01"
              label="Email"
              value={content.contact_email || "info@alfisalcon.com"}
              href={`mailto:${content.contact_email || "info@alfisalcon.com"}`}
            />
            <ContactBlock
              index="C/02"
              label="Telephone"
              value={content.contact_phone || "+966 12 345 6789"}
              href={`tel:${content.contact_phone || ""}`}
            />
            <ContactBlock
              index="C/03"
              label="Studio"
              value={content.contact_address || "12 Industrial Park, Riyadh, Saudi Arabia"}
            />
            <ContactBlock
              index="C/04"
              label={content.hours_title || "Studio hours"}
              value={content.hours_text || "Sun–Thu, 09:00 – 18:00 AST"}
            />
          </aside>
        </div>
      </section>
    </>
  );
}

function ContactBlock({
  index,
  label,
  value,
  href,
}: {
  index: string;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="border-t border-[var(--color-ink)]/10 pt-5">
      <div className="flex items-baseline gap-4 mb-3">
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-muted)] tabular-nums">
          {index}
        </span>
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-muted)]">
          {label}
        </span>
      </div>
      <p className="font-display text-2xl md:text-[1.75rem] leading-[1.2] tracking-[-0.015em] text-[var(--color-ink)]">
        {value}
      </p>
    </div>
  );

  return href ? (
    <a
      href={href}
      className="block group hover:text-[var(--color-saffron-deep)] transition-colors"
    >
      {inner}
    </a>
  ) : (
    inner
  );
}
