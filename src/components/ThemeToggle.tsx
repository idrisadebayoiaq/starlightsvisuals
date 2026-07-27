import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? t("header.switchToDark") : t("header.switchToLight")}
      aria-pressed={isLight}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded border border-border bg-background text-foreground shadow-sm backdrop-blur transition hover:border-neon-green hover:text-neon-green",
        className,
      )}
    >
      {isLight ? (
        <Moon className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <Sun className="h-3.5 w-3.5" aria-hidden />
      )}
    </button>
  );
}
