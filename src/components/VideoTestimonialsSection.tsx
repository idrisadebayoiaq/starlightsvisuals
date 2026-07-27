import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { SectionReveal, StaggerReveal } from "@/components/SectionReveal";
import { VideoModal } from "@/components/VideoModal";
import {
  VideoTestimonialCard,
  type VideoTestimonial,
} from "@/components/VideoTestimonialCard";
import { resolveShowcaseVideo, type ShowcaseVideoKey } from "@/data/showcase-media";
import portfolioCharacter from "@/assets/portfolio-character.jpg";
import portfolioCreature from "@/assets/portfolio-creature.jpg";
import portfolioIndustrial from "@/assets/portfolio-industrial.jpg";
import portfolioMotion from "@/assets/portfolio-motion.jpg";
import portfolioTrailer from "@/assets/portfolio-trailer.jpg";
import portfolio2d from "@/assets/portfolio-2d.jpg";

const fallbackPosters: Record<ShowcaseVideoKey, string> = {
  trailer: portfolioTrailer,
  character: portfolioCharacter,
  creature: portfolioCreature,
  industrial: portfolioIndustrial,
  motion: portfolioMotion,
  twoD: portfolio2d,
};

export function VideoTestimonialsSection() {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState<VideoTestimonial | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselInView = useInView(carouselRef, { once: true, margin: "-5% 0px" });

  const videoTestimonials: VideoTestimonial[] = useMemo(
    () =>
      (
        [
          {
            id: "trailer",
            key: "trailer" as const,
            name: "Alex Morgan",
            company: "Nova Studios",
            role: t("testimonials.videoRoles.ceo"),
            initials: "AM",
            duration: "2:20",
            progress: 0.38,
          },
          {
            id: "character",
            key: "character" as const,
            name: "Priya Shah",
            company: "Nova Vanguard",
            role: t("testimonials.videoRoles.artDirector"),
            initials: "PS",
            duration: "1:45",
            progress: 0.42,
          },
          {
            id: "creature",
            key: "creature" as const,
            name: "Jonas Weber",
            company: "Abyss Studios",
            role: t("testimonials.videoRoles.founder"),
            initials: "JW",
            duration: "2:05",
            progress: 0.3,
          },
          {
            id: "industrial",
            key: "industrial" as const,
            name: "Mia Laurent",
            company: "Ronix",
            role: t("testimonials.videoRoles.headProduction"),
            initials: "ML",
            duration: "1:58",
            progress: 0.48,
          },
          {
            id: "motion",
            key: "motion" as const,
            name: "Elena Vasquez",
            company: "Raycon",
            role: t("testimonials.videoRoles.vpMarketing"),
            initials: "EV",
            duration: "2:12",
            progress: 0.35,
          },
          {
            id: "2d",
            key: "twoD" as const,
            name: "James Whitfield",
            company: "Crossrope",
            role: t("testimonials.videoRoles.coFounder"),
            initials: "JW",
            duration: "1:32",
            progress: 0.55,
          },
        ] as const
      )
        .map((item) => {
          const resolved = resolveShowcaseVideo(item.key);
          if (!resolved) return null;

          return {
            id: item.id,
            videoSrc: resolved.videoSrc,
            poster: resolved.poster ?? fallbackPosters[item.key],
            name: item.name,
            company: item.company,
            role: item.role,
            initials: item.initials,
            duration: item.duration,
            progress: item.progress,
          };
        })
        .filter((item): item is VideoTestimonial => item !== null),
    [t, i18n.language],
  );

  if (videoTestimonials.length === 0) return null;

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border/40 bg-background">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,oklch(0.88_0.27_142/0.06),transparent)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-20" />

        <div className="mx-auto max-w-7xl px-6 py-20 md:px-14 md:py-28">
          <SectionReveal className="mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center border border-neon-green/80 px-4 py-1.5 font-display text-[9px] uppercase tracking-[0.28em] text-foreground md:text-[10px]">
              {t("testimonials.videoBadge")}
            </span>

            <h2 className="mt-5 font-display text-2xl uppercase leading-tight tracking-tight text-balance sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-none">
              {t("testimonials.videoTitle1")}{" "}
              <span className="neon-text text-glow">{t("testimonials.videoTitle2")}</span>{" "}
              {t("testimonials.videoTitle3")}
            </h2>
          </SectionReveal>

          <StaggerReveal className="mt-12 hidden gap-5 sm:grid sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
            {videoTestimonials.map((v) => (
              <VideoTestimonialCard key={v.id} testimonial={v} onPlay={() => setActive(v)} />
            ))}
          </StaggerReveal>

          <motion.div
            ref={carouselRef}
            initial={{ opacity: 0, y: 32 }}
            animate={carouselInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 sm:hidden"
          >
            <div className="testimonial-carousel -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4">
              {videoTestimonials.map((v) => (
                <div key={v.id} className="w-[min(88vw,320px)] shrink-0 snap-center">
                  <VideoTestimonialCard testimonial={v} onPlay={() => setActive(v)} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <VideoModal
        open={active !== null}
        onClose={() => setActive(null)}
        videoSrc={active?.videoSrc ?? ""}
        poster={active?.poster}
        title={
          active
            ? t("testimonials.videoModalTitle", { name: active.name })
            : t("testimonials.videoModalDefault")
        }
      />
    </>
  );
}
