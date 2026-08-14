import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Twitter, Linkedin, Loader2, Mail, Send } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { SiteLogo } from "@/components/SiteLogo";
import { getErrorMessage } from "@/lib/error-message";
import { submitStudioForm } from "@/lib/submit-form";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SiteFooter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exploreLinks = useMemo(
    () => [
      { to: "/about", label: t("nav.about") },
      { to: "/services", label: t("nav.services") },
      { to: "/portfolio", label: t("nav.portfolio") },
      { to: "/blog", label: t("nav.blog") },
      { to: "/faq", label: t("nav.faq") },
      { to: "/write-review", label: t("nav.writeReview") },
      { to: "/contact", label: t("nav.contact") },
    ],
    [t],
  );

  async function onSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const trimmed = email.trim();
    if (!trimmed) {
      const message = t("footer.emailRequired");
      setError(message);
      toast.error(message);
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      const message = t("footer.emailInvalid");
      setError(message);
      toast.error(message);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await submitStudioForm({
        kind: "newsletter",
        email: trimmed,
      });
      setSubscribed(true);
      setEmail("");
      toast.success(t("footer.subscribed"));
    } catch (err) {
      console.error(err);
      const message = getErrorMessage(err, t("footer.subscribeError"));
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="relative border-t border-border/40 bg-card/40 overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg opacity-40" />

      <div className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h3 className="font-display text-3xl md:text-4xl tracking-wider">
            {t("footer.newsletterTitle")}{" "}
            <span className="neon-text">{t("footer.newsletterHighlight")}</span>
          </h3>
          <p className="mt-3 text-muted-foreground">{t("footer.newsletterDesc")}</p>
          <form onSubmit={onSubscribe} className="mt-6 mx-auto flex max-w-md gap-2">
            <input
              type="email"
              required
              value={email}
              disabled={submitting}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("footer.emailPlaceholder")}
              className="flex-1 rounded-md border border-border bg-background/60 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="inline-flex items-center gap-2 rounded-md neon-gradient px-5 py-3 text-sm font-display uppercase tracking-widest text-background transition hover:glow-purple disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {submitting ? t("footer.joining") : t("footer.join")}
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          {subscribed && <p className="mt-3 text-sm text-neon-blue">{t("footer.subscribed")}</p>}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <SiteLogo imageClassName="w-[128px]" />
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            {t("footer.tagline")}
          </p>
          <a
            href={`mailto:${t("brand.email")}`}
            className="mt-4 inline-flex items-center gap-2 text-sm text-neon-blue hover:text-glow"
          >
            <Mail className="h-4 w-4" />
            <span>{t("brand.email")}</span>
          </a>
        </div>

        <div>
          <p className="font-display text-xs uppercase tracking-widest text-neon-purple mb-4">
            {t("footer.explore")}
          </p>
          <ul className="space-y-2 text-sm">
            {exploreLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground hover:text-neon-blue transition">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-xs uppercase tracking-widest text-neon-purple mb-4">
            {t("footer.follow")}
          </p>
          <div className="flex gap-3">
            {[Instagram, Youtube, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={t("footer.social")}
                className="rounded-md border border-border p-2 text-muted-foreground hover:text-neon-blue hover:border-neon-blue hover:glow-blue transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 px-6 py-5 text-center text-xs text-muted-foreground">
        <span>{t("footer.copyright", { year: 2026 })}</span>
        <span className="mx-2 text-border">·</span>
        <Link to="/privacy" className="transition hover:text-neon-green">
          {t("footer.privacy")}
        </Link>
        <span className="mx-2 text-border">·</span>
        <Link to="/imprint" className="transition hover:text-neon-green">
          {t("footer.imprint")}
        </Link>
        <span className="mx-2 text-border">·</span>
        <Link
          to="/admin/login"
          className="text-muted-foreground/70 transition hover:text-muted-foreground"
        >
          {t("footer.adminLogin")}
        </Link>
      </div>
    </footer>
  );
}
