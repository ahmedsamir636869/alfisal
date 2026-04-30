"use client";

import { useState, type RefObject } from "react";
import Image from "next/image";

/* ── Types ─────────────────────────────────────────────────────────── */

type MediaDef = { url: string; alt: string; alt_ar?: string; label: string } | undefined;

interface MediaCardProps {
  slotKey: string;
  label: string;
  hasImageDef: boolean;
  hasVideoDef: boolean;
  currentImg: { url: string; alt: string; alt_ar: string };
  currentVid: { url: string; alt: string; alt_ar: string };
  imgDef: MediaDef;
  vidDef: MediaDef;
  uploading: Record<string, boolean>;
  saving: Record<string, boolean>;
  savedKeys: Set<string>;
  fileInputRefs: RefObject<Record<string, HTMLInputElement | null>>;
  videoInputRefs: RefObject<Record<string, HTMLInputElement | null>>;
  onImageChange: (key: string, patch: Partial<{ url: string; alt: string; alt_ar: string }>) => void;
  onVideoChange: (key: string, patch: Partial<{ url: string; alt: string; alt_ar: string }>) => void;
  handleImageUpload: (key: string, file: File) => void;
  handleVideoUpload: (key: string, file: File) => void;
  handleSaveImage: (key: string) => void;
  handleSaveVideo: (key: string) => void;
}

/* ── Component ─────────────────────────────────────────────────────── */

export default function MediaCard({
  slotKey,
  label,
  hasImageDef,
  hasVideoDef,
  currentImg,
  currentVid,
  imgDef,
  vidDef,
  uploading,
  saving,
  savedKeys,
  fileInputRefs,
  videoInputRefs,
  onImageChange,
  onVideoChange,
  handleImageUpload,
  handleVideoUpload,
  handleSaveImage,
  handleSaveVideo,
}: MediaCardProps) {
  const [tab, setTab] = useState<"photo" | "video">(
    hasImageDef ? "photo" : "video"
  );

  return (
    <div className="admin-card p-6 rounded-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--admin-text-soft)]">
          {label}
        </span>
        <span className="text-[10px] font-mono text-[var(--admin-text-dim)] bg-[var(--admin-bg)] px-2 py-0.5 rounded-sm">
          {slotKey}
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 mb-5 bg-[var(--admin-bg)] p-1 rounded-sm">
        <button
          type="button"
          onClick={() => setTab("photo")}
          className={`admin-focus flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-mono uppercase tracking-[0.15em] transition-all duration-200 rounded-sm min-h-[40px] ${
            tab === "photo"
              ? "bg-[var(--admin-surface-card)] text-white shadow-sm"
              : "text-[var(--admin-text-dim)] hover:text-[var(--admin-text-soft)]"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">image</span>
          Photo
          {currentImg.url && (
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--admin-success)] ml-0.5" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("video")}
          className={`admin-focus flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-mono uppercase tracking-[0.15em] transition-all duration-200 rounded-sm min-h-[40px] ${
            tab === "video"
              ? "bg-[var(--admin-surface-card)] text-white shadow-sm"
              : "text-[var(--admin-text-dim)] hover:text-[var(--admin-text-soft)]"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">videocam</span>
          Video
          {currentVid.url && (
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--admin-success)] ml-0.5" />
          )}
        </button>
      </div>

      {/* ── Photo tab ─────────────────────────────────────────── */}
      {tab === "photo" && (
        <>
          {/* Preview */}
          <div className="relative w-full aspect-[4/3] overflow-hidden mb-5 bg-[var(--admin-bg)] rounded-sm">
            {currentImg.url ? (
              <Image
                src={currentImg.url}
                alt={currentImg.alt}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--admin-text-dim)]">
                <span className="material-symbols-outlined text-4xl opacity-40">image</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
                  No image uploaded
                </span>
              </div>
            )}
          </div>

          {/* Upload */}
          <input
            type="file"
            accept="image/*"
            ref={(el) => {
              fileInputRefs.current[slotKey] = el;
            }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(slotKey, file);
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRefs.current[slotKey]?.click()}
            disabled={uploading[slotKey]}
            className="admin-focus w-full mb-5 py-3 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--admin-text-soft)] border border-dashed border-[var(--admin-border)] hover:border-[var(--admin-accent)] hover:text-[var(--admin-accent)] hover:bg-[var(--admin-accent-glow)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] rounded-sm active:scale-[0.98]"
          >
            {uploading[slotKey] ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-[var(--admin-accent)] border-t-transparent rounded-full animate-spin" />
                Uploading…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                Upload new image
              </span>
            )}
          </button>

          {/* Fields */}
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--admin-text-muted)] block mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={currentImg.url}
                onChange={(e) => onImageChange(slotKey, { url: e.target.value })}
                className="admin-focus w-full px-0 py-2 bg-transparent border-b border-white/15 text-white text-sm focus:outline-none focus:border-[var(--admin-accent)] transition-colors font-body min-h-[40px]"
                placeholder="https://..."
              />
            </div>
            <FieldRow
              flagLabel="EN"
              flagTone="neutral"
              label="Alt text"
              value={currentImg.alt}
              placeholder={imgDef?.alt || ""}
              onChange={(v) => onImageChange(slotKey, { alt: v })}
            />
            <FieldRow
              flagLabel="عربي"
              flagTone="accent"
              dir="rtl"
              label="النص البديل"
              value={currentImg.alt_ar}
              placeholder={imgDef?.alt_ar || "الترجمة العربية"}
              onChange={(v) => onImageChange(slotKey, { alt_ar: v })}
            />
            <SaveBtn
              label="Save image"
              saving={saving[`img_${slotKey}`]}
              saved={savedKeys.has(`img_${slotKey}`)}
              onClick={() => handleSaveImage(slotKey)}
            />
          </div>
        </>
      )}

      {/* ── Video tab ─────────────────────────────────────────── */}
      {tab === "video" && (
        <>
          {/* Preview */}
          <div className="relative w-full aspect-[9/16] max-h-[400px] overflow-hidden mb-5 bg-[var(--admin-bg)] flex items-center justify-center rounded-sm">
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
                <span className="material-symbols-outlined text-4xl opacity-40">videocam</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
                  No video uploaded
                </span>
              </div>
            )}
          </div>

          {/* Upload */}
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            ref={(el) => {
              videoInputRefs.current[slotKey] = el;
            }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleVideoUpload(slotKey, file);
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => videoInputRefs.current[slotKey]?.click()}
            disabled={uploading[`vid_${slotKey}`]}
            className="admin-focus w-full mb-5 py-3 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--admin-text-soft)] border border-dashed border-[var(--admin-border)] hover:border-[var(--admin-accent)] hover:text-[var(--admin-accent)] hover:bg-[var(--admin-accent-glow)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] rounded-sm active:scale-[0.98]"
          >
            {uploading[`vid_${slotKey}`] ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-[var(--admin-accent)] border-t-transparent rounded-full animate-spin" />
                Uploading video…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                Upload new video
              </span>
            )}
          </button>

          {/* Fields */}
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--admin-text-muted)] block mb-2">
                Video URL
              </label>
              <input
                type="url"
                value={currentVid.url}
                onChange={(e) => onVideoChange(slotKey, { url: e.target.value })}
                className="admin-focus w-full px-0 py-2 bg-transparent border-b border-white/15 text-white text-sm focus:outline-none focus:border-[var(--admin-accent)] transition-colors font-body min-h-[40px]"
                placeholder="https://..."
              />
            </div>
            <FieldRow
              flagLabel="EN"
              flagTone="neutral"
              label="Description"
              value={currentVid.alt}
              placeholder={vidDef?.alt || ""}
              onChange={(v) => onVideoChange(slotKey, { alt: v })}
            />
            <FieldRow
              flagLabel="عربي"
              flagTone="accent"
              dir="rtl"
              label="الوصف"
              value={currentVid.alt_ar}
              placeholder={vidDef?.alt_ar || "الترجمة العربية"}
              onChange={(v) => onVideoChange(slotKey, { alt_ar: v })}
            />
            <SaveBtn
              label="Save video"
              saving={saving[`vid_${slotKey}`]}
              saved={savedKeys.has(`vid_${slotKey}`)}
              onClick={() => handleSaveVideo(slotKey)}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────────────── */

