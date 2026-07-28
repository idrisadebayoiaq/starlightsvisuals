import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/contexts/auth-context";
import { isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { t } = useTranslation();
  const { isAdmin, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && isAdmin) {
    return <Navigate to="/admin" />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error(t("admin.login.notConfigured"));
      }
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t("admin.login.failed");
      if (/check your email/i.test(message)) {
        setInfo(message);
        setMode("signin");
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute inset-0 -z-10 grid-bg opacity-50" />
      <div className="w-full max-w-md border border-border/60 bg-card/70 p-8 backdrop-blur">
        <p className="font-script text-2xl text-neon-green">{t("admin.login.script")}</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">{t("admin.login.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("admin.login.subtitle")}</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground"
            >
              {t("admin.login.email")}
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-neon-green focus:outline-none focus:ring-1 focus:ring-neon-green"
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground"
            >
              {t("admin.login.password")}
            </label>
            <input
              id="admin-password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-neon-green focus:outline-none focus:ring-1 focus:ring-neon-green"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full rounded-md bg-neon-green px-4 py-2.5 font-display text-sm uppercase tracking-widest text-background transition hover:glow-blue disabled:opacity-60"
          >
            {submitting
              ? t("admin.login.working")
              : mode === "signin"
                ? t("admin.login.signIn")
                : t("admin.login.signUp")}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "signin" ? "signup" : "signin"));
            setError(null);
          }}
          className="mt-4 text-xs text-muted-foreground transition hover:text-neon-green"
        >
          {mode === "signin" ? t("admin.login.needAccount") : t("admin.login.haveAccount")}
        </button>

        <Link to="/" className="mt-6 block text-xs text-muted-foreground hover:text-foreground">
          ← {t("admin.login.backHome")}
        </Link>
      </div>
    </div>
  );
}
