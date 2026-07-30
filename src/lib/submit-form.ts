import { submitContactFn, submitNewsletterFn } from "@/server/contact";

export type ContactFormPayload = {
  kind: "contact";
  name: string;
  email: string;
  projectType: string;
  message: string;
  phone?: string;
  company?: string;
};

export type NewsletterPayload = {
  kind: "newsletter";
  email: string;
};

export type FormSubmitPayload = ContactFormPayload | NewsletterPayload;

/** Studio public address shown on the site (not the Resend delivery target). */
export const STUDIO_EMAIL = "info@starlightvisualstudio.de";

export async function submitStudioForm(payload: FormSubmitPayload) {
  if (payload.kind === "contact") {
    await submitContactFn({ data: payload });
    return;
  }

  await submitNewsletterFn({ data: payload });
}
