import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SiteLogo } from "@/components/SiteLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { industries } from "@/data/industries";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);

  const industryLinks = useMemo(
    () =>
      industries.map((item) => ({
        slug: item.slug,
        label: t(`industries.items.${item.slug}.navLabel`),
      })),
    [t],
  );

  const nav = useMemo(
    () => [
      { to: "/services", label: t("nav.services") },
      { to: "/portfolio", label: t("nav.work") },
      { to: "/case-studies", label: t("nav.caseStudies") },
      { to: "/about", label: t("nav.about") },
      { to: "/blog", label: t("nav.blog") },
      { to: "/contact", label: t("nav.contact") },
    ],
    [t],
  );

  function closeMobile() {
    setMobileOpen(false);
    setIndustriesOpen(false);
  }

  return (
    <header className="relative z-40 border-b border-border/40 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <SiteLogo onClick={closeMobile} />

        <nav className="hidden items-center gap-6 lg:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIndustriesOpen((o) => !o)}
              className="group flex items-center gap-1 font-display text-xs uppercase tracking-widest text-foreground/80 transition hover:text-foreground"
              aria-expanded={industriesOpen}
            >
              <span>{t("nav.industries")}</span>
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition", industriesOpen && "rotate-180")}
                aria-hidden
              />
            </button>
            {industriesOpen && (
              <div className="absolute left-0 top-full z-50 mt-3 min-w-[220px] rounded-xl border border-border/60 bg-background/95 p-3 shadow-xl backdrop-blur">
                <Link
                  to="/industries"
                  onClick={closeMobile}
                  className="block rounded-md px-3 py-2 font-display text-[11px] uppercase tracking-widest text-muted-foreground transition hover:bg-card hover:text-neon-green"
                >
                  {t("industries.title")}
                </Link>
                {industryLinks.map((item) => (
                  <Link
                    key={item.slug}
                    to="/industries/$slug"
                    params={{ slug: item.slug }}
                    onClick={closeMobile}
                    className="block rounded-md px-3 py-2 text-sm text-foreground/80 transition hover:bg-card hover:text-neon-green"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="group relative font-display text-xs uppercase tracking-widest text-foreground/80 transition hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              <span className="relative inline-block">
                {n.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-neon-green transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <LanguageSwitcher theme={theme} />
          <Link
            to="/portfolio"
            className="hidden font-script text-xl text-neon-green hover:text-glow sm:inline"
          >
            {t("nav.portfolioCta")}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? t("header.closeMenu") : t("header.openMenu")}
            aria-expanded={mobileOpen}
            aria-controls="site-mobile-nav"
            className="rounded border border-border p-2 text-foreground transition hover:border-neon-green hover:text-neon-green lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="site-mobile-nav"
          className="border-t border-border/40 bg-background px-5 py-4 lg:hidden"
        >
          <nav className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setIndustriesOpen((o) => !o)}
              className="flex w-full items-center justify-between font-display text-sm uppercase tracking-widest text-foreground/80"
              aria-expanded={industriesOpen}
            >
              <span>{t("nav.industries")}</span>
              <ChevronDown
                className={cn("h-4 w-4 transition", industriesOpen && "rotate-180")}
                aria-hidden
              />
            </button>
            {industriesOpen && (
              <div className="space-y-2 border-l border-border/60 pl-3">
                <Link
                  to="/industries"
                  onClick={closeMobile}
                  className="block font-display text-[11px] uppercase tracking-widest text-muted-foreground transition hover:text-neon-green"
                >
                  {t("industries.title")}
                </Link>
                {industryLinks.map((item) => (
                  <Link
                    key={item.slug}
                    to="/industries/$slug"
                    params={{ slug: item.slug }}
                    onClick={closeMobile}
                    className="block text-sm text-foreground/80 transition hover:text-neon-green"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={closeMobile}
                className="font-display text-sm uppercase tracking-widest text-foreground/80 transition hover:text-neon-green"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
