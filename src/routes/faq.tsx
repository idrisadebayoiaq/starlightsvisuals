import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageHead, siteMeta } from "@/lib/site-meta";

const SECTION_IDS = ["general", "services", "production"] as const;
const ITEM_IDS = ["01", "02", "03"] as const;

export const Route = createFileRoute("/faq")({
  head: () => pageHead(siteMeta.faq),
  component: FaqPage,
});

function FaqPage() {
  const { t } = useTranslation();

  const sections = useMemo(
    () =>
      SECTION_IDS.map((sectionId) => ({
        id: sectionId,
        title: t(`accordionPage.sections.${sectionId}.title`),
        items: ITEM_IDS.map((itemId) => ({
          id: `${sectionId}-${itemId}`,
          question: t(`accordionPage.sections.${sectionId}.items.${itemId}.question`),
          answer: t(`accordionPage.sections.${sectionId}.items.${itemId}.answer`),
        })),
      })),
    [t],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate border-b border-border/40">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32 text-center">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-green">
            {t("accordionPage.label")}
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold text-balance md:text-7xl">
            {t("accordionPage.title")}
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("accordionPage.subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20 space-y-14">
        {sections.map((section) => (
          <div key={section.id}>
            <h2 className="mb-4 font-display text-sm uppercase tracking-[0.25em] text-neon-green">
              {section.title}
            </h2>
            <Accordion type="single" collapsible className="rounded-xl border border-border/60 bg-card/30 px-5 md:px-6">
              {section.items.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-border/50">
                  <AccordionTrigger className="py-5 font-display text-base uppercase tracking-wide text-foreground hover:text-neon-green hover:no-underline md:text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </section>

      <section className="border-t border-border/40 bg-card/20">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">{t("accordionPage.ctaTitle")}</h2>
          <p className="mt-3 text-muted-foreground">{t("accordionPage.ctaDesc")}</p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-neon-green px-8 py-3.5 font-display text-sm uppercase tracking-widest text-background transition hover:glow-blue"
          >
            {t("accordionPage.ctaButton")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
