import { createFileRoute } from "@tanstack/react-router";
import { Clock, Instagram, Linkedin, Loader2, Mail, MapPin, Send, Twitter, Youtube } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getErrorMessage } from "@/lib/error-message";
import { submitStudioForm } from "@/lib/submit-form";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Starlights Visuals" },
      {
        name: "description",
        content:
          "Get in touch with Starlights Visuals for 2D & 3D animation, motion graphics, VFX, product animation, and cinematic trailer projects.",
      },
      { property: "og:title", content: "Contact Starlights Visuals" },
      { property: "og:description", content: "Start a project with our animation & VFX studio." },
    ],
  }),
  component: ContactPage,
});

type ContactFormState = {
  name: string;
  email: string;
  projectType: string;
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });

  const projectTypes = useMemo(
    () => [
      t("contactPage.projectTypes.2d"),
      t("contactPage.projectTypes.3d"),
      t("contactPage.projectTypes.trailer"),
      t("contactPage.projectTypes.character"),
      t("contactPage.projectTypes.motion"),
      t("contactPage.projectTypes.other"),
    ],
    [t],
  );

  function validate(): string | null {
    if (!form.name.trim()) return t("contactPage.errors.nameRequired");
    if (!form.email.trim()) return t("contactPage.errors.emailRequired");
    if (!EMAIL_RE.test(form.email.trim())) return t("contactPage.errors.emailInvalid");
    if (!(form.projectType || projectTypes[0]).trim()) {
      return t("contactPage.errors.serviceRequired");
    }
    if (!form.message.trim()) return t("contactPage.errors.messageRequired");
    return null;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await submitStudioForm({
        kind: "contact",
        name: form.name.trim(),
        email: form.email.trim(),
        projectType: form.projectType || projectTypes[0],
        message: form.message.trim(),
      });
      setSent(true);
      setForm({ name: "", email: "", projectType: "", message: "" });
      toast.success(t("contactPage.sentToast"));
    } catch (err) {
      console.error(err);
      const message = getErrorMessage(err, t("contactPage.errorGeneric"));
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClassName =
    "mt-2 w-full rounded-md border border-border bg-background/60 px-4 py-3 text-sm focus:border-neon-green focus:outline-none focus:ring-1 focus:ring-neon-green disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate border-b border-border/40">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-blue">
            {t("contactPage.label")}
          </p>
          <h1 className="mt-4 text-balance font-display text-5xl font-bold md:text-7xl">
            <span className="neon-text text-glow">{t("contactPage.title")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t("contactPage.subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-card/40 p-8 md:p-10 lg:col-span-3">
          <h2 className="font-display text-2xl tracking-wider">{t("contactPage.formTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("contactPage.formDesc")}</p>

          {sent ? (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-neon-green">{t("contactPage.sent")}</p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-xs uppercase tracking-widest text-muted-foreground transition hover:text-neon-green"
              >
                {t("contactPage.sendAnother")}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 grid gap-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                    {t("contactPage.name")}
                  </label>
                  <input
                    required
                    name="name"
                    value={form.name}
                    disabled={submitting}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                    {t("contactPage.email")}
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={form.email}
                    disabled={submitting}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={inputClassName}
                  />
                </div>
              </div>
              <div>
                <label className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                  {t("contactPage.projectType")}
                </label>
                <select
                  required
                  name="projectType"
                  value={form.projectType || projectTypes[0]}
                  disabled={submitting}
                  onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))}
                  className={inputClassName}
                >
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                  {t("contactPage.message")}
                </label>
                <textarea
                  rows={5}
                  required
                  name="message"
                  value={form.message}
                  disabled={submitting}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className={inputClassName}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-md neon-gradient px-6 py-3 font-display text-sm uppercase tracking-widest text-background transition hover:glow-purple disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? t("contactPage.sending") : t("contactPage.send")}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card/40 p-8">
            <Mail className="h-7 w-7 text-neon-blue" />
            <h3 className="mt-4 font-display text-xl tracking-wider">{t("contactPage.emailUs")}</h3>
            <a
              href={`mailto:${t("brand.email")}`}
              className="mt-2 block break-all text-neon-blue hover:text-glow"
            >
              {t("brand.email")}
            </a>
            <p className="mt-2 text-xs text-muted-foreground">{t("contactPage.emailDesc")}</p>
          </div>
          <div className="rounded-xl border border-border bg-card/40 p-8">
            <MapPin className="h-7 w-7 text-neon-purple" />
            <h3 className="mt-4 font-display text-xl tracking-wider">{t("contactPage.studio")}</h3>
            <p className="mt-2 text-muted-foreground">{t("contactPage.studioDesc")}</p>
          </div>
          <div className="rounded-xl border border-border bg-card/40 p-8">
            <Clock className="h-7 w-7 text-neon-blue" />
            <h3 className="mt-4 font-display text-xl tracking-wider">
              {t("contactPage.responseTime")}
            </h3>
            <p className="mt-2 text-muted-foreground">{t("contactPage.responseDesc")}</p>
          </div>
          <div className="rounded-xl border border-border bg-card/40 p-8">
            <p className="font-display text-xs uppercase tracking-widest text-neon-purple">
              {t("footer.follow")}
            </p>
            <div className="mt-4 flex gap-3">
              {[Instagram, Youtube, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={t("footer.social")}
                  className="rounded-md border border-border p-2 text-muted-foreground transition hover:border-neon-blue hover:text-neon-blue hover:glow-blue"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
