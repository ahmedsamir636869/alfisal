"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  project_type: string | null;
  budget: string | null;
  message: string;
  status: string;
  notes: string | null;
  interested_project: string | null;
  created_at: string;
}

const STATUS_OPTIONS = ["new", "read", "replied", "archived"] as const;
type StatusType = (typeof STATUS_OPTIONS)[number];

const STATUS_COLORS: Record<StatusType, string> = {
  new: "bg-[var(--admin-accent)]/20 text-[var(--admin-accent)]",
  read: "bg-amber-500/15 text-amber-400",
  replied: "bg-emerald-500/15 text-emerald-400",
  archived: "bg-white/10 text-[var(--admin-text-dim)]",
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [filter, setFilter] = useState<StatusType | "all">("all");

  const [notifyEmail, setNotifyEmail] = useState("");
  const [autoSend, setAutoSend] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setSubmissions((data as Submission[]) || []);
    setLoading(false);
  }, []);

  const loadSettings = useCallback(async () => {
    setSettingsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("site_content")
      .select("key, value")
      .eq("section", "contact")
      .in("key", ["notify_email", "auto_send_email"]);
    const map: Record<string, string> = {};
    for (const row of data || []) map[row.key] = row.value;
    setNotifyEmail(map.notify_email || "");
    setAutoSend(map.auto_send_email?.toLowerCase() === "true");
    setSettingsLoading(false);
  }, []);

  async function saveSettings() {
    setSettingsSaving(true);
    setSettingsSaved(false);
    const supabase = createClient();
    await Promise.all([
      supabase
        .from("site_content")
        .update({ value: notifyEmail.trim(), updated_at: new Date().toISOString() })
        .eq("section", "contact")
        .eq("key", "notify_email"),
      supabase
        .from("site_content")
        .update({ value: autoSend ? "true" : "false", updated_at: new Date().toISOString() })
        .eq("section", "contact")
        .eq("key", "auto_send_email"),
    ]);
    setSettingsSaving(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  }

  useEffect(() => { load(); loadSettings(); }, [load, loadSettings]);

  async function updateStatus(id: string, status: string) {
    const supabase = createClient();
    await supabase
      .from("contact_submissions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, status } : null));
    }
  }

  async function deleteSubmission(id: string) {
    const supabase = createClient();
    await supabase.from("contact_submissions").delete().eq("id", id);
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  const filtered =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.status === filter);

  const counts = submissions.reduce(
    (acc, s) => {
      acc[s.status as StatusType] = (acc[s.status as StatusType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--admin-text-muted)] mb-4 flex items-center gap-3">
          <span className="text-[var(--admin-accent)]">✉</span>
          <span>Contact submissions</span>
          <span className="ms-auto text-[var(--admin-text-soft)]">
            {submissions.length} total
          </span>
        </div>
        <h1 className="text-4xl font-display text-white tracking-tight">
          Inbox
        </h1>
        <p className="text-[var(--admin-text-soft)] text-sm mt-3 max-w-[60ch] leading-relaxed">
          All contact form submissions are saved here. Mark them as read,
          replied, or archived. Configure auto-forwarding below to receive
          an email whenever a new enquiry comes in.
        </p>
      </div>

      {/* ── Email notification settings ──────────────────────────── */}
      <div className="mb-10 border border-[var(--admin-border)] bg-[var(--admin-surface-card)] p-6">
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-muted)] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[var(--admin-accent)]">
            forward_to_inbox
          </span>
          Auto-forward settings
        </div>

        {settingsLoading ? (
          <div className="text-[var(--admin-text-dim)] text-sm font-mono">Loading...</div>
        ) : (
          <div className="space-y-5">
            {/* Toggle */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <button
                type="button"
                role="switch"
                aria-checked={autoSend}
                onClick={() => setAutoSend(!autoSend)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  autoSend
                    ? "bg-[var(--admin-accent)]"
                    : "bg-white/15"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    autoSend ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-white text-sm">
                Auto-send email when a new submission arrives
              </span>
            </label>

            {/* Email input */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-muted)] mb-2 block">
                Forward to email
              </label>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="e.g. info@alfisalcon.com"
                  className="flex-1 bg-[var(--admin-bg)] border border-[var(--admin-border)] text-white text-sm px-4 py-2.5 placeholder:text-[var(--admin-text-dim)] focus:outline-none focus:border-[var(--admin-accent)] transition-colors"
                />
                <button
                  onClick={saveSettings}
                  disabled={settingsSaving}
                  className="px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.2em] bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:bg-[var(--admin-accent-dark)] hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {settingsSaving ? "Saving..." : settingsSaved ? "Saved ✓" : "Save"}
                </button>
              </div>
              {autoSend && !notifyEmail.trim() && (
                <p className="text-amber-400 text-[11px] mt-2">
                  Enter an email address to receive auto-notifications.
                </p>
              )}
              {!autoSend && (
                <p className="text-[var(--admin-text-dim)] text-[11px] mt-2">
                  Auto-forwarding is off. Submissions are still saved here.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {(["all", ...STATUS_OPTIONS] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors cursor-pointer ${
              filter === s
                ? "bg-[var(--admin-accent)]/15 text-[var(--admin-accent)] border border-[var(--admin-accent)]/30"
                : "text-[var(--admin-text-soft)] border border-[var(--admin-border)] hover:bg-white/5"
            }`}
          >
            {s} {s !== "all" ? `(${counts[s] || 0})` : `(${submissions.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[var(--admin-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <span className="text-[var(--admin-text-muted)] text-[10px] font-mono uppercase tracking-[0.3em]">
            Loading submissions
          </span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-[var(--admin-border)] py-16 text-center text-[var(--admin-text-muted)] font-mono text-xs uppercase tracking-[0.14em]">
          No submissions {filter !== "all" ? `with status "${filter}"` : "yet"}.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* List */}
          <div className="border border-[var(--admin-border)] divide-y divide-[var(--admin-border)]">
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`w-full text-left px-5 py-4 transition-colors cursor-pointer ${
                  selected?.id === s.id
                    ? "bg-[var(--admin-accent)]/10"
                    : "hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest ${
                      STATUS_COLORS[s.status as StatusType] || STATUS_COLORS.new
                    }`}
                  >
                    {s.status}
                  </span>
                  <span className="text-[var(--admin-text-dim)] text-[10px] font-mono ms-auto">
                    {new Date(s.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="text-white font-display text-lg leading-tight">
                  {s.name}
                </div>
                <div className="text-[var(--admin-text-muted)] text-sm truncate">
                  {s.email}
                </div>
                {s.interested_project && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="material-symbols-outlined text-[14px] text-[var(--admin-accent)]">apartment</span>
                    <span className="text-[var(--admin-accent)] text-[11px] font-mono truncate">
                      {s.interested_project}
                    </span>
                  </div>
                )}
                <p className="text-[var(--admin-text-dim)] text-sm mt-1 line-clamp-2">
                  {s.message}
                </p>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          {selected ? (
            <div className="border border-[var(--admin-border)] bg-[var(--admin-surface-card)] p-6 self-start sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest ${
                    STATUS_COLORS[selected.status as StatusType] ||
                    STATUS_COLORS.new
                  }`}
                >
                  {selected.status}
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="text-[var(--admin-text-dim)] hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <h2 className="text-2xl font-display text-white mb-1">
                {selected.name}
              </h2>
              <a
                href={`mailto:${selected.email}`}
                className="text-[var(--admin-accent)] text-sm hover:underline block"
              >
                {selected.email}
              </a>
              {selected.phone && (
                <a
                  href={`tel:${selected.phone}`}
                  className="text-[var(--admin-text-soft)] text-sm hover:text-white transition-colors flex items-center gap-1.5 mt-1"
                >
                  <span className="material-symbols-outlined text-[15px]">call</span>
                  {selected.phone}
                </a>
              )}

              <div className="mt-6 space-y-4">
                {selected.interested_project && (
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-muted)] mb-1">
                      Interested in project
                    </div>
                    <div className="flex items-center gap-2 text-[var(--admin-accent)]">
                      <span className="material-symbols-outlined text-[18px]">apartment</span>
                      <span className="text-sm font-display">{selected.interested_project}</span>
                    </div>
                  </div>
                )}
                {selected.project_type && (
                  <InfoRow label="Project type" value={selected.project_type} />
                )}
                {selected.budget && (
                  <InfoRow label="Budget" value={selected.budget} />
                )}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-muted)] mb-2">
                    Brief
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>
                <InfoRow
                  label="Received"
                  value={new Date(selected.created_at).toLocaleString()}
                />
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-[var(--admin-border)] space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-muted)] mb-3">
                  Update status
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateStatus(selected.id, opt)}
                      disabled={selected.status === opt}
                      className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                        selected.status === opt
                          ? "bg-[var(--admin-accent)]/20 text-[var(--admin-accent)]"
                          : "border border-[var(--admin-border)] text-[var(--admin-text-soft)] hover:bg-white/5"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-4">
                  <a
                    href={`mailto:${selected.email}?subject=Re: Your project enquiry — Alfisal&body=Dear ${selected.name},%0D%0A%0D%0AThank you for your enquiry.%0D%0A%0D%0A`}
                    className="flex-1 py-2.5 text-center text-[11px] font-mono uppercase tracking-[0.2em] bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:bg-[var(--admin-accent-dark)] hover:text-white transition-colors"
                  >
                    Reply via email
                  </a>
                  <button
                    onClick={() => {
                      if (confirm("Delete this submission permanently?")) {
                        deleteSubmission(selected.id);
                      }
                    }}
                    className="px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.2em] border border-[var(--color-danger)]/30 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-[var(--admin-border)] flex items-center justify-center py-20 text-[var(--admin-text-dim)] font-mono text-[10px] uppercase tracking-[0.2em] self-start">
              Select a submission
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--admin-text-muted)] mb-1">
        {label}
      </div>
      <div className="text-white/90 text-sm">{value}</div>
    </div>
  );
}
