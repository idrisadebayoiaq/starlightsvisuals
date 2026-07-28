import portfolioTrailer from "@/assets/portfolio-trailer.jpg";
import portfolioCharacter from "@/assets/portfolio-character.jpg";
import portfolioMotion from "@/assets/portfolio-motion.jpg";
import portfolio2d from "@/assets/portfolio-2d.jpg";
import portfolioCreature from "@/assets/portfolio-creature.jpg";
import portfolioIndustrial from "@/assets/portfolio-industrial.jpg";
import { blogPosts, type BlogPost } from "@/data/blog-posts";

const FALLBACK_IMAGES = [
  portfolioTrailer,
  portfolioCharacter,
  portfolioMotion,
  portfolio2d,
  portfolioCreature,
  portfolioIndustrial,
];

function hashSlug(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function resolveBlogImage(post: Pick<BlogPost, "slug" | "image"> & { image_url?: string }) {
  const url = (post.image_url ?? post.image ?? "").trim();
  if (url) return url;

  const staticMatch = blogPosts.find((p) => p.slug === post.slug);
  if (staticMatch?.image) return staticMatch.image;

  return FALLBACK_IMAGES[hashSlug(post.slug) % FALLBACK_IMAGES.length];
}
