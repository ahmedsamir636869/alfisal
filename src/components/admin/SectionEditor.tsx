"use client";

import { useState, useRef } from "react";
import Image from "next/image";
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
    }, 1800);
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
      // Persist responsive font sizes alongside the text
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
          <span className="text-[var(--admin-accent)]">{sectionIcon}</span>
          <span>Section editor</span>
          <span className="ms-auto inline-flex items-center gap-2 text-[var(--admin-text-soft)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--admin-accent)]" />
            Bilingual · EN / عربي
          </span>
        </div>
        <h1 className="text-4xl font-display text-white tracking-tight">
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
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--admin-text-soft)]">
              <span className="text-[var(--admin-accent)] mr-3">—</span>
              Text content
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-dim)]">
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
                      <span className="inline-flex items-center justify-center min-w-[28px] h-5 px-1.5 text-[10px] font-mono tracking-[0.18em] uppercase border text-[var(--admin-text-dim)] border-white/10">
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
                          className="w-[68px] px-2 py-1 bg-transparent border border-white/10 text-white text-[12px] font-mono text-center focus:outline-none focus:border-[var(--admin-accent)] transition-colors"
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
                          className="w-[68px] px-2 py-1 bg-transparent border border-white/10 text-white text-[12px] font-mono text-center focus:outline-none focus:border-[var(--admin-accent)] transition-colors"
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

      {/* Image Fields */}
      {Object.keys(sectionImageDefs).length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--admin-border)]">
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--admin-text-soft)]">
              <span className="text-[var(--admin-accent)] mr-3">—</span>
              Media
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-dim)]">
              {Object.keys(sectionImageDefs).length} assets
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {Object.entries(sectionImageDefs).map(([key, def]) => {
              const currentImg = images[key] || {
                url: def.url,
                alt: def.alt,
                alt_ar: def.alt_ar ?? "",
              };
              return (
                <div
                  key={key}
                  className="bg-[var(--admin-surface-card)] border border-[var(--admin-border)] p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-soft)]">
                      {def.label}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--admin-text-dim)]">
                      {key}
                    </span>
                  </div>

                  {/* Preview */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden mb-4 bg-[var(--admin-bg)]">
                    {currentImg.url ? (
                      <Image
                        src={currentImg.url}
                        alt={currentImg.alt}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[var(--admin-text-dim)]">
                        <span className="material-symbols-outlined text-4xl">
                          image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => {
                      fileInputRefs.current[key] = el;
                    }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(key, file);
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRefs.current[key]?.click()}
                    disabled={uploading[key]}
                    className="w-full mb-5 py-3 text-[11px] font-mono uppercase tracking-[0.25em] text-white border border-[var(--admin-border)] hover:bg-[var(--admin-accent)]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading[key] ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 border-[1.5px] border-white/40 border-t-white rounded-full animate-spin" />
                        Uploading
                      </span>
                    ) : (
                      "Upload new image"
                    )}
                  </button>

                  {/* URL */}
                  <div className="space-y-5">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-muted)] block mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={currentImg.url}
                        onChange={(e) =>
                          onImageChange(key, { url: e.target.value })
                        }
                        className="w-full px-0 py-2 bg-transparent border-b border-white/15 text-white text-sm focus:outline-none focus:border-[var(--admin-accent)] transition-colors font-body"
                        placeholder="https://..."
                      />
                    </div>

                    {/* Alt EN */}
                    <FieldRow
                      flagLabel="EN"
                      flagTone="neutral"
                      type="text"
                      label="Alt text"
                      value={currentImg.alt}
                      placeholder={def.alt}
                      onChange={(v) => onImageChange(key, { alt: v })}
                    />

                    {/* Alt AR */}
                    <FieldRow
                      flagLabel="عربي"
                      flagTone="accent"
                      type="text"
                      dir="rtl"
                      label="النص البديل"
                      value={currentImg.alt_ar}
                      placeholder={def.alt_ar || "الترجمة العربية"}
                      onChange={(v) => onImageChange(key, { alt_ar: v })}
                    />

                    <SaveButton
                      wide
                      label="Save image"
                      saving={saving[`img_${key}`]}
                      saved={savedKeys.has(`img_${key}`)}
                      onClick={() => handleSaveImage(key)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Video Fields */}
      {Object.keys(sectionVideoDefs).length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--admin-border)]">
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--admin-text-soft)]">
              <span className="text-[var(--admin-accent)] mr-3">—</span>
              Videos
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-dim)]">
              {Object.keys(sectionVideoDefs).length} assets
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {Object.entries(sectionVideoDefs).map(([key, def]) => {
              const currentVid = videos[key] || {
                url: def.url,
                alt: def.alt,
                alt_ar: def.alt_ar ?? "",
              };
              return (
                <div
                  key={key}
                  className="bg-[var(--admin-surface-card)] border border-[var(--admin-border)] p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-soft)]">
                      {def.label}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--admin-text-dim)]">
                      {key}
                    </span>
                  </div>

                  {/* Video Preview */}
                  <div className="relative w-full aspect-[9/16] max-h-[400px] overflow-hidden mb-4 bg-[var(--admin-bg)] flex items-center justify-center">
                    {currentVid.url ? (
                      <video
                        src={currentVid.url}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--admin-text-dim)]">
                        <span className="material-symbols-outlined text-4xl">
                          videocam
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
                          No video uploaded
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    ref={(el) => {
                      videoInputRefs.current[key] = el;
                    }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleVideoUpload(key, file);
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => videoInputRefs.current[key]?.click()}
                    disabled={uploading[`vid_${key}`]}
                    className="w-full mb-5 py-3 text-[11px] font-mono uppercase tracking-[0.25em] text-white border border-[var(--admin-accent)]/40 hover:bg-[var(--admin-accent)]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading[`vid_${key}`] ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 border-[1.5px] border-white/40 border-t-white rounded-full animate-spin" />
                        Uploading video…
                      </span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[14px] align-middle mr-2">upload</span>
                        Upload new video
                      </>
                    )}
                  </button>

                  {/* URL */}
                  <div className="space-y-5">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-muted)] block mb-2">
                        Video URL
                      </label>
                      <input
                        type="url"
                        value={currentVid.url}
                        onChange={(e) =>
                          onVideoChange(key, { url: e.target.value })
                        }
                        className="w-full px-0 py-2 bg-transparent border-b border-white/15 text-white text-sm focus:outline-none focus:border-[var(--admin-accent)] transition-colors font-body"
                        placeholder="https://..."
                      />
                    </div>

                    {/* Alt EN */}
                    <FieldRow
                      flagLabel="EN"
                      flagTone="neutral"
                      type="text"
                      label="Description"
                      value={currentVid.alt}
                      placeholder={def.alt}
                      onChange={(v) => onVideoChange(key, { alt: v })}
                    />

                    {/* Alt AR */}
                    <FieldRow
                      flagLabel="عربي"
                      flagTone="accent"
                      type="text"
                      dir="rtl"
                      label="الوصف"
                      value={currentVid.alt_ar}
                      placeholder={def.alt_ar || "الترجمة العربية"}
                      onChange={(v) => onVideoChange(key, { alt_ar: v })}
                    />

                    <SaveButton
                      wide
                      label="Save video"
                      saving={saving[`vid_${key}`]}
                      saved={savedKeys.has(`vid_${key}`)}
                      onClick={() => handleSaveVideo(key)}
                    />
                  </div>
                </div>
              );
            })}
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
    "w-full px-0 pt-2 pb-2 bg-transparent border-b border-white/15 text-white placeholder-[var(--admin-text-deep)] focus:outline-none focus:border-[var(--admin-accent)] transition-colors text-[15px] leading-relaxed font-body";

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-3 mb-1.5 ${
          isArabic ? "flex-row-reverse" : ""
        }`}
      >
        <span
          className={`inline-flex items-center justify-center min-w-[28px] h-5 px-1.5 text-[10px] font-mono tracking-[0.18em] uppercase border ${
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
          rows={isArabic ? 3 : 3}
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
      onClick={onClick}
      disabled={saving}
      className={`${
        wide ? "w-full" : "min-w-[110px]"
      } py-3 px-4 text-[11px] font-mono uppercase tracking-[0.25em] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none ${
        saved
          ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/30"
          : "bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:bg-[var(--admin-accent-dark)] hover:text-white"
      }`}
    >
      {saving ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 border-[1.5px] border-current border-t-transparent rounded-full animate-spin" />
          Saving
        </span>
      ) : saved ? (
        "Saved ✓"
      ) : (
        label
      )}
    </button>
  );
}
