import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Mail, Send, Trash2, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth-context";
import { getErrorMessage } from "@/lib/error-message";
import { getSupabase, type ContactSubmissionRow } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { sendAdminCustomerEmailFn } from "@/server/admin-email";

export const Route = createFileRoute("/admin/contacts")({
  component: AdminContactsPage,
});

type Filter = "all" | "contact" | "newsletter";

function AdminContactsPage() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [rows, setRows] = useState<ContactSubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | "all">("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let query = getSupabase()
        .from("contact_submissions")
        .select("id,kind,name,email,project_type,message,created_at")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("kind", filter);
      }

      const { data, error: queryError } = await query;
      if (queryError) throw queryError;
      setRows((data as ContactSubmissionRow[]) ?? []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, t("admin.contacts.loadError")));
    } finally {
      setLoading(false);
    }
  }, [filter, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const customers = useMemo(() => {
    const map = new Map<string, { email: string; name: string | null; count: number }>();
    for (const row of rows) {
      const key = row.email.trim().toLowerCase();
      if (!key) continue;
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        if (!existing.name && row.name) existing.name = row.name;
      } else {
        map.set(key, { email: key, name: row.name, count: 1 });
      }
    }
    return [...map.values()].sort((a, b) => a.email.localeCompare(b.email));
  }, [rows]);

  async function onDelete(id: string) {
    if (!window.confirm(t("admin.contacts.deleteConfirm"))) return;
    try {
      const { error: deleteError } = await getSupabase()
        .from("contact_submissions")
        .delete()
        .eq("id", id);
      if (deleteError) throw deleteError;
      toast.success(t("admin.contacts.deleted"));
      await load();
    } catch (err) {
      const messageText = getErrorMessage(err, t("admin.contacts.deleteError"));
      setError(messageText);
      toast.error(messageText);
    }
  }

  async function onSend(e: FormEvent) {
    e.preventDefault();
    if (sending) return;

    const accessToken = session?.access_token;
    if (!accessToken) {
      toast.error(t("admin.contacts.unauthorized"));
      return;
    }

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();
    if (!trimmedSubject) {
      toast.error(t("admin.contacts.subjectRequired"));
      return;
    }
    if (!trimmedMessage) {
      toast.error(t("admin.contacts.messageRequired"));
      return;
    }

    setSending(true);
    try {
      const result = await sendAdminCustomerEmailFn({
        data: {
          accessToken,
          to: selectedEmail,
          subject: trimmedSubject,
          message: trimmedMessage,
        },
      });

      toast.success(
        t("admin.contacts.sendSuccess", {
          sent: result.sent,
          total: result.recipientCount,
        }),
      );
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
      const messageText = getErrorMessage(err, t("admin.contacts.sendError"));
      toast.error(messageText);
      setError(messageText);
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">{t("admin.contacts.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("admin.contacts.subtitle")}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "contact", "newsletter"] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs uppercase tracking-wider transition",
              filter === status
                ? "border-neon-green bg-neon-green/15 text-neon-green"
                : "border-border text-muted-foreground hover:border-neon-green/50",
            )}
          >
            {t(`admin.contacts.filter.${status}`)}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="overflow-x-auto rounded-md border border-border/60">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border/60 bg-muted/20 font-display text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">{t("admin.contacts.colWhen")}</th>
                <th className="px-4 py-3">{t("admin.contacts.colKind")}</th>
                <th className="px-4 py-3">{t("admin.contacts.colName")}</th>
                <th className="px-4 py-3">{t("admin.contacts.colEmail")}</th>
                <th className="px-4 py-3">{t("admin.contacts.colDetails")}</th>
                <th className="px-4 py-3 text-right">{t("admin.contacts.colActions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-muted-foreground">
                    {t("admin.loading")}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-muted-foreground">
                    {t("admin.contacts.empty")}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-border/40 align-top">
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 capitalize">{row.kind}</td>
                    <td className="px-4 py-3">{row.name || "—"}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="text-left text-neon-green hover:underline"
                        onClick={() => setSelectedEmail(row.email.trim().toLowerCase())}
                      >
                        {row.email}
                      </button>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      {row.project_type && (
                        <p className="text-xs text-muted-foreground">{row.project_type}</p>
                      )}
                      {row.message && (
                        <p className="mt-1 line-clamp-3 text-xs text-foreground/80">{row.message}</p>
                      )}
                      {!row.project_type && !row.message && "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => void onDelete(row.id)}
                        className="inline-flex rounded-md border border-border p-1.5 text-muted-foreground transition hover:border-destructive hover:text-destructive"
                        aria-label={t("admin.delete")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="rounded-md border border-border/60 bg-card/40 p-5">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-neon-green" />
              <h2 className="font-display text-sm tracking-wider">
                {t("admin.contacts.customersTitle")}
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("admin.contacts.customersCount", { count: customers.length })}
            </p>
            <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto text-sm">
              {customers.length === 0 ? (
                <li className="text-muted-foreground">{t("admin.contacts.noCustomers")}</li>
              ) : (
                customers.map((customer) => (
                  <li key={customer.email}>
                    <button
                      type="button"
                      onClick={() => setSelectedEmail(customer.email)}
                      className={cn(
                        "w-full rounded-md px-2 py-1.5 text-left transition",
                        selectedEmail === customer.email
                          ? "bg-neon-green/15 text-neon-green"
                          : "hover:bg-muted/40",
                      )}
                    >
                      <span className="block truncate">{customer.email}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {customer.name || t("admin.contacts.unknownName")} · {customer.count}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <form
            onSubmit={onSend}
            className="rounded-md border border-border/60 bg-card/40 p-5"
            noValidate
          >
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-neon-green" />
              <h2 className="font-display text-sm tracking-wider">
                {t("admin.contacts.composeTitle")}
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{t("admin.contacts.composeHint")}</p>

            <label className="mt-4 block font-display text-[10px] uppercase tracking-widest text-muted-foreground">
              {t("admin.contacts.recipient")}
            </label>
            <select
              value={selectedEmail}
              disabled={sending}
              onChange={(e) => setSelectedEmail(e.target.value as string | "all")}
              className="mt-2 w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm disabled:opacity-60"
            >
              <option value="all">{t("admin.contacts.allCustomers")}</option>
              {customers.map((customer) => (
                <option key={customer.email} value={customer.email}>
                  {customer.email}
                </option>
              ))}
            </select>

            <label className="mt-4 block font-display text-[10px] uppercase tracking-widest text-muted-foreground">
              {t("admin.contacts.subject")}
            </label>
            <input
              value={subject}
              disabled={sending}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm disabled:opacity-60"
            />

            <label className="mt-4 block font-display text-[10px] uppercase tracking-widest text-muted-foreground">
              {t("admin.contacts.message")}
            </label>
            <textarea
              rows={7}
              value={message}
              disabled={sending}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={sending || customers.length === 0}
              aria-busy={sending}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md neon-gradient px-4 py-2.5 font-display text-xs uppercase tracking-widest text-background transition hover:glow-purple disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? t("admin.contacts.sending") : t("admin.contacts.send")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
