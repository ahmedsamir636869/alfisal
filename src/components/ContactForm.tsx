"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { submitContact } from "@/app/actions/contact";

type Status = "idle" | "submitting" | "success" | "error";

// ── Translation strings ────────────────────────────────────────────────────────
const t = {
  en: {
    fieldName:        "Full name",
    fieldEmail:       "Email",
    fieldType:        "Project type",
    fieldTypePh:      "Commercial, Residential, Civic, …",
    fieldBudget:      "Budget (indicative)",
    fieldBudgetPh:    "Range or band",
    fieldBrief:       "Brief",
    fieldBriefPh:     "Location, scale, programme, timeline. The broader the better.",
    submit:           "Send brief",
    sending:          "Sending",
    consent:          "By submitting, you consent to correspondence from Alfisal about your enquiry. No marketing — ever.",
    successTag:       "Received — Thank you",
    successTitle:     "Your brief is with a principal.",
    successBody:      "We reply within one working day with first questions. If the project is time sensitive, please also call the studio.",
    errorRequired:    "Please complete name, email, and the message.",
    errorGeneric:     "Something went wrong. Please email us directly.",
  },
  ar: {
    fieldName:        "الاسم الكامل",
    fieldEmail:       "البريد الإلكتروني",
    fieldType:        "نوع المشروع",
    fieldTypePh:      "تجاري، سكني، مدني، ...",
    fieldBudget:      "الميزانية (تقديرية)",
    fieldBudgetPh:    "نطاق أو فئة",
    fieldBrief:       "الملخص",
    fieldBriefPh:     "الموقع، الحجم، البرنامج، الجدول الزمني. كلما كان أوسع كان أفضل.",
    submit:           "إرسال الملخص",
    sending:          "جارٍ الإرسال",
    consent:          "بإرسال هذا النموذج، تُوافق على تواصل الفيصل معك بشأن استفسارك. لا بريد تسويقي — أبداً.",
    successTag:       "تم الاستلام — شكراً لك",
    successTitle:     "ملخصك لدى أحد الشركاء.",
    successBody:      "نردّ خلال يوم عمل واحد بأسئلتنا الأولى. إذا كان المشروع حساساً من ناحية الوقت، يُرجى الاتصال بالاستوديو أيضاً.",
    errorRequired:    "يُرجى تعبئة حقول الاسم والبريد الإلكتروني والرسالة.",
    errorGeneric:     "حدث خطأ. يُرجى مراسلتنا مباشرة عبر البريد الإلكتروني.",
  },
} satisfies Record<Locale, Record<string, string>>;

// ── Component ──────────────────────────────────────────────────────────────────

interface ContactFormProps {
  locale?: Locale;
}

export default function ContactForm({ locale = "en" }: ContactFormProps) {
  const copy = t[locale];
  const isRtl = locale === "ar";

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    message: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      setError(copy.errorRequired);
      return;
    }

    try {
      const result = await submitContact({
        name: form.name,
        email: form.email,
        projectType: form.projectType,
        budget: form.budget,
        message: form.message,
      });
      if (result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(copy.errorGeneric);
      }
    } catch {
      setStatus("error");
      setError(copy.errorGeneric);
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        dir={isRtl ? "rtl" : "ltr"}
        className="border border-[var(--color-ink)]/15 p-5 sm:p-8 md:p-10 bg-[var(--color-parchment)]"
      >
        <div className="flex items-baseline gap-4 mb-6">
          <span className={`font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-saffron-deep)] tabular-nums ${isRtl ? "font-body tracking-normal" : ""}`}>
            {copy.successTag}
          </span>
          <span className="h-px flex-1 bg-[var(--color-ink)]/15" />
        </div>
        <h3 className={`font-display text-2xl md:text-3xl leading-[1.15] tracking-[-0.02em] text-[var(--color-ink)] mb-4 ${isRtl ? "text-right" : ""}`}>
          {copy.successTitle}
        </h3>
        <p className={`text-[var(--color-ink-soft)] leading-[1.8] max-w-[52ch] ${isRtl ? "text-right" : ""}`}>
          {copy.successBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7 sm:space-y-10" dir={isRtl ? "rtl" : "ltr"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-8">
        <Field
          label={copy.fieldName}
          name="name"
          value={form.name}
          onChange={(v) => update("name", v)}
          required
          autoComplete="name"
          isRtl={isRtl}
        />
        <Field
          label={copy.fieldEmail}
          name="email"
          type="email"
          value={form.email}
          onChange={(v) => update("email", v)}
          required
          autoComplete="email"
          isRtl={isRtl}
        />
        <Field
          label={copy.fieldType}
          name="projectType"
          value={form.projectType}
          onChange={(v) => update("projectType", v)}
          placeholder={copy.fieldTypePh}
          isRtl={isRtl}
        />
        <Field
          label={copy.fieldBudget}
          name="budget"
          value={form.budget}
          onChange={(v) => update("budget", v)}
          placeholder={copy.fieldBudgetPh}
          isRtl={isRtl}
        />
      </div>

      <Field
        label={copy.fieldBrief}
        name="message"
        value={form.message}
        onChange={(v) => update("message", v)}
        required
        textarea
        placeholder={copy.fieldBriefPh}
        isRtl={isRtl}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-6 border-t border-[var(--color-ink)]/10 pt-6 sm:pt-8">
        <p className={`font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-muted)] max-w-[48ch] ${isRtl ? "font-body normal-case tracking-normal text-sm" : ""}`}>
          {copy.consent}
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex items-center justify-center gap-3 bg-[var(--color-ink)] text-[var(--color-bone)] px-8 min-h-[48px] py-3.5 text-[12px] font-medium tracking-[0.1em] uppercase hover:bg-[var(--color-saffron-deep)] active:bg-[var(--color-saffron-deep)] transition-colors duration-300 disabled:opacity-50 shrink-0 w-full sm:w-auto"
        >
          {status === "submitting" ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-[var(--color-bone)]/30 border-t-[var(--color-bone)] animate-spin" />
              {copy.sending}
            </>
          ) : (
            <>
              {copy.submit}
              <span
                aria-hidden
                className={`material-symbols-outlined text-[18px] transition-transform duration-500 group-hover:translate-x-1 ${isRtl ? "rotate-180" : ""}`}
              >
                arrow_forward
              </span>
            </>
          )}
        </button>
      </div>

      {status === "error" && error && (
        <div role="alert" className="text-[var(--color-danger)] text-sm">
          {error}
        </div>
      )}
    </form>
  );
}

// ── Field ──────────────────────────────────────────────────────────────────────

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
  placeholder,
  textarea,
  isRtl = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  textarea?: boolean;
  isRtl?: boolean;
}) {
  const id = `field-${name}`;
  const inputClass =
    "w-full bg-transparent border-0 border-b border-[var(--color-ink)]/25 min-h-[48px] py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-ink)] focus:ring-0 transition-colors text-base sm:text-[17px] font-body" +
    (isRtl ? " text-right" : "");

  return (
    <div>
      <label
        htmlFor={id}
        className={`flex items-center gap-1 mb-3 ${isRtl ? "flex-row-reverse justify-end font-body normal-case tracking-normal text-sm text-[var(--color-muted)]" : "font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-muted)]"}`}
      >
        {required && (
          <span className="text-[var(--color-saffron-deep)]">*</span>
        )}
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={isRtl ? "rtl" : "ltr"}
          className={inputClass + " resize-none min-h-[140px]"}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={isRtl ? "rtl" : "ltr"}
          className={inputClass}
        />
      )}
    </div>
  );
}
