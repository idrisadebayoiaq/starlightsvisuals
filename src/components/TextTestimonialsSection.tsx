import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { TestimonialCard, type TextTestimonial } from "@/components/TestimonialCard";
import { SectionReveal } from "@/components/SectionReveal";
import { cn } from "@/lib/utils";

const MARQUEE_COPIES = 2;

export function TextTestimonialsSection() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-5% 0px" });

  const testimonials: TextTestimonial[] = useMemo(
    () => [
      {
        headline: t("testimonials.items.hauke.headline"),
        quote: t("testimonials.items.hauke.quote"),
        name: "Hauke",
        company: "SmarAct Group",
        role: t("testimonials.items.hauke.role"),
        initials: "HA",
        rating: 5,
      },
      {
        headline: t("testimonials.items.elena.headline"),
        quote: t("testimonials.items.elena.quote"),
        name: "Elena Vasquez",
        company: "Raycon",
        role: t("testimonials.items.elena.role"),
        initials: "EV",
        rating: 5,
      },
      {
        headline: t("testimonials.items.james.headline"),
        quote: t("testimonials.items.james.quote"),
        name: "James Whitfield",
        company: "Crossrope",
        role: t("testimonials.items.james.role"),
        initials: "JW",
        rating: 5,
      },
      {
        headline: t("testimonials.items.amara.headline"),
        quote: t("testimonials.items.amara.quote"),
        name: "Amara Okonkwo",
        company: "Depology",
        role: t("testimonials.items.amara.role"),
        initials: "AO",
        rating: 5,
      },
    ],
    [t, i18n.language],
  );

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
        </SectionReveal>
      </div>

      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="pb-20 md:pb-28"
      >
        <div className="mx-auto hidden max-w-7xl gap-5 px-6 motion-reduce:grid motion-reduce:grid-cols-1 md:px-14 motion-reduce:sm:grid-cols-2 motion-reduce:lg:grid-cols-4">
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} testimonial={item} />
          ))}
        </div>

        <div
          className={cn(
            "testimonial-marquee-shell relative w-full motion-reduce:hidden",
            "before:pointer-events-none before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-10 before:bg-gradient-to-r before:from-background before:to-transparent md:before:w-20",
            "after:pointer-events-none after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-10 after:bg-gradient-to-l after:from-background after:to-transparent md:after:w-20",
          )}
        >
          <div className="testimonial-marquee-track flex w-max flex-nowrap will-change-transform">
            {Array.from({ length: MARQUEE_COPIES }, (_, copyIndex) => (
              <div
                key={copyIndex}
                className="flex shrink-0 flex-nowrap gap-5 px-2.5"
                aria-hidden={copyIndex > 0}
              >
                {testimonials.map((item) => (
                  <div
                    key={`${copyIndex}-${item.name}`}
                    className={cn(
                      "testimonial-marquee-card shrink-0",
                      copyIndex > 0 && "pointer-events-none",
                    )}
                  >
                    <TestimonialCard testimonial={item} />
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
