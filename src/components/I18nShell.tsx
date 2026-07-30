import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouterState } from "@tanstack/react-router";

import { DocumentLangMeta } from "@/components/DocumentLangMeta";
import { TranslationPopup } from "@/components/TranslationPopup";
import { applyPublicLanguage, loadLocale } from "@/i18n";
import { ADMIN_UI_LANGUAGE, DEFAULT_LANGUAGE, isRtlLanguage } from "@/i18n/languages";

export function I18nShell({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (isAdminRoute) {
        await loadLocale(ADMIN_UI_LANGUAGE);
        if (!cancelled && i18n.language?.split("-")[0] !== ADMIN_UI_LANGUAGE) {
          await i18n.changeLanguage(ADMIN_UI_LANGUAGE);
        }
        return;
      }

      await applyPublicLanguage();
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdminRoute, i18n]);

  useEffect(() => {
    const lang = i18n.language?.split("-")[0] ?? DEFAULT_LANGUAGE;
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtlLanguage(lang) ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <>
      <DocumentLangMeta />
      {children}
      {!isAdminRoute && <TranslationPopup />}
    </>
  );
}
