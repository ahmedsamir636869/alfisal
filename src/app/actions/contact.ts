"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  message: string;
  interestedProject?: string;
}

export async function submitContact(payload: ContactPayload) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { error: insertError } = await supabase
    .from("contact_submissions")
    .insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || null,
      project_type: payload.projectType || null,
      budget: payload.budget || null,
      message: payload.message,
      interested_project: payload.interestedProject || null,
      status: "new",
    });

  if (insertError) {
    console.error("Failed to save contact submission:", insertError);
    return { ok: false, error: "db_error" } as const;
  }

  // Check if auto-email is enabled
  const { data: settings } = await supabase
    .from("site_content")
    .select("key, value")
    .eq("section", "contact")
    .in("key", ["notify_email", "auto_send_email"]);

  const settingsMap: Record<string, string> = {};
  for (const row of settings || []) {
    settingsMap[row.key] = row.value;
  }

  const autoSend = settingsMap.auto_send_email?.toLowerCase() === "true";
  const notifyEmail = settingsMap.notify_email?.trim();

  if (autoSend && notifyEmail) {
    try {
      // Use Supabase Edge Function or a simple webhook to send email.
      // For now we invoke a DB function that can be wired to pg_net or an Edge Function.
      await supabase.rpc("notify_contact_submission", {
        recipient: notifyEmail,
        sender_name: payload.name,
        sender_email: payload.email,
        project_type: payload.projectType || "",
        budget: payload.budget || "",
        brief: payload.message,
      });
    } catch (emailErr) {
      // Email failure is non-blocking — submission is already saved
      console.error("Email notification failed (non-blocking):", emailErr);
    }
  }

  return { ok: true } as const;
}
