import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  buildContactConfirmationEmail,
  buildContactNotificationEmail,
  buildNewsletterNotificationEmail,
  buildNewsletterWelcomeEmail,
} from "@/lib/email-templates";
import { getContactInbox, getResendClient, RESEND_FROM } from "@/lib/resend.server";
import { getServerSupabaseAnon } from "@/lib/supabase-admin.server";

const contactSchema = z.object({
  kind: z.literal("contact"),
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(254),
  projectType: z.string().trim().min(1, "Service is required").max(120),
  message: z.string().trim().min(1, "Message is required").max(5000),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(120).optional(),
});

const newsletterSchema = z.object({
  kind: z.literal("newsletter"),
  email: z.string().trim().email("Please enter a valid email address").max(254),
});

function formatZodError(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Invalid form data";
}

async function persistSubmission(row: {
  kind: "contact" | "newsletter";
  name: string | null;
  email: string;
  project_type: string | null;
  message: string | null;
}) {
  try {
    const { error } = await getServerSupabaseAnon().from("contact_submissions").insert(row);
    if (error) {
      console.error("[contact] Failed to store submission", error);
    }
  } catch (err) {
    console.error("[contact] Unexpected persist error", err);
  }
}

export const submitContactFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) throw new Error(formatZodError(parsed.error));
    return parsed.data;
  })
  .handler(async ({ data }) => {
    const inbox = getContactInbox();
    const resend = getResendClient();

    const notificationEmail = buildContactNotificationEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.projectType,
      company: data.company,
      message: data.message,
    });

    const notification = await resend.emails.send({
      from: RESEND_FROM,
      to: inbox,
      replyTo: data.email,
      subject: notificationEmail.subject,
      text: notificationEmail.text,
      html: notificationEmail.html,
    });

    if (notification.error) {
      console.error("[contact] Resend notification failed", notification.error);
      throw new Error(notification.error.message || "Failed to send your message. Please try again.");
    }

    const confirmationEmail = buildContactConfirmationEmail(data.name);
    const confirmation = await resend.emails.send({
      from: RESEND_FROM,
      to: data.email,
      replyTo: inbox,
      subject: confirmationEmail.subject,
      text: confirmationEmail.text,
      html: confirmationEmail.html,
    });

    if (confirmation.error) {
      // Inquiry already reached the studio — log but don't fail the visitor.
      console.error("[contact] Resend confirmation failed", confirmation.error);
    }

    await persistSubmission({
      kind: "contact",
      name: data.name,
      email: data.email,
      project_type: data.projectType,
      message: data.message,
    });

    return { ok: true as const };
  });

export const submitNewsletterFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = newsletterSchema.safeParse(data);
    if (!parsed.success) throw new Error(formatZodError(parsed.error));
    return parsed.data;
  })
  .handler(async ({ data }) => {
    const inbox = getContactInbox();
    const resend = getResendClient();

    const notificationEmail = buildNewsletterNotificationEmail(data.email);
    const notification = await resend.emails.send({
      from: RESEND_FROM,
      to: inbox,
      replyTo: data.email,
      subject: notificationEmail.subject,
      text: notificationEmail.text,
      html: notificationEmail.html,
    });

    if (notification.error) {
      console.error("[newsletter] Resend notification failed", notification.error);
      throw new Error(notification.error.message || "Could not complete signup. Please try again.");
    }

    const welcomeEmail = buildNewsletterWelcomeEmail(data.email);
    const welcome = await resend.emails.send({
      from: RESEND_FROM,
      to: data.email,
      replyTo: inbox,
      subject: welcomeEmail.subject,
      text: welcomeEmail.text,
      html: welcomeEmail.html,
    });

    if (welcome.error) {
      console.error("[newsletter] Welcome email failed", welcome.error);
    }

    await persistSubmission({
      kind: "newsletter",
      name: null,
      email: data.email,
      project_type: null,
      message: null,
    });

    return { ok: true as const };
  });
