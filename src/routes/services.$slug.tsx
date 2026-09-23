import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TrustSignalsSection } from "@/components/TrustSignalsSection";
import {
  getIndustrialService,
  industrialServices,
  isIndustrialServiceSlug,
  serviceItemKey,
} from "@/data/industrial-services";
import { getServiceMedia } from "@/data/service-media";
import { ServiceMediaGallery } from "@/components/ServiceMediaGallery";
import { pageHead } from "@/lib/site-meta";
import en from "@/locales/en/common.json";

export const Route = createFileRoute("/services/$slug")({
  beforeLoad: ({ params }) => {
    if (!isIndustrialServiceSlug(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    if (!isIndustrialServiceSlug(params.slug)) {
      return pageHead({
        title: en.servicesPage.metaTitle,
        description: en.servicesPage.metaDescription,
      });
    }
    const details = (
      en.servicesPage as {
        details?: Record<string, { metaTitle?: string; metaDescription?: string }>;
      }
    ).details?.[params.slug];
    const itemKey = serviceItemKey(params.slug);
    const item = (
      en.servicesPage.items as Record<string, { title?: string; desc?: string }>
    )[itemKey];
    return pageHead({
      title: details?.metaTitle ?? `${item?.title ?? "Service"} | Starlights Visuals`,
      description: details?.metaDescription ?? item?.desc ?? en.servicesPage.metaDescription,
    });
  },
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const { t } = useTranslation();

  if (!isIndustrialServiceSlug(slug)) {
    throw notFound();
  }

  const service = getIndustrialService(slug)!;
  const itemKey = serviceItemKey(slug);
  const Icon = service.icon;
  const media = getServiceMedia(slug);
  const heroImage = media?.hero ?? service.image;
  const galleryItems = media?.gallery ?? [{ type: "image" as const, src: service.image }];

  const outcomes = useMemo(() => {
    const raw = t(`servicesPage.details.${slug}.outcomes`, { returnObjects: true });
    return Array.isArray(raw) ? (raw as string[]) : [];
  }, [t, slug]);

  const audience = useMemo(() => {
    const raw = t(`servicesPage.details.${slug}.audience`, { returnObjects: true });
    return Array.isArray(raw) ? (raw as string[]) : [];
  }, [t, slug]);

  const steps = useMemo(() => {
    const raw = t(`servicesPage.details.${slug}.steps`, { returnObjects: true });
    return Array.isArray(raw) ? (raw as string[]) : [];
  }, [t, slug]);

  const related = industrialServices.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate overflow-hidden border-b border-border/40">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/55 to-background" />
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-white/70 transition hover:text-neon-green"
          >
            <ArrowLeft className="h-4 w-4" /> {t("servicesPage.detailsNav.back")}
          </Link>
          <div className="mt-8 inline-flex h-14 w-14 items-center justify-center rounded-xl neon-gradient text-background">
            <Icon className="h-7 w-7" aria-hidden />
          </div>
          <p className="mt-6 font-display text-xs uppercase tracking-[0.3em] text-neon-green">
            {t("servicesPage.label")}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)] md:text-6xl text-balance">
            {t(`servicesPage.items.${itemKey}.title`)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">
            {t(`servicesPage.details.${slug}.intro`)}
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-neon-green px-7 py-3.5 font-display text-sm uppercase tracking-widest text-background"
          >
            {t("servicesPage.ctaButton")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="border-b border-border/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:px-14 md:py-24">
          <div>
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              {t("servicesPage.detailsNav.outcomes")}
            </h2>
            <ul className="mt-8 space-y-4">
              {outcomes.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon-green" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              {t("servicesPage.detailsNav.audience")}
            </h2>
            <ul className="mt-8 space-y-4">
              {audience.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon-green" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-14 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div>
              <h2 className="font-display text-3xl tracking-tight md:text-4xl">
                {t("servicesPage.detailsNav.process")}
              </h2>
              <ol className="mt-8 space-y-5">
                {steps.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="font-display text-sm text-neon-green">0{i + 1}</span>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h2 className="mb-6 font-display text-2xl tracking-tight md:text-3xl">
                {t("servicesPage.detailsNav.gallery")}
              </h2>
              <ServiceMediaGallery items={galleryItems} />
            </div>
          </div>
        </div>
      </section>

      <TrustSignalsSection />

      <section className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-14">
          <h2 className="font-display text-2xl tracking-tight md:text-3xl">
            {t("servicesPage.detailsNav.related")}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {related.map((item) => {
              const key = serviceItemKey(item.slug);
              return (
                <Link
                  key={item.slug}
                  to="/services/$slug"
                  params={{ slug: item.slug }}
                  className="group overflow-hidden rounded-xl border border-border/60 transition hover:border-neon-green"
                >
                  <img
                    src={getServiceMedia(item.slug)?.hero ?? item.image}
                    alt=""
                    className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-lg tracking-wide group-hover:text-neon-green">
                      {t(`servicesPage.items.${key}.title`)}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {t(`servicesPage.items.${key}.desc`)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-display text-3xl tracking-tight md:text-5xl text-balance">
          {t(`servicesPage.details.${slug}.ctaTitle`)}
        </h2>
        <p className="mt-4 text-muted-foreground">{t(`servicesPage.details.${slug}.ctaDesc`)}</p>
        <Link
          to="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-neon-green px-8 py-4 font-display text-sm uppercase tracking-widest text-background"
        >
          {t("servicesPage.ctaButton")} <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
