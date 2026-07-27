import portfolioTrailer from "@/assets/portfolio-trailer.jpg";
import portfolioCharacter from "@/assets/portfolio-character.jpg";
import portfolioMotion from "@/assets/portfolio-motion.jpg";
import portfolio2d from "@/assets/portfolio-2d.jpg";
import portfolioCreature from "@/assets/portfolio-creature.jpg";
import portfolioIndustrial from "@/assets/portfolio-industrial.jpg";

export type BlogPostSection = {
  heading?: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  sections: BlogPostSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "cinematic-trailers-that-convert",
    title: "Why cinematic trailers convert better than product demos",
    excerpt: "Story first launch films build emotional stakes before the CTA. Here is how we structure hooks, pacing, and grade for maximum retention.",
    category: "Strategy",
    date: "May 12, 2026",
    readTime: "6 min read",
    image: portfolioTrailer,
    author: "Starlights Visuals",
    sections: [
      {
        paragraphs: [
          "Product demos explain features. Cinematic trailers create desire. The difference is narrative architecture how quickly you establish stakes, who the audience is rooting for, and when the payoff lands relative to your call to action.",
          "We see this consistently in paid social and landing page tests: story first launch films hold attention longer, improve thumb stop rates, and lift downstream conversion when the CTA arrives after emotional investment rather than before it.",
        ],
      },
      {
        heading: "Hook structure that holds attention",
        paragraphs: [
          "The first three seconds should answer one question: why should I care? That can be a visual surprise, a human moment, or a tension the product resolves but it cannot be a logo sting followed by a spec sheet.",
          "We map hooks on a simple grid: problem → escalation → reveal → proof → CTA. Each beat gets a time budget before we ever open a timeline. That discipline keeps edits tight and prevents the \"feature montage\" trap that kills retention on mobile.",
        ],
      },
      {
        heading: "Pacing and grade for premium feel",
        paragraphs: [
          "Pacing is not just cut frequency it is breath. We leave room for macro product moments, let typography land, and use sound design to carry transitions so cuts feel intentional rather than frantic.",
          "Grade is the final trust signal. Consistent contrast, controlled highlights, and a cohesive color world make DTC films feel editorial instead of templated. When grade matches the brand's physical packaging and site photography, the whole funnel feels like one studio made it.",
        ],
      },
      {
        heading: "What to ship first",
        paragraphs: [
          "Start with a 15, 30 second hero film for your landing page and paid social, then derive cutdowns from the same master edit rather than rebuilding from scratch. Modular scenes intro tension, product reveal, lifestyle proof make versioning fast without diluting the story.",
          "If you are planning a launch, send us your positioning and timeline. We will storyboard the hook sequence first so you can validate narrative before full production spend.",
        ],
      },
    ],
  },
  {
    slug: "character-design-for-ip",
    title: "Character design that anchors your IP across every channel",
    excerpt: "From silhouette readability to merch ready turnarounds the checklist we use before a hero goes into production.",
    category: "Craft",
    date: "May 3, 2026",
    readTime: "5 min read",
    image: portfolioCharacter,
    author: "Starlights Visuals",
    sections: [
      {
        paragraphs: [
          "A strong character is readable at a glance in an app icon, on a billboard, and on a hoodie. Before we animate or rig anything, we pressure test silhouette, expression range, and costume storytelling so the design survives every downstream format.",
        ],
      },
      {
        heading: "Silhouette and expression",
        paragraphs: [
          "We thumbnail dozens of shapes before color. If you cannot identify the character in pure black fill at 48 pixels, the design is not ready for production.",
          "Expression sheets come early. Campaign characters need to sell joy, frustration, and triumph without dialogue. We define brow, eye, and mouth combinations that animators can reuse across scenes.",
        ],
      },
      {
        heading: "Merch and turnarounds",
        paragraphs: [
          "Turnarounds are not paperwork they are insurance. Front, three quarter, side, and back views with material callouts prevent expensive surprises when the character moves to 3D, embroidery, or vinyl figures.",
          "We document palette, fabric logic, and accessory hierarchy so brand teams can brief vendors without re explaining the design language every time.",
        ],
      },
    ],
  },
  {
    slug: "production-pipelines-that-ship",
    title: "Production pipelines that ship: concept to final delivery",
    excerpt: "How we align art direction, technical constraints, and milestone reviews so teams ship on time without sacrificing polish.",
    category: "Production",
    date: "Apr 21, 2026",
    readTime: "8 min read",
    image: portfolioIndustrial,
    author: "Starlights Visuals",
    sections: [
      {
        paragraphs: [
          "Projects slip when creative direction and delivery constraints meet for the first time at the end of a milestone. Our pipeline front loads technical limits, establishes a single approval path, and keeps work in progress visible so producers can de risk schedules early.",
        ],
      },
      {
        heading: "Pre production alignment",
        paragraphs: [
          "We start with a visual target board and a technical brief: resolution, format, lighting model, and animation requirements. Concept work is built with those limits in mind, not as fantasy that gets fixed later.",
          "Milestone reviews are structured as gate checks concept approved, blockout approved, final polish with clear deliverable lists at each stage so nothing ambiguous carries into the next sprint.",
        ],
      },
      {
        heading: "Environment and prop workflow",
        paragraphs: [
          "Environments and product worlds are built modularly. Hero set pieces get full detail; repeatable kit pieces are optimized for reuse. We validate composition early with placeholder lighting so the frame reads before final materials land.",
          "Hero interactables versus background fill keeps performance and render time predictable while still delivering cinematic moments where the audience actually looks.",
        ],
      },
    ],
  },
  {
    slug: "motion-systems-for-brands",
    title: "Building motion systems brands can actually reuse",
    excerpt: "Modular motion libraries, logo stings, and UI micro interactions that keep campaigns consistent at scale.",
    category: "Motion",
    date: "Apr 8, 2026",
    readTime: "4 min read",
    image: portfolioMotion,
    author: "Starlights Visuals",
    sections: [
      {
        paragraphs: [
          "One off motion pieces look great in a case study and fall apart in week six of a campaign. Motion systems solve that by defining rules timing, easing, typography behavior, and transition grammar that internal teams and agencies can reuse without re briefing the studio every time.",
        ],
      },
      {
        heading: "Components that scale",
        paragraphs: [
          "We deliver logo stings, lower thirds, end cards, and UI micro interactions as linked After Effects or Lottie components with documented variants. Each component specifies minimum display time, safe zones, and color modes for light and dark contexts.",
          "Toolkit films show how pieces combine for launch, evergreen social, and product updates so marketing teams are not guessing how strict the system is.",
        ],
      },
    ],
  },
  {
    slug: "2d-animation-in-2026",
    title: "2D animation in 2026: hybrid pipelines that still feel handmade",
    excerpt: "Combining rigged efficiency with frame by frame accents when to push each technique for premium results.",
    category: "Animation",
    date: "Mar 29, 2026",
    readTime: "7 min read",
    image: portfolio2d,
    author: "Starlights Visuals",
    sections: [
      {
        paragraphs: [
          "Fully hand drawn work is beautiful and expensive. Pure rigged animation is fast and can feel generic. The sweet spot in 2026 is hybrid: rigs for body mechanics and camera moves, frame by frame accents for faces, smears, and hero moments that sell craft.",
        ],
      },
      {
        heading: "When to push each technique",
        paragraphs: [
          "Use rigs for dialogue loops, product demos with repeatable motion, and social cutdowns with tight turnarounds. Push frame by frame on emotional beats, impact frames, and any shot that is the thumbnail for the campaign.",
          "We document the split in animatics so clients know where premium budget lands before production starts no surprises when a hero shot needs extra love.",
        ],
      },
    ],
  },
  {
    slug: "creature-design-breakdown",
    title: "Creature design breakdown: from mood board to final rig",
    excerpt: "A look at how we develop boss creatures with readable silhouettes, material storytelling, and cinematic presence.",
    category: "Craft",
    date: "Mar 14, 2026",
    readTime: "6 min read",
    image: portfolioCreature,
    author: "Starlights Visuals",
    sections: [
      {
        paragraphs: [
          "Boss creatures need to read in marketing, film, and animation. We develop them in layers: cultural and ecological mood boards, silhouette explorations, material logic, and finally rig friendly anatomy that still feels dangerous on screen.",
        ],
      },
      {
        heading: "From exploration to rig",
        paragraphs: [
          "Early explorations stay loose ink, photobash, and quick 3D blockouts to test scale against human references. We kill designs that rely on fine detail to read; bosses must communicate threat from across a room.",
          "Once approved, we build a sculpt and rig with explicit joint limits for cinematic needs. Texture work tells a story: scar tissue, weathering, bioluminescence, and asymmetry that suggests history rather than mirror perfect fantasy.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
