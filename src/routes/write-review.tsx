import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Send, Star } from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getSupabase,
  isSupabaseConfigured,
  type ClientTestimonialInsert,
} from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { pageHead, siteMeta } from "@/lib/site-meta";

const inputClassName =
  "w-full rounded-md border border-border bg-background/60 px-4 py-3 text-sm text-foreground focus:border-neon-green focus:outline-none focus:ring-1 focus:ring-neon-green";

export const Route = createFileRoute("/write-review")({
  head: () => pageHead(siteMeta.writeReview),
  component: WriteReviewPage,
});

type FormState = {
  name: string;
  email: string;
  role: string;
  company: string;
  headline: string;
  quote: string;
  rating: number;
};

const initialForm: FormState = {
  name: "",
  email: "",
  role: "",
  company: "",
  headline: "",
  quote: "",
  rating: 5,
};

function WriteReviewPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured = useMemo(() => isSupabaseConfigured(), []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!configured) {
      setError(t("writeReviewPage.errorConfig"));
      return;
    }

    const payload: ClientTestimonialInsert = {
      name: form.name.trim(),
      role: form.role.trim(),
      company: form.company.trim(),
      headline: form.headline.trim(),
      quote: form.quote.trim(),
      rating: form.rating,
      email: form.email.trim() || null,
      verified: false,
      status: "pending",
    };

    if (payload.quote.length < 20) {
      setError(t("writeReviewPage.errorQuoteShort"));
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertError } = await getSupabase()
        .from("client_testimonials")
        .insert(payload);

      if (insertError) throw insertError;

      setSent(true);
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      setError(t("writeReviewPage.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate border-b border-border/40">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-green">
            {t("writeReviewPage.label")}
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight md:text-7xl">
            {t("writeReviewPage.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t("writeReviewPage.subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        {sent ? (
          <div className="rounded-xl border border-neon-green/30 bg-card/40 p-8 text-center md:p-12">
            <p className="font-display text-2xl tracking-tight text-neon-green">
              {t("writeReviewPage.successTitle")}
            </p>
            <p className="mt-3 text-muted-foreground">{t("writeReviewPage.successDesc")}</p>
            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-neon-green px-7 py-3.5 font-display text-sm uppercase tracking-widest text-background transition hover:glow-blue"
            >
              {t("writeReviewPage.backHome")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="rounded-xl border border-border/60 bg-card/40 p-6 md:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t("writeReviewPage.name")}>
                <input
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputClassName}
                />
              </Field>
              <Field label={t("writeReviewPage.email")}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputClassName}
                  placeholder={t("writeReviewPage.emailOptional")}
                />
              </Field>
              <Field label={t("writeReviewPage.role")}>
                <input
                  required
                  maxLength={120}
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className={inputClassName}
                />
              </Field>
              <Field label={t("writeReviewPage.company")}>
                <input
                  required
                  maxLength={120}
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className={inputClassName}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label={t("writeReviewPage.rating")}>
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const value = i + 1;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, rating: value }))}
                        aria-label={t("testimonials.starsAria", { rating: value })}
                        className="rounded p-1 text-neon-green transition hover:scale-110"
                      >
                        <Star
                          className={cn(
                            "h-6 w-6",
                            value <= form.rating
                              ? "fill-neon-green text-neon-green"
                              : "text-muted-foreground/30",
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>

            <div className="mt-5">
              <Field label={t("writeReviewPage.headline")}>
                <input
                  required
                  maxLength={160}
                  value={form.headline}
                  onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
                  className={inputClassName}
                  placeholder={t("writeReviewPage.headlinePlaceholder")}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label={t("writeReviewPage.quote")}>
                <textarea
                  required
                  minLength={20}
                  maxLength={2000}
                  rows={6}
                  value={form.quote}
                  onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                  className={cn(inputClassName, "resize-y")}
                  placeholder={t("writeReviewPage.quotePlaceholder")}
                />
              </Field>
            </div>

            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-neon-green px-8 py-3.5 font-display text-sm uppercase tracking-widest text-background transition hover:glow-blue disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? t("writeReviewPage.submitting") : t("writeReviewPage.submit")}
            </button>
          </form>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
