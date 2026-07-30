import { Resend } from "resend";

import { RESEND_FROM } from "@/lib/email-config";

function requireEnv(name: "RESEND_API_KEY" | "CONTACT_EMAIL"): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured on the server.`);
  }
  return value;
}

export function getContactInbox(): string {
  return requireEnv("CONTACT_EMAIL");
}

export function getResendClient(): Resend {
  return new Resend(requireEnv("RESEND_API_KEY"));
}

export { RESEND_FROM };
