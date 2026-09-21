export type WorkMediaType = "image" | "video" | "youtube" | "vimeo";

export type WorkProject = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  mediaType: WorkMediaType;
  mediaSrc: string;
  tags: string[];
  year: number;
};

export type WorkClient = {
  slug: string;
  name: string;
  industry: string;
  /** Industry taxonomy slugs for filtering (e.g. robotics-automation) */
  industries?: string[];
  description: string;
  projectCount: number;
  testimonial?: string;
  logo: string;
  banner: string;
  services: string[];
  timeline: string;
  tools: string[];
  projects: WorkProject[];
};

export type WorkCategory = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  coverImage: string;
  clients: WorkClient[];
};
