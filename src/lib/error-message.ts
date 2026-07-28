/** Normalize Supabase / unknown thrown values into a readable message. */
export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string" && err.trim()) return err;
  if (err && typeof err === "object") {
    const maybe = err as { message?: unknown; error_description?: unknown; details?: unknown };
    if (typeof maybe.message === "string" && maybe.message.trim()) return maybe.message;
    if (typeof maybe.error_description === "string" && maybe.error_description.trim()) {
      return maybe.error_description;
    }
    if (typeof maybe.details === "string" && maybe.details.trim()) return maybe.details;
  }
  return fallback;
}
