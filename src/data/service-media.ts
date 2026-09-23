/** Service page hero + gallery media from Google Drive service folders. */
export type ServiceMediaKind = "image" | "video";

export type ServiceMediaItem = {
  type: ServiceMediaKind;
  src: string;
  poster?: string;
};

export type ServiceMediaPack = {
  hero: string;
  gallery: ServiceMediaItem[];
};

/**
 * Paths under /public/services/<slug>/
 * hero is also used on services index cards.
 */
export const serviceMedia: Record<string, ServiceMediaPack> = {
  technical: {
    hero: "/services/technical/hero.jpg",
    gallery: [
      { type: "image", src: "/services/technical/slide-1.jpg" },
      { type: "image", src: "/services/technical/slide-2.jpg" },
      { type: "image", src: "/services/technical/slide-3.jpg" },
    ],
  },
  exploded: {
    hero: "/services/exploded/hero.png",
    gallery: [
      { type: "image", src: "/services/exploded/slide-1.png" },
      { type: "image", src: "/services/exploded/slide-2.png" },
      { type: "image", src: "/services/exploded/slide-3.jpg" },
    ],
  },
  "trade-show": {
    hero: "/services/trade-show/hero.jpg",
    gallery: [
      { type: "image", src: "/services/trade-show/slide-1.jpg" },
      { type: "image", src: "/services/trade-show/slide-2.jpg" },
      {
        type: "video",
        src: "/services/trade-show/ijockey.mp4",
        poster: "/services/trade-show/ijockey-poster.jpg",
      },
    ],
  },
  robotics: {
    hero: "/services/robotics/hero.jpg",
    gallery: [
      { type: "image", src: "/services/robotics/slide-1.jpg" },
      { type: "image", src: "/services/robotics/slide-2.png" },
      { type: "image", src: "/services/robotics/slide-3.jpg" },
    ],
  },
  explainer: {
    hero: "/services/explainer/hero.png",
    gallery: [
      { type: "image", src: "/services/explainer/slide-1.png" },
      { type: "image", src: "/services/explainer/slide-2.png" },
      { type: "image", src: "/services/explainer/slide-3.png" },
      { type: "image", src: "/services/explainer/slide-4.png" },
      { type: "image", src: "/services/explainer/slide-5.png" },
      {
        type: "video",
        src: "/services/explainer/autoz-crave.mp4",
        poster: "/services/explainer/hero.png",
      },
    ],
  },
  cad: {
    hero: "/services/cad/hero.png",
    gallery: [
      { type: "image", src: "/services/cad/slide-1.png" },
      {
        type: "video",
        src: "/services/cad/cad-demo.mp4",
        poster: "/services/cad/hero.png",
      },
    ],
  },
};

export function getServiceMedia(slug: string): ServiceMediaPack | undefined {
  return serviceMedia[slug];
}
