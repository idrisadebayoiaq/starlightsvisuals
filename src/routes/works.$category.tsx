import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

import { fetchPublishedCategoryBySlug } from "@/hooks/use-cms-categories";
import { getCategory } from "@/lib/portfolio-works";
import { PROJECT_PLACEHOLDER } from "@/data/portfolio-placeholder";

export const Route = createFileRoute("/works/$category")({
  loader: async ({ params }) => {
    const staticCategory = getCategory(params.category);
    if (staticCategory) return { category: staticCategory };

    const cmsCategory = await fetchPublishedCategoryBySlug(params.category);
    if (cmsCategory) return { category: cmsCategory };

    // Soft stub — page will 404 if CMS never resolves
    if (params.category) {
      return {
        category: {
          slug: params.category,
          title: params.category,
          tagline: "",
          description: "",
          coverImage: PROJECT_PLACEHOLDER,
          clients: [],
        },
      };
    }
    throw notFound();
  },
  component: WorksCategoryLayout,
});

function WorksCategoryLayout() {
  return <Outlet />;
}
