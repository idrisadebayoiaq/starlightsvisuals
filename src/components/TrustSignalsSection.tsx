import { Clapperboard, Palette, Sparkles, Film } from "lucide-react";
import { FileLock2, FolderKanban, Gauge, Layers } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { SectionReveal } from "@/components/SectionReveal";

const INDUSTRIAL_ICONS = [FolderKanban, FileLock2, Layers, Gauge] as const;
const ENTERTAINMENT_ICONS = [Palette, Clapperboard, Sparkles, Film] as const;

type TrustSignalsSectionProps = {
  className?: string;
  /** Industrial CAD/NDA process (default) or brand/entertainment craft signals */
  variant?: "industrial" | "entertainment";
};

export function TrustSignalsSection({
  className,
  variant = "industrial",
}: TrustSignalsSectionProps) {
  const { t } = useTranslation();
  const isEntertainment = variant === "entertainment";
  const icons = isEntertainment ? ENTERTAINMENT_ICONS : INDUSTRIAL_ICONS;
  const keys = isEntertainment
    ? (["style", "pipeline", "review", "delivery"] as const)
    : (["cad", "nda", "review", "turnaround"] as const);
  const ns = isEntertainment ? "trustEntertainment" : "trust";

  const items = useMemo(
    () =>
      keys.map((key, i) => ({
        key,
        icon: icons[i],
        title: t(`${ns}.items.${key}.title`),
        desc: t(`${ns}.items.${key}.desc`),
      })),
    [t, keys, icons, ns],
  );

  return (
    <section className={className ?? "border-b border-border/40"}>
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-14 md:py-24">
        <SectionReveal className="mx-auto max-w-3xl text-center">
          <p className="font-script text-2xl text-neon-green">{t(`${ns}.label`)}</p>
          <h2 className="mt-2 font-display text-4xl tracking-tight md:text-6xl">
            {t(`${ns}.title`)}
          </h2>
        </SectionReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <SectionReveal key={item.key} className="rounded-xl border border-border/60 bg-card/30 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg neon-gradient text-background">
                <item.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-lg tracking-wide">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
