import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { DocumentLangMeta } from "@/components/DocumentLangMeta";
import { TranslationPopup } from "@/components/TranslationPopup";
import { applyStoredLanguage } from "@/i18n";
import { isRtlLanguage } from "@/i18n/languages";

export function I18nShell({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    void applyStoredLanguage();
  }, []);

  useEffect(() => {
    const lang = i18n.language?.split("-")[0] ?? "en";
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtlLanguage(lang) ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <>
      <DocumentLangMeta />
      {children}
      <TranslationPopup />
    </>
  );
}
