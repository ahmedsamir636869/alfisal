import "server-only";
import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  type Locale,
  pickLocale,
} from "./i18n";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return pickLocale(store.get(LOCALE_COOKIE)?.value);
}

export const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function applyLocale(locale: Locale = DEFAULT_LOCALE) {
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax",
  });
}
