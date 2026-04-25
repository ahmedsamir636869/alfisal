// ─────────────────────────────────────────────────────────────────────────────
// Internationalisation primitives.
//
// The site supports two locales: English (default, ltr) and Arabic (rtl).
// The active locale is persisted in a cookie and read on the server before
// content is fetched, so SSR markup matches the user's choice.
// ─────────────────────────────────────────────────────────────────────────────

export type Locale = "en" | "ar";

export const LOCALES: Locale[] = ["en", "ar"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export interface LocaleMeta {
  code: Locale;
  label: string;
  shortLabel: string;
  dir: "ltr" | "rtl";
  htmlLang: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: {
    code: "en",
    label: "English",
    shortLabel: "EN",
    dir: "ltr",
    htmlLang: "en",
  },
  ar: {
    code: "ar",
    label: "العربية",
    shortLabel: "ع",
    dir: "rtl",
    htmlLang: "ar",
  },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as string[]).includes(value);
}

export function pickLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
