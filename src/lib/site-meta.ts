import de from "@/locales/de/common.json";

/** SSR / static head defaults — German is the public site default. */
export const siteMeta = {
  home: {
    title: de.home.metaTitle,
    description: de.home.metaDescription,
  },
  services: {
    title: de.servicesPage.metaTitle,
    description: de.servicesPage.metaDescription,
  },
  about: {
    title: de.aboutPage.metaTitle,
    description: de.aboutPage.metaDescription,
  },
  contact: {
    title: de.contactPage.metaTitle,
    description: de.contactPage.metaDescription,
  },
  faq: {
    title: de.accordionPage.metaTitle,
    description: de.accordionPage.metaDescription,
  },
  portfolio: {
    title: de.portfolioPage.metaTitle,
    description: de.portfolioPage.metaDescription,
  },
  blog: {
    title: de.blogPage.metaTitle,
    description: de.blogPage.metaDescription,
  },
  writeReview: {
    title: de.writeReviewPage.metaTitle,
    description: de.writeReviewPage.metaDescription,
  },
  siteName: de.brand.name,
} as const;

export function pageHead(meta: { title: string; description: string }) {
  return {
    meta: [
      { title: meta.title },
      { name: "description", content: meta.description },
      { property: "og:title", content: meta.title },
      { property: "og:description", content: meta.description },
      { property: "og:site_name", content: siteMeta.siteName },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: meta.title },
      { name: "twitter:description", content: meta.description },
    ],
  };
}
