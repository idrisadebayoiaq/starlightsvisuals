import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

/** Keep document title/description (and social tags) in sync with the active language. */
export function DocumentLangMeta() {
  const { t, i18n } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const meta = resolvePageMeta(pathname, t);
    if (!meta) return;

    document.title = meta.title;

    upsertMeta("name", "description", meta.description);
    upsertMeta("property", "og:title", meta.title);
    upsertMeta("property", "og:description", meta.description);
    upsertMeta("name", "twitter:title", meta.title);
    upsertMeta("name", "twitter:description", meta.description);
  }, [pathname, t, i18n.language]);

  return null;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function resolvePageMeta(
  pathname: string,
  t: (key: string) => string,
): { title: string; description: string } | null {
  if (pathname.startsWith("/admin")) {
    return {
      title: t("admin.metaTitle"),
      description: t("admin.metaDescription"),
    };
  }
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
  return {
    title: t("home.metaTitle"),
    description: t("home.metaDescription"),
  };
}
