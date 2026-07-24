import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionReveal } from "@/components/SectionReveal";

const SECTION_IDS = ["general", "services", "production"] as const;
const ITEM_IDS = ["01", "02", "03"] as const;

export function HomeFaqSection() {
  const { t, i18n } = useTranslation();

  const items = useMemo(
    () =>
      SECTION_IDS.flatMap((sectionId) =>
        ITEM_IDS.map((itemId) => ({
          id: `${sectionId}-${itemId}`,
          question: t(`accordionPage.sections.${sectionId}.items.${itemId}.question`),
          answer: t(`accordionPage.sections.${sectionId}.items.${itemId}.answer`),
        })),
      ),
    [t, i18n.language],
  );

  return (
    <section className="relative isolate overflow-hidden border-b border-border/40 bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-20" />

      <div className="mx-auto max-w-7xl px-6 py-20 md:px-14 md:py-28">
        <SectionReveal className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div>
            <p className="font-script text-2xl text-neon-green">{t("accordionPage.label")}</p>
            <h2 className="mt-2 font-display text-5xl tracking-tight md:text-7xl">
              {t("accordionPage.title")}
            </h2>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
              {t("accordionPage.subtitle")}
            </p>
          </div>
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-muted-foreground hover:text-neon-green"
          >
            {t("home.viewAllFaq")} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </SectionReveal>

        <SectionReveal>
          <Accordion
            type="single"
            collapsible
            className="rounded-xl border border-border/60 bg-card/30 px-5 md:px-6"
          >
            {items.map((item) => (
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
        </SectionReveal>

        <SectionReveal className="mt-12 text-center">
          <p className="text-muted-foreground">{t("accordionPage.ctaDesc")}</p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-neon-green px-8 py-3.5 font-display text-sm uppercase tracking-widest text-background transition hover:glow-blue"
          >
            {t("accordionPage.ctaButton")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}
