"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { submitContact } from "@/app/actions/contact";

type Status = "idle" | "submitting" | "success" | "error";

const t = {
  en: {
    title: "Enquire about this project",
    fieldName: "Full name",
    fieldEmail: "Email",
    fieldPhone: "Phone (optional)",
    fieldMessage: "Message",
    fieldMessagePh: "Tell us what interests you about this project.",
    submit: "Send enquiry",
    sending: "Sending",
    consent: "By submitting you consent to correspondence from Alfisal. No marketing — ever.",
    successTag: "Received — Thank you",
    successTitle: "Your enquiry is with a principal.",
    successBody: "We reply within one working day. If it's time-sensitive, call the studio.",
    errorRequired: "Please complete name, email, and your message.",
    errorGeneric: "Something went wrong. Please email us directly.",
    close: "Close",
    interested: "Interested in",
  },
  ar: {
    title: "استفسار عن هذا المشروع",
    fieldName: "الاسم الكامل",
    fieldEmail: "البريد الإلكتروني",
    fieldPhone: "الهاتف (اختياري)",
    fieldMessage: "الرسالة",
    fieldMessagePh: "أخبرنا بما يثير اهتمامك في هذا المشروع.",
    submit: "إرسال الاستفسار",
    sending: "جارٍ الإرسال",
    consent: "بإرسال هذا النموذج، تُوافق على تواصل الفيصل معك. لا بريد تسويقي — أبداً.",
    successTag: "تم الاستلام — شكراً لك",
    successTitle: "استفسارك لدى أحد الشركاء.",
    successBody: "نردّ خلال يوم عمل واحد. إذا كان الأمر عاجلاً، يُرجى الاتصال بالاستوديو.",
    errorRequired: "يُرجى تعبئة حقول الاسم والبريد والرسالة.",
    errorGeneric: "حدث خطأ. يُرجى مراسلتنا مباشرة.",
    close: "إغلاق",
    interested: "مهتم بـ",
  },
} satisfies Record<Locale, Record<string, string>>;

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
  projectTitle: string;
  locale?: Locale;
}

export default function EnquiryModal({
  open,
  onClose,
  projectTitle,
  locale = "en",
}: EnquiryModalProps) {
  const copy = t[locale];
  const isRtl = locale === "ar";
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
      document.documentElement.style.overflow = "";
    }
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  function resetAndClose() {
    setStatus("idle");
    setError(null);
    setForm({ name: "", email: "", phone: "", message: "" });
    onClose();
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
        phone: form.phone || undefined,
        message: form.message,
        interestedProject: projectTitle,
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

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={resetAndClose}
      className="fixed inset-0 z-[200] m-0 w-full h-full max-w-none max-h-none bg-transparent p-0 open:flex items-center justify-center backdrop:bg-[var(--color-ink)]/50 backdrop:backdrop-blur-sm"
    >
      <div
        className="relative w-[94%] max-w-[560px] max-h-[90dvh] overflow-y-auto bg-[var(--color-bone)] border border-[var(--color-hairline)] shadow-2xl"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--color-bone)] z-10 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[var(--color-ink)]/10">
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink)] leading-tight">
              {copy.title}
            </h2>
            <p className="text-[var(--color-saffron-deep)] font-mono text-[11px] tracking-[0.14em] uppercase mt-1.5">
              {copy.interested}: {projectTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label={copy.close}
            className="h-10 w-10 flex items-center justify-center text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-8 py-6 sm:py-8">
          {status === "success" ? (
            <div role="status" aria-live="polite" className="py-6">
              <p className={`font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-saffron-deep)] mb-4 ${isRtl ? "font-body tracking-normal" : ""}`}>
                {copy.successTag}
              </p>
              <h3 className="font-display text-2xl text-[var(--color-ink)] mb-3 leading-tight">
                {copy.successTitle}
              </h3>
              <p className="text-[var(--color-ink-soft)] leading-[1.7] mb-8">
                {copy.successBody}
              </p>
              <button
                type="button"
                onClick={resetAndClose}
                className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-bone)] px-6 min-h-[44px] py-2.5 text-[12px] font-medium tracking-[0.1em] uppercase hover:bg-[var(--color-saffron-deep)] transition-colors"
              >
                {copy.close}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-6">
              <ModalField
                label={copy.fieldName}
                name="eq-name"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                required
                autoComplete="name"
                isRtl={isRtl}
              />
              <ModalField
                label={copy.fieldEmail}
                name="eq-email"
                type="email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                required
                autoComplete="email"
                isRtl={isRtl}
              />
              <ModalField
                label={copy.fieldPhone}
                name="eq-phone"
                type="tel"
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                autoComplete="tel"
                isRtl={isRtl}
              />
              <ModalField
                label={copy.fieldMessage}
                name="eq-message"
                value={form.message}
                onChange={(v) => setForm((f) => ({ ...f, message: v }))}
                required
                textarea
                placeholder={copy.fieldMessagePh}
                isRtl={isRtl}
              />

              <p className={`text-[var(--color-muted)] text-[10px] tracking-[0.14em] uppercase max-w-[48ch] leading-relaxed ${isRtl ? "font-body normal-case tracking-normal text-xs" : "font-mono"}`}>
                {copy.consent}
              </p>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full inline-flex items-center justify-center gap-3 bg-[var(--color-ink)] text-[var(--color-bone)] min-h-[48px] py-3.5 text-[12px] font-medium tracking-[0.1em] uppercase hover:bg-[var(--color-saffron-deep)] active:bg-[var(--color-saffron-deep)] transition-colors disabled:opacity-50"
              >
                {status === "submitting" ? (
                  <>
                    <span className="h-3 w-3 rounded-full border-2 border-[var(--color-bone)]/30 border-t-[var(--color-bone)] animate-spin" />
                    {copy.sending}
                  </>
                ) : (
                  <>
                    {copy.submit}
                    <span aria-hidden className={`material-symbols-outlined text-[18px] ${isRtl ? "rotate-180" : ""}`}>
                      arrow_forward
                    </span>
                  </>
                )}
              </button>

              {status === "error" && error && (
                <div role="alert" className="text-[var(--color-danger)] text-sm">
                  {error}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}

function ModalField({
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
  const inputClass =
    "w-full bg-transparent border-0 border-b border-[var(--color-ink)]/20 min-h-[44px] py-2.5 text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-ink)] transition-colors text-[15px] font-body" +
    (isRtl ? " text-right" : "");

  return (
    <div>
      <label
        htmlFor={name}
        className={`flex items-center gap-1 mb-2 ${isRtl ? "flex-row-reverse justify-end font-body normal-case tracking-normal text-sm text-[var(--color-muted)]" : "font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--color-muted)]"}`}
      >
        {required && <span className="text-[var(--color-saffron-deep)]">*</span>}
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          required={required}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={isRtl ? "rtl" : "ltr"}
          className={inputClass + " resize-none min-h-[100px]"}
        />
      ) : (
        <input
          id={name}
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
