import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export const STUDIO_EMAIL = "sternlichtespeciale@gmail.com";

export type ContactFormPayload = {
  kind: "contact";
  name: string;
  email: string;
  projectType: string;
  message: string;
};

export type NewsletterPayload = {
  kind: "newsletter";
  email: string;
};

export type FormSubmitPayload = ContactFormPayload | NewsletterPayload;

async function emailStudio(payload: FormSubmitPayload) {
  const isContact = payload.kind === "contact";
  const body: Record<string, string | boolean> = {
    _subject: isContact
      ? `New project inquiry — ${payload.name}`
      : "Newsletter signup — Starlights Visuals",
    _template: "table",
    _captcha: false,
    email: payload.email,
    form: isContact ? "Contact form" : "Newsletter",
  };

  if (isContact) {
    body.name = payload.name;
    body.project_type = payload.projectType;
    body.message = payload.message;
    body.replyto = payload.email;
  }

  const response = await fetch(`https://formsubmit.co/ajax/${STUDIO_EMAIL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Email delivery failed (${response.status})`);
  }

  return response.json().catch(() => ({ success: true }));
}

async function persistSubmission(payload: FormSubmitPayload) {
  if (!isSupabaseConfigured()) return;

  const row =
    payload.kind === "contact"
      ? {
          kind: "contact" as const,
          name: payload.name,
          email: payload.email,
          project_type: payload.projectType,
          message: payload.message,
        }
      : {
          kind: "newsletter" as const,
          name: null,
          email: payload.email,
          project_type: null,
          message: null,
        };

  const { error } = await getSupabase().from("contact_submissions").insert(row);
  if (error) {
    console.error("Failed to store contact submission", error);
  }
}

export async function submitStudioForm(payload: FormSubmitPayload) {
  await emailStudio(payload);
  // Persist after email so a delivery failure surfaces to the user.
  await persistSubmission(payload);
}
