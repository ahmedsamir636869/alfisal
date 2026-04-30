"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import MediaCard from "./MediaCard";
import {
  DEFAULT_CONTENT,
  DEFAULT_IMAGES,
  DEFAULT_VIDEOS,
  upsertContent,
  upsertImage,
  uploadImage,
  upsertVideo,
  uploadVideo,
} from "@/lib/cms";
import type {
  LocalisedContentMap,
  LocalisedImageMap,
  LocalisedVideoMap,
} from "./AdminSectionPage";

interface SectionEditorProps {
  section: string;
  sectionTitle: string;
  sectionIcon: string;
  content: LocalisedContentMap;
  images: LocalisedImageMap;
  videos: LocalisedVideoMap;
  onContentChange: (
    key: string,
    patch: Partial<{ value: string; value_ar: string }>
  ) => void;
  onImageChange: (
    key: string,
    patch: Partial<{ url: string; alt: string; alt_ar: string }>
  ) => void;
  onVideoChange: (
    key: string,
    patch: Partial<{ url: string; alt: string; alt_ar: string }>
  ) => void;
}

export default function SectionEditor({
  section,
  sectionTitle,
  sectionIcon,
  content,
  images,
  videos,
  onContentChange,
  onImageChange,
  onVideoChange,
}: SectionEditorProps) {
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const videoInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const sectionContentDefs = DEFAULT_CONTENT[section] || {};
  const sectionImageDefs = DEFAULT_IMAGES[section] || {};
  const sectionVideoDefs = DEFAULT_VIDEOS[section] || {};

  function flashSaved(key: string) {
    setSavedKeys((prev) => new Set(prev).add(key));
    setTimeout(() => {
      setSavedKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 2200);
  }

  async function handleSaveContent(key: string) {
    const row = content[key] || { value: "", value_ar: "" };
    const fsMobKey = `${key}_fontsize_mobile`;
    const fsDskKey = `${key}_fontsize_desktop`;
    const fsMob = content[fsMobKey];
    const fsDsk = content[fsDskKey];
    setSaving((prev) => ({ ...prev, [key]: true }));
    try {
      await upsertContent(section, key, row.value, row.value_ar ?? "");
      if (fsMob?.value?.trim()) {
        await upsertContent(section, fsMobKey, fsMob.value, "");
      }
      if (fsDsk?.value?.trim()) {
        await upsertContent(section, fsDskKey, fsDsk.value, "");
      }
      flashSaved(key);
    } catch (err) {
      console.error("Failed to save:", err);
    }
    setSaving((prev) => ({ ...prev, [key]: false }));
  }

  async function handleImageUpload(key: string, file: File) {
    setUploading((prev) => ({ ...prev, [key]: true }));
    try {
      const url = await uploadImage(file, section);
      const current = images[key] || { url: "", alt: "", alt_ar: "" };
      const alt = current.alt || sectionImageDefs[key]?.alt || key;
      await upsertImage(section, key, url, alt, current.alt_ar ?? "");
      onImageChange(key, { url });
      flashSaved(`img_${key}`);
    } catch (err) {
      console.error("Failed to upload:", err);
    }
    setUploading((prev) => ({ ...prev, [key]: false }));
  }

  async function handleSaveImage(key: string) {
    const row = images[key] || { url: "", alt: "", alt_ar: "" };
    setSaving((prev) => ({ ...prev, [`img_${key}`]: true }));
    try {
      await upsertImage(section, key, row.url, row.alt, row.alt_ar ?? "");
      flashSaved(`img_${key}`);
    } catch (err) {
      console.error("Failed to save image:", err);
    }
    setSaving((prev) => ({ ...prev, [`img_${key}`]: false }));
  }

  async function handleVideoUpload(key: string, file: File) {
    setUploading((prev) => ({ ...prev, [`vid_${key}`]: true }));
    try {
      const url = await uploadVideo(file, section);
      const current = videos[key] || { url: "", alt: "", alt_ar: "" };
      const alt = current.alt || sectionVideoDefs[key]?.alt || key;
      await upsertVideo(section, key, url, alt, current.alt_ar ?? "");
      onVideoChange(key, { url });
      flashSaved(`vid_${key}`);
    } catch (err) {
      console.error("Failed to upload video:", err);
    }
    setUploading((prev) => ({ ...prev, [`vid_${key}`]: false }));
  }

  async function handleSaveVideo(key: string) {
    const row = videos[key] || { url: "", alt: "", alt_ar: "" };
    setSaving((prev) => ({ ...prev, [`vid_${key}`]: true }));
    try {
      await upsertVideo(section, key, row.url, row.alt, row.alt_ar ?? "");
      flashSaved(`vid_${key}`);
    } catch (err) {
      console.error("Failed to save video:", err);
    }
    setSaving((prev) => ({ ...prev, [`vid_${key}`]: false }));
  }

  return (
    <div className="max-w-5xl">
      {/* Masthead */}
      <div className="mb-12">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--admin-text-muted)] mb-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-[18px] text-[var(--admin-accent)]">{sectionIcon}</span>
          <span>Section editor</span>
          <span className="ms-auto inline-flex items-center gap-2 text-[var(--admin-text-soft)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--admin-accent)] animate-pulse" />
            Bilingual · EN / عربي
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display text-white tracking-tight">
          {sectionTitle}
        </h1>
        <p className="text-[var(--admin-text-soft)] text-sm mt-3 max-w-[60ch] leading-relaxed">
          Each field accepts an English value and an Arabic translation. Leave
          the Arabic field empty to fall back to the English copy.
        </p>
      </div>

      {/* Text Fields */}
      {Object.keys(sectionContentDefs).length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--admin-border)]">
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--admin-text-soft)] flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-[var(--admin-accent)]">text_fields</span>
              Text content
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-dim)] bg-[var(--admin-bg)] px-2 py-1 rounded-sm">
              {Object.keys(sectionContentDefs).length} fields
            </span>
          </div>

          <div className="divide-y divide-[var(--admin-border)]">
            {Object.entries(sectionContentDefs).map(([key, def]) => {
              const row = content[key] || { value: "", value_ar: "" };
              const enEmpty = !row.value?.trim();
              const arEmpty = !row.value_ar?.trim();
              const fsMobKey = `${key}_fontsize_mobile`;
              const fsDskKey = `${key}_fontsize_desktop`;
              const mobFs = content[fsMobKey]?.value || "";
              const dskFs = content[fsDskKey]?.value || "";
              return (
                <div
                  key={key}
                  className="py-7 grid md:grid-cols-[220px_1fr_auto] gap-6 md:gap-8 items-start"
                >
                  <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-soft)] pt-3">
                    {def.label}
                    <div className="text-[var(--admin-text-dim)] mt-1 normal-case tracking-normal font-mono text-[10px]">
                      {key}
                    </div>
                  </label>

                  <div className="flex-1 space-y-5">
                    {/* English */}
                    <FieldRow
                      flagLabel="EN"
                      flagTone="neutral"
                      type={def.type}
                      value={row.value}
                      placeholder={def.en}
                      onChange={(v) => onContentChange(key, { value: v })}
                    />

                    {/* Arabic */}
                    <FieldRow
                      flagLabel="عربي"
                      flagTone="accent"
                      type={def.type}
                      dir="rtl"
                      value={row.value_ar}
                      placeholder={
                        def.ar ||
                        (enEmpty
                          ? "الترجمة العربية"
                          : "اتركه فارغاً للاحتياط بالنص الإنجليزي")
                      }
                      onChange={(v) => onContentChange(key, { value_ar: v })}
                      hint={
                        arEmpty && !enEmpty
                          ? "Falls back to English"
                          : undefined
                      }
                    />

                    {/* Responsive font size controls */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 border-t border-white/5 mt-1">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-5 px-1.5 text-[10px] font-mono tracking-[0.18em] uppercase border text-[var(--admin-text-dim)] border-white/10 rounded-sm">
                        Aa
                      </span>

                      {/* Mobile */}
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-[var(--admin-text-dim)]" aria-hidden>smartphone</span>
                        <input
                          type="number"
                          step="0.0625"
                          min="0"
                          value={mobFs}
                          onChange={(e) =>
                            onContentChange(fsMobKey, { value: e.target.value })
                          }
                          className="admin-focus w-[68px] px-2 py-1 bg-transparent border border-white/10 text-white text-[12px] font-mono text-center focus:outline-none focus:border-[var(--admin-accent)] transition-colors rounded-sm min-h-[36px]"
                          placeholder="—"
                          title="Font size on mobile (rem)"
                        />
                      </div>

                      <span className="text-[var(--admin-text-dim)] text-[10px]">→</span>

                      {/* Desktop */}
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-[var(--admin-text-dim)]" aria-hidden>monitor</span>
                        <input
                          type="number"
                          step="0.0625"
                          min="0"
                          value={dskFs}
                          onChange={(e) =>
                            onContentChange(fsDskKey, { value: e.target.value })
                          }
                          className="admin-focus w-[68px] px-2 py-1 bg-transparent border border-white/10 text-white text-[12px] font-mono text-center focus:outline-none focus:border-[var(--admin-accent)] transition-colors rounded-sm min-h-[36px]"
                          placeholder="—"
                          title="Font size on desktop (rem)"
                        />
                      </div>

                      <span className="text-[10px] font-mono text-[var(--admin-text-dim)]">
                        rem
                      </span>

                      {/* Live preview */}
                      {(mobFs || dskFs) && (
                        <span className="flex items-end gap-2 ml-auto">
                          {mobFs && (
                            <span
                              className="text-[var(--admin-text-soft)] leading-none"
                              style={{ fontSize: `${Math.min(parseFloat(mobFs) || 1, 3)}rem` }}
                              title={`Mobile: ${mobFs}rem`}
                            >A</span>
                          )}
                          {dskFs && (
                            <span
                              className="text-white leading-none"
                              style={{ fontSize: `${Math.min(parseFloat(dskFs) || 1, 3)}rem` }}
                              title={`Desktop: ${dskFs}rem`}
                            >A</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <SaveButton
                    saving={saving[key]}
                    saved={savedKeys.has(key)}
                    onClick={() => handleSaveContent(key)}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Unified Media (Images + Videos) ────────────────────── */}
      {(Object.keys(sectionImageDefs).length > 0 ||
        Object.keys(sectionVideoDefs).length > 0) && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--admin-border)]">
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--admin-text-soft)] flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-[var(--admin-accent)]">perm_media</span>
              Media
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-dim)] bg-[var(--admin-bg)] px-2 py-1 rounded-sm">
              {(() => {
                const allKeys = new Set([
                  ...Object.keys(sectionImageDefs),
                  ...Object.keys(sectionVideoDefs),
                ]);
                return allKeys.size;
              })()}{" "}
              slots
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {(() => {
              const allKeys = new Set([
                ...Object.keys(sectionImageDefs),
                ...Object.keys(sectionVideoDefs),
              ]);
              return Array.from(allKeys).map((key) => {
                const imgDef = sectionImageDefs[key];
                const vidDef = sectionVideoDefs[key];
                const currentImg = images[key] || {
                  url: imgDef?.url ?? "",
                  alt: imgDef?.alt ?? "",
                  alt_ar: imgDef?.alt_ar ?? "",
                };
                const currentVid = videos[key] || {
                  url: vidDef?.url ?? "",
                  alt: vidDef?.alt ?? "",
                  alt_ar: vidDef?.alt_ar ?? "",
                };
                const label = imgDef?.label || vidDef?.label || key;

                return (
                  <MediaCard
                    key={key}
                    slotKey={key}
                    label={label}
                    hasImageDef={!!imgDef}
                    hasVideoDef={!!vidDef}
                    currentImg={currentImg}
                    currentVid={currentVid}
                    imgDef={imgDef}
                    vidDef={vidDef}
                    uploading={uploading}
                    saving={saving}
                    savedKeys={savedKeys}
                    fileInputRefs={fileInputRefs}
                    videoInputRefs={videoInputRefs}
                    onImageChange={onImageChange}
                    onVideoChange={onVideoChange}
                    handleImageUpload={handleImageUpload}
                    handleVideoUpload={handleVideoUpload}
                    handleSaveImage={handleSaveImage}
                    handleSaveVideo={handleSaveVideo}
                  />
                );
              });
            })()}
          </div>
        </section>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Reusable bilingual field row.
// ──────────────────────────────────────────────────────────────────────────────

interface FieldRowProps {
  flagLabel: string;
  flagTone: "neutral" | "accent";
  type: "text" | "textarea" | "url" | "email" | "phone" | "number";
  value: string;
  placeholder?: string;
  label?: string;
  hint?: string;
  dir?: "ltr" | "rtl";
  onChange: (value: string) => void;
}

function FieldRow({
  flagLabel,
  flagTone,
  type,
  value,
  placeholder,
  label,
  hint,
  dir = "ltr",
  onChange,
}: FieldRowProps) {
  const isArabic = dir === "rtl";
  const inputClass =
    "admin-focus w-full px-0 pt-2 pb-2 bg-transparent border-b border-white/15 text-white placeholder-[var(--admin-text-deep)] focus:outline-none focus:border-[var(--admin-accent)] transition-colors text-[15px] leading-relaxed font-body min-h-[40px]";

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-3 mb-1.5 ${
          isArabic ? "flex-row-reverse" : ""
        }`}
      >
        <span
          className={`inline-flex items-center justify-center min-w-[28px] h-5 px-1.5 text-[10px] font-mono tracking-[0.18em] uppercase border rounded-sm ${
            flagTone === "accent"
              ? "text-[var(--admin-accent)] border-[var(--admin-accent)]/40"
              : "text-[var(--admin-text-muted)] border-white/15"
          } ${isArabic ? "font-display text-[13px] tracking-normal pt-0.5" : ""}`}
        >
          {flagLabel}
        </span>
        {label && (
          <span
            className={`text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-muted)] ${
              isArabic ? "font-body normal-case tracking-normal text-[12px]" : ""
            }`}
          >
            {label}
          </span>
        )}
        {hint && (
          <span className="ms-auto text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--admin-text-dim)]">
            {hint}
          </span>
        )}
      </div>

      {type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          dir={dir}
          className={`${inputClass} resize-none ${
            isArabic ? "text-right" : ""
          }`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type === "phone" ? "tel" : type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          dir={dir}
          className={`${inputClass} ${isArabic ? "text-right" : ""}`}
          placeholder={placeholder}
          {...(type === "number" ? { step: "0.0625", min: "0" } : {})}
        />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

function SaveButton({
  saving,
  saved,
  onClick,
  label = "Save",
  wide = false,
}: {
  saving?: boolean;
  saved?: boolean;
  onClick: () => void;
  label?: string;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className={`admin-focus ${
        wide ? "w-full" : "min-w-[110px]"
      } py-3 px-4 text-[11px] font-mono uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] rounded-sm active:scale-[0.98] ${
        saved
          ? "bg-[var(--admin-success-bg)] text-[var(--admin-success)] border border-[var(--admin-success)]/30"
          : "bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:bg-[var(--admin-accent-dark)] hover:text-white"
      }`}
    >
      {saving ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Saving
        </span>
      ) : saved ? (
        <span className="inline-flex items-center gap-2 admin-toast-enter">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          Saved
        </span>
      ) : (
        label
      )}
    </button>
  );
}
