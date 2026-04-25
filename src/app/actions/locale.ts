"use server";

import { revalidatePath } from "next/cache";
import { applyLocale } from "@/lib/i18n.server";
import { pickLocale, type Locale } from "@/lib/i18n";

export async function setLocaleAction(locale: Locale, returnTo: string = "/") {
  await applyLocale(pickLocale(locale));
  revalidatePath(returnTo);
}
