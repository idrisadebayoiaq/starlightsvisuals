import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/contexts/auth-context";
import { getSupabase, type AdminRow } from "@/lib/supabase";

export const Route = createFileRoute("/admin/admins")({
  component: AdminAdminsPage,
});

function AdminAdminsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: queryError } = await getSupabase()
        .from("admins")
        .select("email,created_at,created_by")
        .order("created_at", { ascending: true });
      if (queryError) throw queryError;
      setAdmins((data as AdminRow[]) ?? []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t("admin.admins.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized) return;
    setSaving(true);
    setError(null);
    try {
      const { error: insertError } = await getSupabase().from("admins").insert({
        email: normalized,
        created_by: user?.email ?? null,
      });
      if (insertError) throw insertError;
      setEmail("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.admins.addError"));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(targetEmail: string) {
    if (user?.email && targetEmail.toLowerCase() === user.email.toLowerCase()) {
      setError(t("admin.admins.cannotDeleteSelf"));
      return;
    }
    if (!window.confirm(t("admin.admins.deleteConfirm", { email: targetEmail }))) return;
    try {
      const { error: deleteError } = await getSupabase()
        .from("admins")
        .delete()
        .eq("email", targetEmail);
      if (deleteError) throw deleteError;
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.admins.deleteError"));
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">{t("admin.admins.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("admin.admins.subtitle")}</p>

      <form onSubmit={onAdd} className="mt-6 flex flex-wrap gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("admin.admins.emailPlaceholder")}
          className="min-w-[240px] flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-neon-green focus:outline-none focus:ring-1 focus:ring-neon-green"
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-neon-green px-4 py-2 text-sm font-display uppercase tracking-widest text-background disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> {t("admin.admins.add")}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 overflow-x-auto border border-border/60">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-border/60 bg-card/60 text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">{t("admin.admins.colEmail")}</th>
              <th className="px-4 py-3">{t("admin.admins.colAdded")}</th>
              <th className="px-4 py-3 text-right">{t("admin.admins.colActions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-muted-foreground">
                  {t("admin.loading")}
                </td>
              </tr>
            ) : (
              admins.map((admin) => {
                const isSelf =
                  Boolean(user?.email) &&
                  admin.email.toLowerCase() === user!.email!.toLowerCase();
                return (
                  <tr key={admin.email} className="border-b border-border/40">
                    <td className="px-4 py-3">
                      {admin.email}
                      {isSelf && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-neon-green">
                          {t("admin.admins.you")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={isSelf}
                        onClick={() => void onDelete(admin.email)}
                        className="rounded border border-border p-1.5 text-muted-foreground hover:border-destructive hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={t("admin.delete")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
