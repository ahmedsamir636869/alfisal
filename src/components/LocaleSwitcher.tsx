"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocaleAction } from "@/app/actions/locale";
import { LOCALES, type Locale } from "@/lib/i18n";

interface LocaleSwitcherProps {
  active: Locale;
  currentPath?: string;
  variant?: "nav" | "mobile" | "header-mobile" | "inline";
}

export default function LocaleSwitcher({
  active,
  currentPath = "/",
  variant = "nav",
}: LocaleSwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleSelect = (locale: Locale) => {
    if (locale === active || pending) return;
    startTransition(async () => {
      await setLocaleAction(locale, currentPath);
      router.refresh();
    });
  };

  // Display label — keep "EN" Latin-bold and "ع" in the brand serif so the
  // toggle reads as a visual seal rather than competing with the wordmark.
  const labelFor = (l: Locale) => (l === "ar" ? "ع" : "EN");

  if (variant === "header-mobile") {
    const next: Locale = active === "ar" ? "en" : "ar";
    return (
      <button
        type="button"
        onClick={() => handleSelect(next)}
        disabled={pending}
        aria-label={next === "ar" ? "التبديل إلى العربية" : "Switch to English"}
        className={`md:hidden h-9 min-w-[38px] px-2 inline-flex items-center justify-center border border-[var(--color-hairline)] text-[var(--color-ink-soft)] transition-colors active:bg-[var(--color-parchment)] ${
          next === "ar" ? "font-display text-[17px] leading-none" : "font-mono text-[11px] tracking-[0.12em] uppercase"
        }`}
      >
        {labelFor(next)}
      </button>
    );
  }

  if (variant === "mobile") {
    return (
      <div
        role="group"
        aria-label="Language"
        className="flex items-center gap-2 mt-6 pt-6 border-t border-[var(--color-hairline)]"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-muted)] me-3">
          Lang
        </span>
        {LOCALES.map((l) => {
          const isActive = l === active;
          return (
            <button
              key={l}
              type="button"
              onClick={() => handleSelect(l)}
              disabled={pending}
              aria-pressed={isActive}
              className={`min-w-[44px] h-9 px-3 text-[12px] tracking-[0.16em] uppercase border transition-colors ${
                isActive
                  ? "bg-[var(--color-ink)] text-[var(--color-bone)] border-[var(--color-ink)]"
                  : "text-[var(--color-ink-soft)] border-[var(--color-hairline)] hover:border-[var(--color-ink)]"
              } ${l === "ar" ? "font-display text-[18px]" : "font-mono"}`}
            >
              {labelFor(l)}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className="hidden md:inline-flex items-center text-[11px] tracking-[0.16em] uppercase text-[var(--color-muted)] border border-[var(--color-hairline)] divide-x divide-[var(--color-hairline)] rtl:divide-x-reverse"
    >
      {LOCALES.map((l) => {
        const isActive = l === active;
        return (
          <button
            key={l}
            type="button"
            onClick={() => handleSelect(l)}
            disabled={pending || isActive}
            aria-pressed={isActive}
            aria-label={l === "ar" ? "العربية" : "English"}
            className={`px-3 h-9 inline-flex items-center justify-center min-w-[36px] transition-colors ${
              isActive
                ? "bg-[var(--color-ink)] text-[var(--color-bone)]"
                : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)]"
            } ${l === "ar" ? "font-display text-[16px] leading-none" : "font-mono"}`}
          >
            {labelFor(l)}
          </button>
        );
      })}
    </div>
  );
}
