"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { DEFAULT_CONTENT, DEFAULT_IMAGES, DEFAULT_VIDEOS } from "@/lib/cms";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    contentCount: 0,
    imageCount: 0,
    videoCount: 0,
    lastUpdated: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const supabase = createClient();
    const [contentRes, imageRes, videoRes] = await Promise.all([
      supabase.from("site_content").select("updated_at", { count: "exact" }),
      supabase.from("site_images").select("updated_at", { count: "exact" }),
      supabase.from("site_videos").select("updated_at", { count: "exact" }),
    ]);

    const allDates = [
      ...(contentRes.data || []).map((r) => r.updated_at),
      ...(imageRes.data || []).map((r) => r.updated_at),
      ...(videoRes.data || []).map((r) => r.updated_at),
    ]
      .filter(Boolean)
      .sort()
      .reverse();

    setStats({
      contentCount: contentRes.count || 0,
      imageCount: imageRes.count || 0,
      videoCount: videoRes.count || 0,
      lastUpdated: allDates[0]
        ? new Date(allDates[0]).toLocaleString()
        : "Never",
    });
    setLoading(false);
  }

  const sections = [
    {
      code: "01",
      title: "Navigation",
      href: "/admin/navigation",
      icon: "menu",
      desc: "Top bar links, brand label and primary call to action.",
      textKeys: Object.keys(DEFAULT_CONTENT.navigation || {}).length,
      mediaKeys: Object.keys(DEFAULT_IMAGES.navigation || {}).length + Object.keys(DEFAULT_VIDEOS.navigation || {}).length,
    },
    {
      code: "02",
      title: "Hero",
      href: "/admin/hero",
      icon: "featured_video",
      desc: "Landing headline, lead paragraph and stats ribbon.",
      textKeys: Object.keys(DEFAULT_CONTENT.hero || {}).length,
      mediaKeys: Object.keys(DEFAULT_IMAGES.hero || {}).length + Object.keys(DEFAULT_VIDEOS.hero || {}).length,
    },
    {
      code: "03",
      title: "Principles",
      href: "/admin/values",
      icon: "star",
      desc: "Operating principles displayed on the home page.",
      textKeys: Object.keys(DEFAULT_CONTENT.values || {}).length,
      mediaKeys: Object.keys(DEFAULT_IMAGES.values || {}).length,
    },
    {
      code: "04",
      title: "Featured projects",
      href: "/admin/projects",
      icon: "photo_library",
      desc: "Editorial spread of selected works on the home page.",
      textKeys: Object.keys(DEFAULT_CONTENT.featured_projects || {}).length,
      mediaKeys: Object.keys(DEFAULT_IMAGES.featured_projects || {}).length + Object.keys(DEFAULT_VIDEOS.featured_projects || {}).length,
    },
    {
      code: "05",
      title: "Services",
      href: "/admin/services",
      icon: "build",
      desc: "Practice areas with alternating image / copy rows.",
      textKeys: Object.keys(DEFAULT_CONTENT.services || {}).length,
      mediaKeys: Object.keys(DEFAULT_IMAGES.services || {}).length + Object.keys(DEFAULT_VIDEOS.services || {}).length,
    },
    {
      code: "06",
      title: "Studio",
      href: "/admin/about",
      icon: "info",
      desc: "Mission, philosophy, statistics band and principles list.",
      textKeys: Object.keys(DEFAULT_CONTENT.about || {}).length,
      mediaKeys: Object.keys(DEFAULT_IMAGES.about || {}).length + Object.keys(DEFAULT_VIDEOS.about || {}).length,
    },
    {
      code: "07",
      title: "Contact",
      href: "/admin/contact",
      icon: "contact_mail",
      desc: "Contact form copy, address, phone and studio hours.",
      textKeys: Object.keys(DEFAULT_CONTENT.contact || {}).length,
      mediaKeys: Object.keys(DEFAULT_IMAGES.contact || {}).length,
    },
    {
      code: "08",
      title: "CTA band",
      href: "/admin/cta",
      icon: "campaign",
      desc: "Pull-quote call to action on the home page.",
      textKeys: Object.keys(DEFAULT_CONTENT.cta_banner || {}).length,
      mediaKeys: Object.keys(DEFAULT_IMAGES.cta_banner || {}).length,
    },
    {
      code: "09",
      title: "Footer",
      href: "/admin/footer",
      icon: "bottom_navigation",
      desc: "Brandmark, studios, legal and correspondence block.",
      textKeys: Object.keys(DEFAULT_CONTENT.footer || {}).length,
      mediaKeys: Object.keys(DEFAULT_IMAGES.footer || {}).length,
    },
  ];

  return (
    <div className="max-w-6xl admin-page-enter">
      {/* Masthead */}
      <div className="flex flex-col md:flex-row md:items-end justify-between flex-wrap gap-8 mb-14">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--admin-text-muted)] mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[var(--admin-accent)]">dashboard</span>
            00 — Overview
          </div>
          <h1 className="text-[clamp(2rem,4vw,3.2rem)] font-display text-white tracking-tight leading-[1.05]">
            Every word and image
            <br />
            <span className="text-[var(--admin-accent)]">on alfisalcon.com.</span>
          </h1>
          <p className="text-[var(--admin-text-soft)] mt-5 max-w-[55ch] leading-relaxed text-sm sm:text-base">
            This console writes directly to the published site. Edit with care —
            changes are saved to the studio database the moment you press save.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="admin-focus group inline-flex items-center gap-3 border border-[var(--admin-border)] px-5 py-3 text-[11px] font-mono uppercase tracking-[0.25em] text-white hover:bg-[var(--admin-accent)]/10 hover:border-[var(--admin-border-hover)] transition-all duration-200 min-h-[44px] rounded-sm active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          <span>Preview live site</span>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 border border-[var(--admin-border)] divide-x divide-y md:divide-y-0 divide-[var(--admin-border)] rounded-sm overflow-hidden">
        <Stat icon="text_fields" label="Content blocks" value={loading ? "···" : String(stats.contentCount).padStart(3, "0")} loading={loading} />
        <Stat icon="image" label="Images on file"  value={loading ? "···" : String(stats.imageCount).padStart(3, "0")} loading={loading} />
        <Stat icon="videocam" label="Videos on file" value={loading ? "···" : String(stats.videoCount).padStart(3, "0")} loading={loading} />
        <Stat icon="schedule" label="Last edit" value={loading ? "···" : stats.lastUpdated} small loading={loading} />
      </div>

      {/* Sections — editorial index */}
      <div className="mt-16 mb-6 flex items-end justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--admin-text-muted)] mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px] text-[var(--admin-accent)]">list_alt</span>
            Index
          </div>
          <h2 className="text-2xl font-display text-white tracking-tight">Editable sections</h2>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-dim)] bg-[var(--admin-bg)] px-2 py-1 rounded-sm">
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
              className="admin-focus group grid grid-cols-[auto_1fr_auto_auto] gap-4 sm:gap-6 md:gap-10 items-center py-5 sm:py-6 border-b border-[var(--admin-border)] px-3 hover:bg-[var(--admin-accent)]/5 transition-all duration-200 min-h-[44px] rounded-sm"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-[var(--admin-accent)] opacity-60 group-hover:opacity-100 transition-opacity">{section.icon}</span>
                <span className="font-mono text-[11px] tracking-widest text-[var(--admin-text-dim)] w-6">
                  {section.code}
                </span>
              </div>
              <div>
                <div className="text-white text-base sm:text-lg font-display leading-tight group-hover:text-[var(--admin-accent)] transition-colors duration-200">{section.title}</div>
                <p className="text-[var(--admin-text-soft)] text-xs sm:text-sm mt-1 max-w-[60ch]">{section.desc}</p>
              </div>
              <div className="hidden md:flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--admin-text-dim)]">
                <span className="bg-[var(--admin-bg)] px-2 py-0.5 rounded-sm">{section.textKeys} fields</span>
                {section.mediaKeys > 0 && <span className="bg-[var(--admin-bg)] px-2 py-0.5 rounded-sm">{section.mediaKeys} media</span>}
              </div>
              <span
                aria-hidden
                className="material-symbols-outlined text-[18px] text-[var(--admin-text-dim)] group-hover:text-[var(--admin-accent)] transition-all duration-200 group-hover:translate-x-1"
              >
                arrow_forward
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}

function Stat({
  icon, label, value, small = false, loading = false,
}: { icon: string; label: string; value: string; small?: boolean; loading?: boolean }) {
  return (
    <div className="p-5 sm:p-7 bg-[var(--admin-surface-card)]">
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-muted)] mb-4">
        <span className="material-symbols-outlined text-[14px] text-[var(--admin-accent)]">{icon}</span>
        <span>{label}</span>
      </div>
      <div className={`text-white font-display leading-none ${small ? "text-base sm:text-lg" : "text-3xl sm:text-4xl tabular-nums"} ${loading ? "admin-skeleton h-8 w-20 rounded-sm" : ""}`}>
        {loading ? "" : value}
      </div>
    </div>
  );
}
