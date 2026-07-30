import { BRAND_STUDIO_NAME, getSiteUrl } from "@/lib/email-config";
import {
  renderDetailRows,
  renderEmailShell,
  renderMessageCard,
  renderParagraphs,
} from "@/lib/email-layout";

export type ContactEmailFields = {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  company?: string;
  message?: string;
};

export type EmailContent = {
  subject: string;
  text: string;
  html: string;
};

export function buildContactNotificationText(fields: ContactEmailFields): string {
  const lines = [
    "--------------------------------",
    "New Contact Form Submission",
    "",
    "Name:",
    fields.name,
    "",
    "Email:",
    fields.email,
  ];

  if (fields.phone?.trim()) {
    lines.push("", "Phone:", fields.phone.trim());
  }
  if (fields.service?.trim()) {
    lines.push("", "Service:", fields.service.trim());
  }
  if (fields.company?.trim()) {
    lines.push("", "Company:", fields.company.trim());
  }
  if (fields.message?.trim()) {
    lines.push("", "Message:", fields.message.trim());
  }

  lines.push("--------------------------------");
  return lines.join("\n");
}

export function buildContactConfirmationText(name: string): string {
  return [
    `Hi ${name},`,
    "",
    `Thank you for contacting ${BRAND_STUDIO_NAME}.`,
    "",
    "We have successfully received your message and one of our team members will get back to you as soon as possible.",
    "",
    "If your enquiry is urgent, you can also reply directly to this email.",
    "",
    "Best regards,",
    "",
    BRAND_STUDIO_NAME,
  ].join("\n");
}

export function buildNewsletterNotificationText(email: string): string {
  return [
    "--------------------------------",
    "New Newsletter Signup",
    "",
    "Email:",
    email,
    "--------------------------------",
  ].join("\n");
}

export function buildNewsletterWelcomeText(email: string): string {
  return [
    "Welcome to Starlights Visuals.",
    "",
    "Thanks for joining our newsletter. You'll get behind-the-scenes drops, project reveals, and trailer premieres.",
    "",
    `You're subscribed as ${email}.`,
    "",
    "Best regards,",
    "",
    BRAND_STUDIO_NAME,
  ].join("\n");
}

export function buildAdminMessageText(message: string): string {
  return [
    message,
    "",
    "—",
    BRAND_STUDIO_NAME,
    getSiteUrl(),
  ].join("\n");
}

export function buildContactNotificationEmail(fields: ContactEmailFields): EmailContent {
  const subject = "New Contact Form Submission";
  const rows = [
    { label: "Name", value: fields.name },
    { label: "Email", value: fields.email, href: `mailto:${fields.email}` },
  ];
  if (fields.phone?.trim()) rows.push({ label: "Phone", value: fields.phone.trim() });
  if (fields.service?.trim()) rows.push({ label: "Service", value: fields.service.trim() });
  if (fields.company?.trim()) rows.push({ label: "Company", value: fields.company.trim() });

  const bodyHtml = [
    renderParagraphs(["A new project inquiry just came in from the website contact form."]),
    renderDetailRows(rows),
    fields.message?.trim()
      ? `<p style="margin:22px 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#4cff3d;">Message</p>${renderMessageCard(fields.message.trim())}`
      : "",
  ].join("");

  return {
    subject,
    text: buildContactNotificationText(fields),
    html: renderEmailShell({
      preheader: `New inquiry from ${fields.name}`,
      title: "New Contact Form Submission",
      eyebrow: "Studio inbox",
      bodyHtml,
      cta: { label: "Reply to sender", href: `mailto:${fields.email}` },
    }),
  };
}

export function buildContactConfirmationEmail(name: string): EmailContent {
  const subject = "We've Received Your Message";
  const bodyHtml = renderParagraphs([
    `Hi ${name},`,
    `Thank you for contacting ${BRAND_STUDIO_NAME}.`,
    "We have successfully received your message and one of our team members will get back to you as soon as possible.",
    "If your enquiry is urgent, you can also reply directly to this email.",
    `Best regards,\n${BRAND_STUDIO_NAME}`,
  ]);

  return {
    subject,
    text: buildContactConfirmationText(name),
    html: renderEmailShell({
      preheader: "We've received your message — our team will reply soon.",
      title: "We've Received Your Message",
      eyebrow: "Message confirmed",
      bodyHtml,
      cta: { label: "Explore our work", href: `${getSiteUrl()}/portfolio` },
    }),
  };
}

export function buildNewsletterNotificationEmail(email: string): EmailContent {
  const subject = "New Newsletter Signup";
  const bodyHtml = [
    renderParagraphs(["Someone just joined the Starlights newsletter."]),
    renderDetailRows([{ label: "Email", value: email, href: `mailto:${email}` }]),
  ].join("");

  return {
    subject,
    text: buildNewsletterNotificationText(email),
    html: renderEmailShell({
      preheader: `New newsletter signup: ${email}`,
      title: "New Newsletter Signup",
      eyebrow: "Audience growth",
      bodyHtml,
    }),
  };
}

export function buildNewsletterWelcomeEmail(email: string): EmailContent {
  const subject = "Welcome to Starlights Visuals";
  const bodyHtml = renderParagraphs([
    "Welcome to Starlights Visuals.",
    "Thanks for joining our newsletter. You'll get behind-the-scenes drops, project reveals, and trailer premieres.",
    `You're subscribed as ${email}.`,
    `Best regards,\n${BRAND_STUDIO_NAME}`,
  ]);

  return {
    subject,
    text: buildNewsletterWelcomeText(email),
    html: renderEmailShell({
      preheader: "You're on the list — welcome to Starlights Visuals.",
      title: "You're In",
      eyebrow: "Newsletter",
      bodyHtml,
      cta: { label: "Visit the studio", href: getSiteUrl() },
    }),
  };
}

export function buildAdminCustomerEmail(subject: string, message: string): EmailContent {
  const bodyHtml = [
    renderParagraphs(["A note from Starlight Visual Studio:"]),
    renderMessageCard(message),
    renderParagraphs([`Best regards,\n${BRAND_STUDIO_NAME}`]),
  ].join("");

  return {
    subject,
    text: buildAdminMessageText(message),
    html: renderEmailShell({
      preheader: subject,
      title: subject,
      eyebrow: "Studio message",
      bodyHtml,
      cta: { label: "Visit website", href: getSiteUrl() },
    }),
  };
}
