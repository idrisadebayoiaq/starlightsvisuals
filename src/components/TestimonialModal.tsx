import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Star, X } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TextTestimonial } from "@/components/TestimonialCard";
import { cn } from "@/lib/utils";

function avatarSrc(testimonial: TextTestimonial) {
  if (testimonial.avatarUrl) return testimonial.avatarUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.initials)}&background=1a1a1a&color=9dff57&size=128&bold=true&format=png`;
}

type TestimonialModalProps = {
  open: boolean;
  onClose: () => void;
  testimonial: TextTestimonial | null;
};

export function TestimonialModal({ open, onClose, testimonial }: TestimonialModalProps) {
  const { t } = useTranslation();
  const rating = testimonial?.rating ?? 5;
  const verified = testimonial?.verified ?? true;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && testimonial && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={testimonial.headline}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            type="button"
            aria-label={t("testimonials.seeLess")}
            className="absolute inset-0 bg-background/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.article
            className={cn(
              "relative z-10 flex max-h-[min(88vh,820px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl",
              "border border-border bg-card shadow-[0_40px_120px_-24px_rgba(0,0,0,0.55)]",
            )}
            initial={{ opacity: 0, scale: 0.88, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition hover:border-neon-green hover:text-neon-green"
              aria-label={t("testimonials.seeLess")}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="overflow-y-auto p-6 md:p-10">
              <div className="flex items-start justify-between gap-4 pr-12">
                <div
                  className="inline-flex gap-0.5 rounded-md bg-secondary px-2.5 py-1.5"
                  aria-label={t("testimonials.starsAria", { rating })}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < rating ? "fill-neon-green text-neon-green" : "text-muted-foreground/25",
                      )}
                    />
                  ))}
                </div>

                {verified && (
                  <div className="flex shrink-0 items-center gap-1.5 font-display text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                    <BadgeCheck className="h-3.5 w-3.5 text-neon-green" aria-hidden />
                    <span>{t("testimonials.verifiedClient")}</span>
                  </div>
                )}
              </div>

              <h3 className="mt-6 font-display text-xl uppercase leading-snug tracking-tight text-foreground md:text-2xl">
                {testimonial.headline}
              </h3>

              <blockquote className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {testimonial.quote}
              </blockquote>

              <figcaption className="mt-10 flex items-center gap-4 border-t border-border pt-6">
                <Avatar className="h-16 w-16 shrink-0 rounded-md border border-border">
                  <AvatarImage
                    src={avatarSrc(testimonial)}
                    alt={testimonial.name}
                    className="rounded-md object-cover"
                  />
                  <AvatarFallback className="rounded-md bg-secondary font-display text-sm text-neon-green">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-display text-base uppercase tracking-wide text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </figcaption>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
