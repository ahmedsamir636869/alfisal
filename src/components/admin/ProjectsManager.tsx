"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  title_ar: string | null;
  location: string;
  location_ar: string | null;
  description: string;
  description_ar: string | null;
  category: string;
  category_ar: string | null;
  image_url: string;
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Project>>({});
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this project from the archive?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // Strip empty Arabic strings to NULL so the public reader falls back to English.
    const payload: Partial<Project> = {
      ...form,
      title_ar: form.title_ar?.trim() ? form.title_ar : null,
      location_ar: form.location_ar?.trim() ? form.location_ar : null,
      description_ar: form.description_ar?.trim() ? form.description_ar : null,
      category_ar: form.category_ar?.trim() ? form.category_ar : null,
    };

    if (editingId && editingId !== "new") {
      await supabase.from("projects").update(payload).eq("id", editingId);
    } else {
      await supabase.from("projects").insert([payload]);
    }
    setForm({});
    setEditingId(null);
    fetchProjects();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `projects/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("site-images")
      .upload(fileName, file);
    if (!error) {
      const { data } = supabase.storage
        .from("site-images")
        .getPublicUrl(fileName);
      setForm((prev) => ({ ...prev, image_url: data.publicUrl }));
    }
    setUploading(false);
  }

  function editProject(p: Project) {
    setEditingId(p.id);
    setForm(p);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({});
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[oklch(0.72_0.010_75)]">
          <span className="text-[var(--color-saffron)] mr-3">—</span>
          Project archive
        </h2>
        {!editingId && (
          <button
            onClick={() => setEditingId("new")}
            className="inline-flex items-center gap-3 border border-white/20 text-white px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.25em] hover:bg-white/5 transition-colors"
          >
            <span className="text-[var(--color-saffron)]">+</span>
            Add project
          </button>
        )}
      </div>

      {editingId && (
        <form
          onSubmit={handleSave}
          className="bg-[oklch(0.19_0.014_55)] border border-white/10 p-8 mb-10 animate-fade-in"
        >
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--color-saffron)] mb-6 flex items-center gap-3">
            <span>{editingId === "new" ? "New project" : "Edit project"}</span>
            <span className="ms-auto inline-flex items-center gap-2 text-[oklch(0.72_0.010_75)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-saffron)]" />
              Bilingual · EN / عربي
            </span>
          </div>

          <div className="space-y-7">
            <BilingualField
              label="Title"
              required
              valueEn={form.title || ""}
              valueAr={form.title_ar || ""}
              onChangeEn={(v) => setForm({ ...form, title: v })}
              onChangeAr={(v) => setForm({ ...form, title_ar: v })}
            />

            <div className="grid md:grid-cols-2 gap-7">
              <BilingualField
                label="Category"
                placeholder="e.g. Commercial"
                placeholderAr="مثال: تجاري"
                valueEn={form.category || ""}
                valueAr={form.category_ar || ""}
                onChangeEn={(v) => setForm({ ...form, category: v })}
                onChangeAr={(v) => setForm({ ...form, category_ar: v })}
              />

              <BilingualField
                label="Location"
                placeholderAr="الموقع"
                valueEn={form.location || ""}
                valueAr={form.location_ar || ""}
                onChangeEn={(v) => setForm({ ...form, location: v })}
                onChangeAr={(v) => setForm({ ...form, location_ar: v })}
              />
            </div>

            <BilingualField
              label="Description"
              multiline
              placeholderAr="الوصف"
              valueEn={form.description || ""}
              valueAr={form.description_ar || ""}
              onChangeEn={(v) => setForm({ ...form, description: v })}
              onChangeAr={(v) => setForm({ ...form, description_ar: v })}
            />

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-[oklch(0.72_0.010_75)] mb-2">
                Image upload
              </label>
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="block w-full text-xs text-[oklch(0.72_0.010_75)] file:mr-4 file:py-2 file:px-4 file:border file:border-white/20 file:bg-transparent file:text-white file:text-[10px] file:font-mono file:uppercase file:tracking-[0.25em] hover:file:bg-white/5 file:cursor-pointer"
              />
              {uploading && (
                <span className="text-xs text-[var(--color-saffron)] mt-2 inline-block">
                  Uploading…
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-white/10">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.25em] text-[oklch(0.72_0.010_75)] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="bg-[var(--color-saffron)] text-[oklch(0.175_0.014_55)] hover:bg-[var(--color-saffron-deep)] hover:text-white px-6 py-2.5 text-[11px] font-mono uppercase tracking-[0.25em] transition-colors disabled:opacity-50"
            >
              Save project
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-[oklch(0.72_0.010_75)] text-xs py-8 font-mono uppercase tracking-[0.25em]">
          <div className="w-3 h-3 border-[1.5px] border-current border-t-transparent rounded-full animate-spin" />
          Loading archive
        </div>
      ) : (
        <div className="divide-y divide-white/10 border-t border-white/10">
          {projects.map((p) => {
            const hasArabic =
              !!p.title_ar?.trim() || !!p.description_ar?.trim();
            return (
              <div
                key={p.id}
                className="group flex items-center gap-6 py-5 hover:bg-white/[0.02] transition-colors px-2"
              >
                <div className="w-20 h-16 relative bg-[oklch(0.14_0.014_55)] overflow-hidden shrink-0">
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt=""
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="material-symbols-outlined text-[oklch(0.48_0.012_70)]">
                        image
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-white text-lg truncate">
                      {p.title}
                    </h3>
                    {hasArabic && (
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--color-saffron)] border border-[var(--color-saffron)]/40 px-1.5 py-[1px]">
                        AR
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[oklch(0.72_0.010_75)] mt-1 truncate">
                    {p.category} · {p.location}
                  </p>
                </div>
                <div className="flex gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => editProject(p)}
                    className="p-2 text-[oklch(0.72_0.010_75)] hover:text-[var(--color-saffron)] transition-colors"
                    aria-label="Edit project"
                  >
                    <span className="material-symbols-outlined text-base">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-[oklch(0.72_0.010_75)] hover:text-[var(--color-danger)] transition-colors"
                    aria-label="Delete project"
                  >
                    <span className="material-symbols-outlined text-base">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
          {projects.length === 0 && (
            <div className="text-[oklch(0.62_0.010_75)] text-sm py-12 text-center italic">
              The archive is empty. Add the first project to begin.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface BilingualFieldProps {
  label: string;
  valueEn: string;
  valueAr: string;
  onChangeEn: (v: string) => void;
  onChangeAr: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  placeholderAr?: string;
  multiline?: boolean;
}

function BilingualField({
  label,
  valueEn,
  valueAr,
  onChangeEn,
  onChangeAr,
  required = false,
  placeholder,
  placeholderAr,
  multiline = false,
}: BilingualFieldProps) {
  return (
    <div>
      <label className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.25em] text-[oklch(0.72_0.010_75)] mb-3">
        <span>{label}</span>
      </label>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="mt-2.5 inline-flex items-center justify-center min-w-[28px] h-5 px-1.5 text-[10px] font-mono tracking-[0.18em] uppercase text-[oklch(0.62_0.010_75)] border border-white/15">
            EN
          </span>
          {multiline ? (
            <textarea
              required={required}
              rows={3}
              value={valueEn}
              onChange={(e) => onChangeEn(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-0 py-2 bg-transparent border-b border-white/15 text-white focus:outline-none focus:border-[var(--color-saffron)] transition-colors text-[15px] leading-relaxed font-body resize-none"
            />
          ) : (
            <input
              required={required}
              value={valueEn}
              onChange={(e) => onChangeEn(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-0 py-2 bg-transparent border-b border-white/15 text-white focus:outline-none focus:border-[var(--color-saffron)] transition-colors text-[15px] font-body"
            />
          )}
        </div>

        <div className="flex items-start gap-3 flex-row-reverse">
          <span className="mt-2.5 inline-flex items-center justify-center min-w-[28px] h-5 px-1.5 font-display text-[13px] text-[var(--color-saffron)] border border-[var(--color-saffron)]/40">
            عربي
          </span>
          {multiline ? (
            <textarea
              rows={3}
              dir="rtl"
              value={valueAr}
              onChange={(e) => onChangeAr(e.target.value)}
              placeholder={placeholderAr || "الترجمة العربية"}
              className="flex-1 px-0 py-2 bg-transparent border-b border-white/15 text-white focus:outline-none focus:border-[var(--color-saffron)] transition-colors text-[15px] leading-relaxed font-body resize-none text-right"
            />
          ) : (
            <input
              dir="rtl"
              value={valueAr}
              onChange={(e) => onChangeAr(e.target.value)}
              placeholder={placeholderAr || "الترجمة العربية"}
              className="flex-1 px-0 py-2 bg-transparent border-b border-white/15 text-white focus:outline-none focus:border-[var(--color-saffron)] transition-colors text-[15px] font-body text-right"
            />
          )}
        </div>
      </div>
    </div>
  );
}
