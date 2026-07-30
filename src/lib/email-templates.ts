export type ContactEmailFields = {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  company?: string;
  message?: string;
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
    "Thank you for contacting Starlight Visual Studio.",
    "",
    "We have successfully received your message and one of our team members will get back to you as soon as possible.",
    "",
    "If your enquiry is urgent, you can also reply directly to this email.",
    "",
    "Best regards,",
    "",
    "Starlight Visual Studio",
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
