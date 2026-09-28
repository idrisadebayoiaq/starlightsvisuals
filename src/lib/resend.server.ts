import { Resend } from "resend";

import { RESEND_FROM, RESEND_FROM_ADDRESS } from "@/lib/email-config";

function requireEnv(name: "RESEND_API_KEY"): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured on the server.`);
  }
  return value;
}

/** Studio inbox for form alerts and client replies. Always the public studio address. */
export function getContactInbox(): string {
  return RESEND_FROM_ADDRESS;
}

export function getResendClient(): Resend {
  return new Resend(requireEnv("RESEND_API_KEY"));
}

export { RESEND_FROM, RESEND_FROM_ADDRESS };
