import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

/** Keep document title/description in sync with the active language. */
export function DocumentLangMeta() {
  const { t, i18n } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const meta = resolvePageMeta(pathname, t);
    if (!meta) return;

    document.title = meta.title;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute("content", meta.description);
  }, [pathname, t, i18n.language]);

  return null;
}

function resolvePageMeta(
  pathname: string,
  t: (key: string) => string,
): { title: string; description: string } | null {
  if (pathname === "/" || pathname === "") {
    return {
      title: t("home.metaTitle"),
      description: t("home.metaDescription"),
    };
  }
  if (pathname.startsWith("/services")) {
    return {
      title: t("servicesPage.metaTitle"),
      description: t("servicesPage.metaDescription"),
    };
  }
  if (pathname.startsWith("/about")) {
    return {
      title: t("aboutPage.metaTitle"),
      description: t("aboutPage.metaDescription"),
    };
  }
  if (pathname.startsWith("/contact")) {
    return {
      title: t("contactPage.metaTitle"),
      description: t("contactPage.metaDescription"),
    };
  }
  if (pathname.startsWith("/faq")) {
    return {
      title: t("accordionPage.metaTitle"),
      description: t("accordionPage.metaDescription"),
    };
  }
  if (pathname.startsWith("/portfolio") || pathname.startsWith("/works")) {
    return {
      title: t("portfolioPage.metaTitle"),
      description: t("portfolioPage.metaDescription"),
    };
  }
  if (pathname.startsWith("/blog")) {
    return {
      title: t("blogPage.metaTitle"),
      description: t("blogPage.metaDescription"),
    };
  }
  if (pathname.startsWith("/write-review")) {
    return {
      title: t("writeReviewPage.metaTitle"),
      description: t("writeReviewPage.metaDescription"),
    };
  }
  return null;
}
