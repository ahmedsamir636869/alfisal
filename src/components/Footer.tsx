import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getContentServer } from "@/lib/cms";
import { getLocale } from "@/lib/i18n.server";

export default async function Footer() {
  const [cookieStore, locale] = await Promise.all([cookies(), getLocale()]);
  const supabase = await createClient(cookieStore);
  const content = await getContentServer(supabase, "footer", locale);

  const offices = [
    { label: content.office1, href: content.office1_url || "#" },
    { label: content.office2, href: content.office2_url || "#" },
    { label: content.office3, href: content.office3_url || "#" },
  ];

  const resources = [
    { label: content.resource1_text, href: content.resource1_url || "#" },
    { label: content.resource2_text, href: content.resource2_url || "#" },
    { label: content.resource3_text, href: content.resource3_url || "#" },
  ];

  const legal = [
    { label: content.legal1_text, href: content.legal1_url || "#" },
    { label: content.legal2_text, href: content.legal2_url || "#" },
  ];

  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-bone)] border-t border-[var(--color-ink)]/40">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 pt-14 sm:pt-20 pb-[calc(3rem+env(safe-area-inset-bottom))] sm:pb-12">
        {/* ── Lead ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-10 sm:gap-y-14 pb-10 sm:pb-16 border-b border-[var(--color-bone)]/15">
          <div className="col-span-12 md:col-span-6 lg:col-span-7">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-bone)]/55 mb-4 sm:mb-6">
              {content.footer_label || "Correspondence"}
            </p>
            <p className="font-display text-[clamp(1.5rem,5vw,4.5rem)] leading-[1.1] tracking-[-0.025em] max-w-[22ch]">
              {content.footer_heading ||
                "Let's put something well-made into the world."}
            </p>
            <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-3 bg-[var(--color-bone)] text-[var(--color-ink)] px-7 min-h-[48px] py-3.5 text-[12px] font-medium tracking-[0.1em] uppercase hover:bg-[var(--color-saffron)] active:bg-[var(--color-saffron)] transition-colors duration-300"
              >
                Start a conversation
                <span aria-hidden className="material-symbols-outlined text-[18px] transition-transform duration-500 group-hover:translate-x-1">arrow_forward</span>
              </Link>
              <a
                href={`mailto:info@alfisalcon.com`}
                className="inline-flex items-center justify-center gap-3 text-[var(--color-bone)] px-7 min-h-[48px] py-3.5 text-[12px] font-medium tracking-[0.1em] uppercase border border-[var(--color-bone)]/20 hover:border-[var(--color-bone)] active:bg-[var(--color-bone)]/10 transition-colors"
              >
                Email the studio
              </a>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-5 grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
            <FooterList title={content.offices_title || "Studios"} items={offices} />
            <FooterList title={content.resources_title || "Resources"} items={resources} />
          </div>
        </div>

        {/* ── Brandmark line ──────────────────────────────────────── */}
        <div className="py-10 sm:py-14 md:py-20 relative overflow-hidden">
          <div className="font-display leading-none tracking-[-0.04em] text-[clamp(3.5rem,16vw,16rem)] whitespace-nowrap text-[var(--color-bone)]/90 select-none">
            {(content.brand_name || "Alfisal.").toUpperCase()}
            <span className="text-[var(--color-saffron)]">.</span>
          </div>
        </div>

        {/* ── Meta row ────────────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-5 sm:gap-y-6 border-t border-[var(--color-bone)]/15 pt-6 sm:pt-8">
          <p className="col-span-12 md:col-span-5 text-[var(--color-bone)]/60 text-sm leading-relaxed max-w-[52ch]">
            {content.brand_description}
          </p>
          <div className="col-span-12 md:col-span-4 flex flex-col gap-2 text-[var(--color-bone)]/60 text-sm">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-bone)]/45 mb-1">
              Legal
            </span>
            <ul className="flex flex-wrap gap-x-5 gap-y-3">
              {legal.map((l, i) =>
                l.label ? (
                  <li key={i}>
                    <Link href={l.href} className="hover:text-[var(--color-bone)] transition-colors min-h-[44px] inline-flex items-center">
                      {l.label}
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-3 flex md:justify-end text-[var(--color-bone)]/50 text-xs tracking-[0.12em] uppercase font-mono">
            © {new Date().getFullYear()} · {content.copyright || "Alfisal"}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterList({
  title,
  items,
}: {
  title: string;
  items: { label?: string; href: string }[];
}) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-bone)]/45 mb-5">
        {title}
      </p>
      <ul className="space-y-1 sm:space-y-3 text-[var(--color-bone)]/80">
        {items.map((it, i) =>
          it.label ? (
            <li key={i}>
              <Link
                href={it.href}
                className="inline-flex items-center gap-2 hover:text-[var(--color-bone)] transition-colors group min-h-[44px] py-1.5"
              >
                <span aria-hidden className="h-px w-3 bg-[var(--color-bone)]/30 group-hover:w-5 group-hover:bg-[var(--color-saffron)] transition-all duration-500 shrink-0" />
                {it.label}
              </Link>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}
