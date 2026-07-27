import { Link } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { TestimonialCard, type TextTestimonial } from "@/components/TestimonialCard";
import { SectionReveal } from "@/components/SectionReveal";
import { useApprovedTestimonials } from "@/hooks/use-approved-testimonials";
import { cn } from "@/lib/utils";

const MARQUEE_COPIES = 2;

export function TextTestimonialsSection() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-5% 0px" });
  const approvedFromClients = useApprovedTestimonials();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const staticTestimonials: TextTestimonial[] = useMemo(
    () => [
      {
        id: "hauke",
        headline: t("testimonials.items.hauke.headline"),
        quote: t("testimonials.items.hauke.quote"),
        name: "Hauke",
        company: "SmarAct Group",
        role: t("testimonials.items.hauke.role"),
        initials: "HA",
        rating: 5,
      },
      {
        id: "jeremy",
        headline: t("testimonials.items.jeremy.headline"),
        quote: t("testimonials.items.jeremy.quote"),
        name: "Jeremy Canfyn",
        company: "iJockey",
        role: t("testimonials.items.jeremy.role"),
        initials: "JC",
        rating: 5,
      },
      {
        id: "raiv",
        headline: t("testimonials.items.raiv.headline"),
        quote: t("testimonials.items.raiv.quote"),
        name: "Raiv",
        company: "Eroraiv",
        role: t("testimonials.items.raiv.role"),
        initials: "RA",
        rating: 5,
      },
      {
        id: "ilija",
        headline: t("testimonials.items.ilija.headline"),
        quote: t("testimonials.items.ilija.quote"),
        name: "Ilija Marovic",
        company: "Novatorq",
        role: t("testimonials.items.ilija.role"),
        initials: "IM",
        rating: 5,
      },
      {
        id: "luigi",
        headline: t("testimonials.items.luigi.headline"),
        quote: t("testimonials.items.luigi.quote"),
        name: "Luigi Commisso",
        company: "Mintec",
        role: t("testimonials.items.luigi.role"),
        initials: "LC",
        rating: 5,
      },
      {
        id: "jason",
        headline: t("testimonials.items.jason.headline"),
        quote: t("testimonials.items.jason.quote"),
        name: "Jason Kintzler",
        company: "Drop band",
        role: t("testimonials.items.jason.role"),
        initials: "JK",
        rating: 5,
      },
      {
        id: "burkhard",
        headline: t("testimonials.items.burkhard.headline"),
        quote: t("testimonials.items.burkhard.quote"),
        name: "Burkhard Kahl-Pfeiffer",
        company: "INTEGRA-pw",
        role: t("testimonials.items.burkhard.role"),
        initials: "BK",
        rating: 5,
      },
      {
        id: "robert",
        headline: t("testimonials.items.robert.headline"),
        quote: t("testimonials.items.robert.quote"),
        name: "Robert",
        company: "Rifari's Wrist Watch",
        role: t("testimonials.items.robert.role"),
        initials: "RO",
        rating: 5,
      },
    ],
    [t, i18n.language],
  );

  const testimonials = useMemo(() => {
    const staticIds = new Set(staticTestimonials.map((item) => item.id));
    const uniqueClient = approvedFromClients
      .map((item, index) => ({
        ...item,
        id: item.id || `client-${item.name}-${index}`,
      }))
      .filter((item) => !staticIds.has(item.id));
    return [...staticTestimonials, ...uniqueClient];
  }, [approvedFromClients, staticTestimonials]);

  useEffect(() => {
    if (!expandedId) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setExpandedId(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [expandedId]);

  function toggleExpand(id: string) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <section className="relative isolate overflow-hidden border-b border-border/40 bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,oklch(0.88_0.27_142/0.06),transparent)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-20" />

      <div className="mx-auto max-w-7xl px-6 py-20 md:px-14 md:py-28">
        <SectionReveal className="mx-auto max-w-4xl text-center">
          <span className="trusted-by-badge inline-flex items-center rounded-full border border-neon-green/30 bg-neon-green px-4 py-1.5 font-display text-[9px] font-bold uppercase tracking-[0.22em] text-background md:text-[10px] md:tracking-[0.25em]">
            {t("testimonials.badge")}
          </span>

          <h2 className="mt-5 font-display text-2xl uppercase leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-none">
            <span className="text-foreground">{t("testimonials.title1")}</span>{" "}
            <span className="neon-text text-glow">{t("testimonials.title2")}</span>
          </h2>

          <Link
            to="/write-review"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-neon-green/40 bg-neon-green/10 px-6 py-3 font-display text-xs uppercase tracking-[0.18em] text-neon-green transition hover:border-neon-green hover:bg-neon-green hover:text-background"
          >
            {t("testimonials.writeYours")}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </SectionReveal>
      </div>

      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="pb-20 md:pb-28"
      >
        {expandedId && (
          <button
            type="button"
            aria-label={t("testimonials.seeLess")}
            className="fixed inset-0 z-20 bg-background/50 backdrop-blur-[2px]"
            onClick={() => setExpandedId(null)}
          />
        )}

        <div className="relative z-30 mx-auto hidden max-w-7xl gap-5 px-6 motion-reduce:grid motion-reduce:grid-cols-1 md:px-14 motion-reduce:sm:grid-cols-2 motion-reduce:lg:grid-cols-4">
          {testimonials.map((item) => (
            <TestimonialCard
              key={item.id}
              testimonial={item}
              expanded={expandedId === item.id}
              onToggle={() => toggleExpand(item.id)}
            />
          ))}
        </div>

        <div
          className={cn(
            "testimonial-marquee-shell relative z-30 w-full overflow-visible motion-reduce:hidden",
            expandedId && "is-paused",
            "before:pointer-events-none before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-10 before:bg-gradient-to-r before:from-background before:to-transparent md:before:w-20",
            "after:pointer-events-none after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-10 after:bg-gradient-to-l after:from-background after:to-transparent md:after:w-20",
          )}
        >
          <div className="testimonial-marquee-track flex w-max flex-nowrap py-6 will-change-transform">
            {Array.from({ length: MARQUEE_COPIES }, (_, copyIndex) => (
              <div
                key={copyIndex}
                className="flex shrink-0 flex-nowrap gap-5 px-2.5"
                aria-hidden={copyIndex > 0}
              >
                {testimonials.map((item) => (
                  <div
                    key={`${copyIndex}-${item.id}`}
                    className={cn(
                      "testimonial-marquee-card shrink-0",
                      copyIndex > 0 && "pointer-events-none",
                    )}
                  >
                    <TestimonialCard
                      testimonial={item}
                      expanded={copyIndex === 0 && expandedId === item.id}
                      onToggle={copyIndex === 0 ? () => toggleExpand(item.id) : undefined}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
