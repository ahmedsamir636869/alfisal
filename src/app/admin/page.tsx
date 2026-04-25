"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { DEFAULT_CONTENT, DEFAULT_IMAGES } from "@/lib/cms";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    contentCount: 0,
    imageCount: 0,
    lastUpdated: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const supabase = createClient();
    const [contentRes, imageRes] = await Promise.all([
      supabase.from("site_content").select("updated_at", { count: "exact" }),
      supabase.from("site_images").select("updated_at", { count: "exact" }),
    ]);

    const allDates = [
      ...(contentRes.data || []).map((r) => r.updated_at),
      ...(imageRes.data || []).map((r) => r.updated_at),
    ]
      .filter(Boolean)
      .sort()
      .reverse();

    setStats({
      contentCount: contentRes.count || 0,
      imageCount: imageRes.count || 0,
      lastUpdated: allDates[0]
        ? new Date(allDates[0]).toLocaleString()
        : "Never",
    });
    setLoading(false);
  }

  const sections = [
    {
      code: "02",
      title: "Hero",
      href: "/admin/hero",
      desc: "Landing headline, lead paragraph and stats ribbon.",
      textKeys: Object.keys(DEFAULT_CONTENT.hero || {}).length,
      imageKeys: Object.keys(DEFAULT_IMAGES.hero || {}).length,
    },
    {
      code: "03",
      title: "Principles",
      href: "/admin/values",
      desc: "Operating principles displayed on the home page.",
      textKeys: Object.keys(DEFAULT_CONTENT.values || {}).length,
      imageKeys: Object.keys(DEFAULT_IMAGES.values || {}).length,
    },
    {
      code: "04",
      title: "Featured projects",
      href: "/admin/projects",
      desc: "Editorial spread of selected works on the home page.",
      textKeys: Object.keys(DEFAULT_CONTENT.featured_projects || {}).length,
      imageKeys: Object.keys(DEFAULT_IMAGES.featured_projects || {}).length,
    },
    {
      code: "05",
      title: "Services",
      href: "/admin/services",
      desc: "Practice areas with alternating image / copy rows.",
      textKeys: Object.keys(DEFAULT_CONTENT.services || {}).length,
      imageKeys: Object.keys(DEFAULT_IMAGES.services || {}).length,
    },
    {
      code: "06",
      title: "Studio",
      href: "/admin/about",
      desc: "Mission, philosophy, statistics band and principles list.",
      textKeys: Object.keys(DEFAULT_CONTENT.about || {}).length,
      imageKeys: Object.keys(DEFAULT_IMAGES.about || {}).length,
    },
    {
      code: "07",
      title: "Contact",
      href: "/admin/contact",
      desc: "Contact form copy, address, phone and studio hours.",
      textKeys: Object.keys(DEFAULT_CONTENT.contact || {}).length,
      imageKeys: Object.keys(DEFAULT_IMAGES.contact || {}).length,
    },
    {
      code: "08",
      title: "CTA band",
      href: "/admin/cta",
      desc: "Pull-quote call to action on the home page.",
      textKeys: Object.keys(DEFAULT_CONTENT.cta_banner || {}).length,
      imageKeys: Object.keys(DEFAULT_IMAGES.cta_banner || {}).length,
    },
    {
      code: "09",
      title: "Footer",
      href: "/admin/footer",
      desc: "Brandmark, studios, legal and correspondence block.",
      textKeys: Object.keys(DEFAULT_CONTENT.footer || {}).length,
      imageKeys: Object.keys(DEFAULT_IMAGES.footer || {}).length,
    },
    {
      code: "01",
      title: "Navigation",
      href: "/admin/navigation",
      desc: "Top bar links, brand label and primary call to action.",
      textKeys: Object.keys(DEFAULT_CONTENT.navigation || {}).length,
      imageKeys: Object.keys(DEFAULT_IMAGES.navigation || {}).length,
    },
  ];

  return (
    <div className="max-w-6xl">
      {/* Masthead */}
      <div className="flex items-end justify-between flex-wrap gap-8 mb-14">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--admin-text-muted)] mb-5">
            00 — Overview
          </div>
          <h1 className="text-[clamp(2.2rem,4vw,3.2rem)] font-display text-white tracking-tight leading-[1.05]">
            Every word and image
            <br />
            <span className="text-[var(--admin-accent)]">on alfisalcon.com.</span>
          </h1>
          <p className="text-[var(--admin-text-soft)] mt-5 max-w-[55ch] leading-relaxed">
            This console writes directly to the published site. Edit with care —
            changes are saved to the studio database the moment you press save.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="group inline-flex items-center gap-3 border border-[var(--admin-border)] px-5 py-3 text-[11px] font-mono uppercase tracking-[0.25em] text-white hover:bg-[var(--admin-accent)]/10 transition-colors"
        >
          <span>Preview live site</span>
          <span className="transition-transform group-hover:translate-x-1" aria-hidden>↗</span>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-[var(--admin-border)] divide-x divide-[var(--admin-border)]">
        <Stat code="A" label="Content blocks" value={loading ? "···" : String(stats.contentCount).padStart(3, "0")} />
        <Stat code="B" label="Images on file"  value={loading ? "···" : String(stats.imageCount).padStart(3, "0")} />
        <Stat code="C" label="Last edit"        value={loading ? "···" : stats.lastUpdated} small />
      </div>

      {/* Sections — editorial index */}
      <div className="mt-16 mb-6 flex items-end justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--admin-text-muted)] mb-3">Index</div>
          <h2 className="text-2xl font-display text-white tracking-tight">Editable sections</h2>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-dim)]">
          {sections.length} sections
        </div>
      </div>

      <div className="border-t border-[var(--admin-border)]">
        {sections
          .slice()
          .sort((a, b) => a.code.localeCompare(b.code))
          .map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group grid grid-cols-[auto_1fr_auto_auto] gap-6 md:gap-10 items-center py-6 border-b border-[var(--admin-border)] px-2 hover:bg-[var(--admin-accent)]/5 transition-colors focus-visible:outline-none focus-visible:bg-[var(--admin-accent)]/8"
            >
              <span className="font-mono text-[11px] tracking-widest text-[var(--admin-accent)] w-8">
                {section.code}
              </span>
              <div>
                <div className="text-white text-lg font-display leading-tight">{section.title}</div>
                <p className="text-[var(--admin-text-soft)] text-sm mt-1 max-w-[60ch]">{section.desc}</p>
              </div>
              <div className="hidden md:flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-muted)]">
                <span>{section.textKeys} fields</span>
                {section.imageKeys > 0 && <span>{section.imageKeys} images</span>}
              </div>
              <span aria-hidden className="text-[var(--admin-text-dim)] group-hover:text-[var(--admin-accent)] transition-all group-hover:translate-x-1">→</span>
            </Link>
          ))}
      </div>
    </div>
  );
}

function Stat({
  code, label, value, small = false,
}: { code: string; label: string; value: string; small?: boolean }) {
  return (
    <div className="p-7">
      <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--admin-text-muted)] mb-4">
        <span className="text-[var(--admin-accent)]">{code}</span>
        <span>{label}</span>
      </div>
      <div className={`text-white font-display leading-none ${small ? "text-lg" : "text-4xl tabular-nums"}`}>
        {value}
      </div>
    </div>
  );
}