function FieldRow({
  flagLabel,
  flagTone,
  label,
  value,
  placeholder,
  onChange,
  dir,
}: {
  flagLabel: string;
  flagTone: "neutral" | "accent";
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  dir?: "rtl";
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`text-[9px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 border rounded-sm ${
            flagTone === "accent"
              ? "border-[var(--admin-accent)]/30 text-[var(--admin-accent)]"
              : "border-white/15 text-[var(--admin-text-muted)]"
          }`}
        >
          {flagLabel}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--admin-text-muted)]">
          {label}
        </span>
      </div>
      <input
        type="text"
        dir={dir}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="admin-focus w-full px-0 py-2 bg-transparent border-b border-white/15 text-white text-sm focus:outline-none focus:border-[var(--admin-accent)] transition-colors font-body min-h-[40px]"
      />
    </div>
  );
}

function SaveBtn({
  label,
  saving,
  saved,
  onClick,
}: {
  label: string;
  saving?: boolean;
  saved?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className={`admin-focus w-full py-3 text-[11px] font-mono uppercase tracking-[0.2em] transition-all duration-300 min-h-[44px] rounded-sm active:scale-[0.98] ${
        saved
          ? "bg-[var(--admin-success-bg)] text-[var(--admin-success)] border border-[var(--admin-success)]/30"
          : "bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:bg-[var(--admin-accent-dark)] hover:text-white"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {saving ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Saving…
        </span>
      ) : saved ? (
        <span className="flex items-center justify-center gap-2 admin-toast-enter">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          Saved
        </span>
      ) : (
        label
      )}
    </button>
  );
}
