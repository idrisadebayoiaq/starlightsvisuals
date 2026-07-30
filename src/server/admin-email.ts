import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getResendClient, RESEND_FROM } from "@/lib/resend.server";
import {
  assertAdminFromAccessToken,
  getAuthedSupabase,
} from "@/lib/supabase-admin.server";

const sendSchema = z.object({
  accessToken: z.string().min(1, "Unauthorized"),
  /** Single email, or "all" to message every unique customer email on file. */
  to: z.union([z.literal("all"), z.string().trim().email("Invalid recipient email")]),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(10000),
});

function formatZodError(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Invalid request";
}

async function loadCustomerEmails(accessToken: string): Promise<string[]> {
  const supabase = getAuthedSupabase(accessToken);
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("email")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin-email] Failed to load customer emails", error);
    throw new Error(error.message || "Failed to load customer emails");
  }

  const unique = new Set<string>();
  for (const row of data ?? []) {
    const email = typeof row.email === "string" ? row.email.trim().toLowerCase() : "";
    if (email.includes("@")) unique.add(email);
  }
  return [...unique];
}

export const sendAdminCustomerEmailFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = sendSchema.safeParse(data);
    if (!parsed.success) throw new Error(formatZodError(parsed.error));
    return parsed.data;
  })
  .handler(async ({ data }) => {
    await assertAdminFromAccessToken(data.accessToken);

    const recipients =
      data.to === "all" ? await loadCustomerEmails(data.accessToken) : [data.to.trim().toLowerCase()];

    if (recipients.length === 0) {
      throw new Error("No customer emails found to message.");
    }

    const resend = getResendClient();
    let sent = 0;
    const failures: string[] = [];

    // Send in small parallel chunks to avoid rate-limit spikes.
    const chunkSize = 8;
    for (let i = 0; i < recipients.length; i += chunkSize) {
      const chunk = recipients.slice(i, i + chunkSize);
      const outcomes = await Promise.allSettled(
        chunk.map(async (email) => {
          const result = await resend.emails.send({
            from: RESEND_FROM,
            to: email,
            subject: data.subject,
            text: data.message,
          });
          if (result.error) {
            throw new Error(result.error.message || `Failed to send to ${email}`);
          }
          return email;
        }),
      );

      outcomes.forEach((outcome, index) => {
        if (outcome.status === "fulfilled") {
          sent += 1;
        } else {
          const email = chunk[index] ?? "unknown";
          failures.push(email);
          console.error("[admin-email] Send failed", email, outcome.reason);
        }
      });
    }

    if (sent === 0) {
      throw new Error(
        failures.length
          ? `Failed to send email (${failures.length} recipient${failures.length === 1 ? "" : "s"}).`
          : "Failed to send email.",
      );
    }

    if (failures.length) {
      console.error("[admin-email] Partial send failures", failures);
    }

    return {
      ok: true as const,
      sent,
      failed: failures.length,
      recipientCount: recipients.length,
    };
  });
