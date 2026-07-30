import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import siteLogo from "@/assets/starlights-logo-transparent.png";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  imageClassName?: string;
  onClick?: () => void;
};

export function SiteLogo({ className, imageClassName, onClick }: SiteLogoProps) {
  const { t } = useTranslation();

  return (
    <Link
      to="/"
      onClick={onClick}
      className={cn("inline-block shrink-0", className)}
      aria-label={t("brand.name")}
    >
      <img
        src={siteLogo}
        alt={t("brand.name")}
        width={771}
        height={625}
        decoding="async"
        className={cn(
          "h-auto w-[96px] max-w-full object-contain object-left",
          "drop-shadow-[0_0_14px_rgba(76,255,61,0.45)]",
          "sm:w-[124px] md:w-[148px] lg:w-[160px]",
          imageClassName,
        )}
      />
    </Link>
  );
}
