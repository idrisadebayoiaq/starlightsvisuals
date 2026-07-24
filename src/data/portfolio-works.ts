import type { WorkCategory, WorkClient, WorkProject } from "@/types/portfolio-works";

import { applyPortfolioYoutube } from "@/lib/apply-portfolio-youtube";
import { PROJECT_PLACEHOLDER } from "@/data/portfolio-placeholder";

import portfolio2d from "@/assets/portfolio-2d.jpg";
import portfolioCharacter from "@/assets/portfolio-character.jpg";
import portfolioIndustrial from "@/assets/portfolio-industrial.jpg";
import portfolioMotion from "@/assets/portfolio-motion.jpg";
import portfolioProduct from "@/assets/portfolio-product.jpg";
import portfolioTrailer from "@/assets/portfolio-trailer.jpg";

export type WorkCategorySlug =
  | "2d-animation"
  | "3d-animation"
  | "motion-graphics"
  | "video-editing"
  | "vfx"
  | "branding";

function projects(
  items: Omit<WorkProject, "id">[],
  prefix: string,
): WorkProject[] {
  return items.map((item, i) => ({ ...item, id: `${prefix}-p${i + 1}` }));
}

function client(
  partial: Omit<WorkClient, "projects"> & { projects: Omit<WorkProject, "id">[] },
  projectPrefix: string,
): WorkClient {
  const projectList = projects(partial.projects, projectPrefix);
  return {
    ...partial,
    projectCount: projectList.length,
    projects: projectList,
  };
}

/** Portfolio categories — add clients here when YouTube samples are ready. */
const rawWorkCategories: WorkCategory[] = [
  {
    slug: "2d-animation",
    title: "2D Animation",
    tagline: "Frame by frame craft for campaigns and series",
    description:
      "Character driven 2D animation for commercials, explainers, and episodic content with bold motion and cinematic timing.",
    coverImage: portfolio2d,
    clients: [
      client(
        {
          slug: "chibi-art",
          name: "CHIBI ART",
          industry: "Character & Animation",
          description:
            "Chibi style 2D character animation with expressive scenes and behind the scenes making process films.",
          projectCount: 3,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["2D Animation", "Chibi Art", "Character Animation"],
          timeline: "2025",
          tools: ["After Effects", "Clip Studio Paint", "Photoshop"],
          projects: [
            {
              title: "Chibi Art Scene 1",
              description:
                "Expressive chibi character scene with polished 2D animation and campaign ready motion.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Chibi", "Scene"],
              year: 2025,
            },
            {
              title: "Chibi Art Scene 2",
              description:
                "Second chibi character scene showcasing personality, timing, and colorful 2D performance.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Chibi", "Scene"],
              year: 2025,
            },
            {
              title: "Making Process Film",
              description:
                "Behind the scenes look at the chibi art creation and animation workflow from sketch to final motion.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Process", "Workflow"],
              year: 2025,
            },
          ],
        },
        "chibi-art",
      ),
      client(
        {
          slug: "vtuber-animation",
          name: "VTUBER ANIMATION",
          industry: "VTuber & Character",
          description:
            "VTuber character art and 2D animation with modeling process films, polished samples, and Live2D style performance.",
          projectCount: 7,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["VTuber Animation", "2D Character", "Live2D Style"],
          timeline: "2025",
          tools: ["Live2D", "After Effects", "Clip Studio Paint"],
          projects: [
            {
              title: "Vtuber Modeling Creation",
              description:
                "VTuber character modeling creation film covering art direction and build workflow.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["VTuber", "Modeling"],
              year: 2025,
            },
            {
              title: "Vtuber 2D Video Results",
              description:
                "Finished 2D VTuber animation results with expressive performance and polished motion.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["VTuber", "2D"],
              year: 2025,
            },
            {
              title: "Princess Vtuber Modeling",
              description:
                "Princess VTuber modeling sample showcasing character design and animated performance.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["VTuber", "Princess"],
              year: 2025,
            },
            {
              title: "Vtuber 2D Video",
              description:
                "Cinematic 2D VTuber animation with dynamic character motion and expressive acting.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["VTuber", "2D"],
              year: 2025,
            },
            {
              title: "Vtuber Sample 2",
              description:
                "Second VTuber animation sample with bold character acting and polished motion.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["VTuber", "Sample"],
              year: 2025,
            },
            {
              title: "Vtuber Sample 3",
              description:
                "Extended VTuber character showcase with cinematic pacing and expressive 2D animation.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["VTuber", "Sample"],
              year: 2025,
            },
            {
              title: "Vtuber Video Process",
              description:
                "Behind the scenes VTuber animation process from art through rigging and final motion.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Process", "Workflow"],
              year: 2025,
            },
          ],
        },
        "vtuber-animation",
      ),
      client(
        {
          slug: "live2d-animation",
          name: "LIVE2D ANIMATION",
          industry: "Live2D & Character",
          description:
            "Live2D character art, rigging, and animation from making process films through polished sample performances.",
          projectCount: 6,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["Live2D", "Rigging", "2D Character Animation"],
          timeline: "2025",
          tools: ["Live2D Cubism", "After Effects", "Photoshop"],
          projects: [
            {
              title: "Live2D Making Process",
              description:
                "Behind the scenes Live2D creation workflow from art through final animated performance.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Live2D", "Process"],
              year: 2025,
            },
            {
              title: "Live2D Sample",
              description:
                "Finished Live2D character sample with expressive posing and polished motion.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Live2D", "Sample"],
              year: 2025,
            },
            {
              title: "Live2D Rigging Process",
              description:
                "Live2D rigging process film showing mesh, deformers, and parameter setup.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Live2D", "Rigging"],
              year: 2025,
            },
            {
              title: "Sample Live2D Rigging",
              description:
                "Sample Live2D rigging demonstration with clean parameter control and facial acting.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Live2D", "Rigging"],
              year: 2025,
            },
            {
              title: "Live2D Rigging Result",
              description:
                "Final Live2D rigging result showcasing smooth motion and expressive character performance.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Live2D", "Result"],
              year: 2025,
            },
            {
              title: "Live2D Film",
              description:
                "Cinematic Live2D animation with dynamic character motion and polished presentation.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Live2D", "Film"],
              year: 2025,
            },
          ],
        },
        "live2d-animation",
      ),
      client(
        {
          slug: "2d-anime-animation",
          name: "2D ANIME ANIMATION",
          industry: "Anime & 2D Animation",
          description:
            "High quality 2D anime style animation and music videos with expressive characters and cinematic motion.",
          projectCount: 3,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["2D Anime", "Music Video", "Character Animation"],
          timeline: "2025",
          tools: ["After Effects", "Toon Boom", "Clip Studio Paint"],
          projects: [
            {
              title: "Japanese Style 2D Anime",
              description:
                "Japanese anime style 2D animation with dynamic posing, expressive acting, and polished line work.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Anime", "2D"],
              year: 2025,
            },
            {
              title: "Anime Music Video",
              description:
                "2D anime music video with character driven storytelling and cinematic timing.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Music Video", "Anime"],
              year: 2025,
            },
            {
              title: "Meme Song Animation",
              description:
                "Playful 2D anime character animation timed to a meme song with bold motion and humor.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Anime", "Music"],
              year: 2025,
            },
          ],
        },
        "2d-anime-animation",
      ),
    ],
  },
  {
    slug: "3d-animation",
    title: "3D Animation",
    tagline: "Stylized and photoreal 3D for film and brands",
    description:
      "High quality 3D character, product, and cinematic animation with feature level polish for campaigns and series.",
    coverImage: portfolioCharacter,
    clients: [
      client(
        {
          slug: "kids-learning-animation",
          name: "KIDS LEARNING ANIMATION",
          industry: "Children & Education",
          description:
            "Fun character animation for kids learning content, including number videos and cute cartoon characters.",
          projectCount: 3,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["Kids Learning", "Character Animation", "Educational Content"],
          timeline: "2025",
          tools: ["After Effects", "Toon Boom", "Blender"],
          projects: [
            {
              title: "123 Number Kids Learning Video",
              description:
                "Educational number learning video with engaging characters and playful motion for kids.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Kids", "Learning"],
              year: 2025,
            },
            {
              title: "Custom 2D Character",
              description:
                "Custom 2D character animation with expressive acting and colorful stylized design.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Character", "2D"],
              year: 2025,
            },
            {
              title: "Cute 2D Cartoon Character",
              description:
                "Cute 2D cartoon character film with friendly personality and polished kids content motion.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Cartoon", "Kids"],
              year: 2025,
            },
          ],
        },
        "kids-learning-animation",
      ),
      client(
        {
          slug: "3d-cartoon-animation",
          name: "3D CARTOON ANIMATION",
          industry: "Character & Animation",
          description:
            "Stylized 3D cartoon character animation and showcase films with playful motion and polished presentation.",
          projectCount: 2,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["3D Cartoon Animation", "Character Showcase", "Stylized CGI"],
          timeline: "2025",
          tools: ["Blender", "Cinema 4D", "After Effects"],
          projects: [
            {
              title: "3D Cartoon Animation",
              description:
                "Stylized 3D cartoon animation with expressive character performance and colorful presentation.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Cartoon", "3D"],
              year: 2025,
            },
            {
              title: "Cute 3D Cartoon Character Showcase",
              description:
                "Cute 3D cartoon character video showcase with friendly personality and polished motion.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Character", "Showcase"],
              year: 2025,
            },
          ],
        },
        "3d-cartoon-animation",
      ),
      client(
        {
          slug: "3d-explainer-video",
          name: "3D EXPLAINER VIDEO",
          industry: "Product & Explainer",
          description:
            "3D explainer and product presentation films covering brand storytelling, 360 product displays, and commercial animation.",
          projectCount: 5,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["3D Explainer", "Product Presentation", "360 Product Display"],
          timeline: "2025",
          tools: ["Cinema 4D", "Blender", "After Effects"],
          projects: [
            {
              title: "Winergy 3D Presentation",
              description:
                "Winergy 3D brand presentation with cinematic camera work and polished product storytelling.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Explainer", "Winergy"],
              year: 2025,
            },
            {
              title: "Popper Product 360 Display",
              description:
                "Popper product 360 display film showcasing form, materials, and packaging detail.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["360", "Popper"],
              year: 2025,
            },
            {
              title: "Popper Animation",
              description:
                "Popper 3D product animation with dynamic motion and commercial presentation.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Product", "Popper"],
              year: 2025,
            },
            {
              title: "Popper Animation 2",
              description:
                "Alternate Popper animation pass with refined lighting and campaign ready pacing.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Product", "Popper"],
              year: 2025,
            },
            {
              title: "Client Video of Poppes",
              description:
                "Client facing Poppes video presenting the product with clear storytelling and polished CGI.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Client", "Poppes"],
              year: 2025,
            },
          ],
        },
        "3d-explainer-video",
      ),
      client(
        {
          slug: "3d-medical-animation",
          name: "3D MEDICAL ANIMATION",
          industry: "Healthcare & Medical Visualization",
          description:
            "High quality 3D medical animation covering anatomy, surgical procedures, and medical device visualization.",
          projectCount: 2,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["Medical Animation", "Anatomy CGI", "Surgical Visualization"],
          timeline: "2025",
          tools: ["Cinema 4D", "Blender", "After Effects"],
          projects: [
            {
              title: "High Quality 3D Medical Anatomy Animation",
              description:
                "High quality 3D medical animation with detailed anatomy visualization and polished cinematic presentation.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Medical", "Anatomy"],
              year: 2025,
            },
            {
              title: "3D Medical Animation 2",
              description:
                "Second 3D medical animation sample with clear anatomical storytelling and commercial finish.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Medical", "Healthcare"],
              year: 2025,
            },
          ],
        },
        "3d-medical-animation",
      ),
      client(
        {
          slug: "3d-anime-character",
          name: "3D ANIME CHARACTER",
          industry: "Character & Anime",
          description:
            "3D anime character modeling and client showcase films with stylized materials and polished presentation.",
          projectCount: 1,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["3D Character", "Anime CGI", "Client Showcase"],
          timeline: "2025",
          tools: ["Blender", "Cinema 4D", "After Effects"],
          projects: [
            {
              title: "3D Anime Character Showcase to Client",
              description:
                "3D anime character showcase film presenting modeling, materials, and polished stylized performance for client review.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Anime", "Character"],
              year: 2025,
            },
          ],
        },
        "3d-anime-character",
      ),
    ],
  },
  {
    slug: "motion-graphics",
    title: "Game Environment",
    tagline: "Immersive worlds and playable spaces in motion",
    description:
      "Design led motion systems for launches, dashboards, and brand worlds that scale across channels.",
    coverImage: portfolioMotion,
    clients: [],
  },
  {
    slug: "video-editing",
    title: "Product Animation",
    tagline: "Photoreal product films and cinematic packshots",
    description:
      "Editorial finishing, rhythm, and story structure for commercials, documentaries, and brand films.",
    coverImage: portfolioProduct,
    clients: [
      client(
        {
          slug: "watch-animation",
          name: "WATCH ANIMATION",
          industry: "Luxury Watches",
          description:
            "Photoreal 3D watch product animation and cinematic packshot films for luxury timepieces.",
          projectCount: 3,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["3D Product Animation", "Watch CGI", "Packshot Films"],
          timeline: "2025",
          tools: ["Cinema 4D", "Redshift", "After Effects"],
          projects: [
            {
              title: "Watch Product Film",
              description:
                "Cinematic 3D watch animation with studio lighting, material detail, and premium packshot finish.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Watch", "Product"],
              year: 2025,
            },
            {
              title: "Rifari Wrist Watch",
              description:
                "Photoreal Rifari wrist watch product film with refined reflections and commercial presentation.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Watch", "Rifari"],
              year: 2025,
            },
            {
              title: "Steel Reef Wrist Watch",
              description:
                "Steel Reef wrist watch animation with premium materials, lighting, and campaign ready motion.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Watch", "Steel Reef"],
              year: 2025,
            },
          ],
        },
        "watch-animation",
      ),
      client(
        {
          slug: "ryse-drink-3d-product-animation",
          name: "RYSE DRINK 3D PRODUCT ANIMATION",
          industry: "Beverage & Product CGI",
          description:
            "Photoreal 3D beverage product animation for Ryse drink and lemonade campaigns with cinematic packshot finish.",
          projectCount: 2,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["3D Product Animation", "Beverage CGI", "Packshot Films"],
          timeline: "2025",
          tools: ["Cinema 4D", "Redshift", "After Effects"],
          projects: [
            {
              title: "Ryse Drink 3D Product Animation",
              description:
                "Cinematic 3D Ryse drink product animation with studio lighting, material detail, and commercial finish.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Beverage", "Product"],
              year: 2025,
            },
            {
              title: "Lemonade Product Film",
              description:
                "Photoreal lemonade product animation with fluid motion, glass materials, and campaign ready presentation.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Lemonade", "Product"],
              year: 2025,
            },
          ],
        },
        "ryse-drink-3d-product-animation",
      ),
      client(
        {
          slug: "3d-perfume-animation",
          name: "3D PERFUME ANIMATION",
          industry: "Beauty & Fragrance",
          description:
            "Photoreal 3D perfume product animation for luxury fragrance launches and campaign hero films.",
          projectCount: 3,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["3D Product Animation", "Fragrance CGI", "Packshot Films"],
          timeline: "2025",
          tools: ["Cinema 4D", "Redshift", "After Effects"],
          projects: [
            {
              title: "Anabomfim 3D Perfume Video",
              description:
                "Cinematic 3D Anabomfim perfume animation with studio lighting, glass materials, and premium packshot finish.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Perfume", "Anabomfim"],
              year: 2025,
            },
            {
              title: "Valentino Perfume Video",
              description:
                "Luxury Valentino perfume product film with refined reflections, fluid motion, and commercial presentation.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Perfume", "Valentino"],
              year: 2025,
            },
            {
              title: "Soul of Amir 3D Animation",
              description:
                "Soul of Amir 3D fragrance animation with cinematic camera work and campaign ready polish.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Perfume", "Soul of Amir"],
              year: 2025,
            },
          ],
        },
        "3d-perfume-animation",
      ),
      client(
        {
          slug: "3d-gadget-animation",
          name: "3D GADGET ANIMATION",
          industry: "Consumer Electronics",
          description:
            "Photoreal 3D gadget and earbud product animation with studio lighting, material detail, and campaign ready motion.",
          projectCount: 2,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["3D Product Animation", "Gadget CGI", "Packshot Films"],
          timeline: "2025",
          tools: ["Cinema 4D", "Redshift", "After Effects"],
          projects: [
            {
              title: "Shoks Earbud Animation",
              description:
                "Cinematic 3D Shoks earbud product animation with refined materials and commercial finish.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Earbud", "Gadget"],
              year: 2025,
            },
            {
              title: "Headphone Earbud Product Film",
              description:
                "3D headphone and earbud product animation with dynamic camera moves and premium packshot presentation.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Headphone", "Product"],
              year: 2025,
            },
          ],
        },
        "3d-gadget-animation",
      ),
      client(
        {
          slug: "vape-animation",
          name: "VAPE ANIMATION",
          industry: "Consumer Products",
          description:
            "Photoreal 3D vape product animation with studio lighting, material detail, and campaign ready packshot films.",
          projectCount: 2,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["3D Product Animation", "Vape CGI", "Packshot Films"],
          timeline: "2025",
          tools: ["Cinema 4D", "Redshift", "After Effects"],
          projects: [
            {
              title: "Jojo Vape",
              description:
                "Cinematic 3D Jojo vape product animation with refined materials and commercial finish.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Vape", "Jojo"],
              year: 2025,
            },
            {
              title: "Juicy Cranberry Vape",
              description:
                "Juicy cranberry vape product film with vibrant color, lighting, and campaign ready presentation.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Vape", "Cranberry"],
              year: 2025,
            },
          ],
        },
        "vape-animation",
      ),
      client(
        {
          slug: "bag-suitcase-animation",
          name: "BAG/SUITCASE ANIMATION",
          industry: "Travel & Lifestyle",
          description:
            "Realistic 3D product animation for bags and suitcases with cinematic packshot finish.",
          projectCount: 1,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["3D Product Animation", "Bag CGI", "Packshot Films"],
          timeline: "2025",
          tools: ["Cinema 4D", "Redshift", "After Effects"],
          projects: [
            {
              title: "Realistic 3D Product Animation for Bags",
              description:
                "Photoreal 3D bag and suitcase product animation with premium materials and commercial presentation.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Bag", "Suitcase"],
              year: 2025,
            },
          ],
        },
        "bag-suitcase-animation",
      ),
      client(
        {
          slug: "drop-band-animation",
          name: "DROP BAND ANIMATION",
          industry: "Wearables & Accessories",
          description:
            "Drop Band product animation covering production process films and final polished results.",
          projectCount: 2,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["3D Product Animation", "Process Film", "Wearable CGI"],
          timeline: "2025",
          tools: ["Cinema 4D", "Redshift", "After Effects"],
          projects: [
            {
              title: "Drop Band Animation Process",
              description:
                "Behind the scenes Drop Band animation process from reference through final motion.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Process", "Drop Band"],
              year: 2025,
            },
            {
              title: "Drop Band Animation Result",
              description:
                "Final Drop Band product animation with refined materials, lighting, and campaign ready finish.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Product", "Drop Band"],
              year: 2025,
            },
          ],
        },
        "drop-band-animation",
      ),
      client(
        {
          slug: "3d-bed-animation",
          name: "3D BED ANIMATION",
          industry: "Furniture & Bedding",
          description:
            "Photoreal 3D mattress and bed product animation for furniture brands with cinematic packshot finish.",
          projectCount: 2,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["3D Product Animation", "Furniture CGI", "Packshot Films"],
          timeline: "2025",
          tools: ["Cinema 4D", "Redshift", "After Effects"],
          projects: [
            {
              title: "Realistic 3D Mattress Animation",
              description:
                "Realistic 3D mattress product animation with soft materials, lighting, and campaign ready presentation.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Mattress", "Product"],
              year: 2025,
            },
            {
              title: "Simba Bed Animation",
              description:
                "Simba bed animation with cinematic camera work, material detail, and commercial finish.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Bed", "Simba"],
              year: 2025,
            },
          ],
        },
        "3d-bed-animation",
      ),
    ],
  },
  {
    slug: "vfx",
    title: "VFX",
    tagline: "Compositing, FX, and cinematic finishing",
    description:
      "Visual effects for trailers, product films, and branded content, from cleanups to full CG integration.",
    coverImage: portfolioTrailer,
    clients: [],
  },
  {
    slug: "branding",
    title: "Industrial Animation",
    tagline: "Technical storytelling for products and manufacturing",
    description:
      "Brand films, identity motion, and launch assets that define how audiences remember your name.",
    coverImage: portfolioIndustrial,
    clients: [
      client(
        {
          slug: "ronix",
          name: "RONIX",
          industry: "Power Tools & Manufacturing",
          description:
            "Ronix 3D industrial animation and power tool CGI product showcase films.",
          projectCount: 1,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["Industrial Animation", "Power Tool CGI", "Product Showcase"],
          timeline: "2025",
          tools: ["Cinema 4D", "Blender", "After Effects"],
          projects: [
            {
              title: "Ronix 3D Industrial Animation | Power Tool CGI Product Showcase",
              description:
                "Cinematic Ronix power tool CGI showcase with technical detail and commercial polish.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Industrial", "Ronix"],
              year: 2025,
            },
          ],
        },
        "ronix",
      ),
      client(
        {
          slug: "mintec",
          name: "MINTEC",
          industry: "Industrial Manufacturing",
          description:
            "MinTec industries product showcase and process films for 3D industrial animation.",
          projectCount: 2,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["Industrial Animation", "Product Showcase", "Process Film"],
          timeline: "2025",
          tools: ["Cinema 4D", "Blender", "After Effects"],
          projects: [
            {
              title: "MinTec Industries Product Showcase",
              description:
                "MinTec industries product showcase with technical storytelling and polished CGI.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Industrial", "MinTec"],
              year: 2025,
            },
            {
              title: "Process of Making MinTec 3D Animation",
              description:
                "Behind the scenes look at the MinTec 3D industrial animation production workflow.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Process", "MinTec"],
              year: 2025,
            },
          ],
        },
        "mintec",
      ),
      client(
        {
          slug: "integra-pw",
          name: "INTEGRA PW",
          industry: "Industrial Products",
          description:
            "Integra PW industrial animation from video making process through final cinematic results.",
          projectCount: 2,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["Industrial Animation", "Process Film", "Product CGI"],
          timeline: "2025",
          tools: ["Cinema 4D", "Blender", "After Effects"],
          projects: [
            {
              title: "Integra PW Video Making Process",
              description:
                "Behind the scenes making process for the Integra PW industrial animation build.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Process", "Integra PW"],
              year: 2025,
            },
            {
              title: "Integra PW Final Results",
              description:
                "Final Integra PW industrial product animation with dynamic camera moves and commercial finish.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Industrial", "Integra PW"],
              year: 2025,
            },
          ],
        },
        "integra-pw",
      ),
      client(
        {
          slug: "credex",
          name: "CREDEX",
          industry: "Cleaning Equipment",
          description:
            "CREDEX carpet cleaning machine industrial animation with cinematic SFX finish.",
          projectCount: 1,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["Industrial Animation", "Product CGI", "Sound Design"],
          timeline: "2025",
          tools: ["Cinema 4D", "Blender", "After Effects"],
          projects: [
            {
              title: "Credex Vacuum Cleaner with SFX",
              description:
                "Final high definition CREDEX vacuum cleaner animation with sound design and commercial polish.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Industrial", "Credex"],
              year: 2025,
            },
          ],
        },
        "credex",
      ),
      client(
        {
          slug: "phr-1",
          name: "PHR 1",
          industry: "Electric Powertrain",
          description:
            "PHR 1 electric power train product animation with technical lighting and cinematic polish.",
          projectCount: 1,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["Industrial Animation", "Powertrain CGI", "Product Film"],
          timeline: "2025",
          tools: ["Cinema 4D", "Blender", "After Effects"],
          projects: [
            {
              title: "PHR 1 Electric Power Train",
              description:
                "Photoreal PHR 1 electric power train animation with cinematic camera work and technical detail.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Industrial", "PHR 1"],
              year: 2025,
            },
          ],
        },
        "phr-1",
      ),
      client(
        {
          slug: "atx",
          name: "ATX",
          industry: "Industrial Manufacturing",
          description:
            "ATX 3D industrial and technical product animation for manufacturing showcases.",
          projectCount: 1,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["Industrial Animation", "Technical CGI", "Product Showcase"],
          timeline: "2025",
          tools: ["Cinema 4D", "Blender", "After Effects"],
          projects: [
            {
              title: "ATX 3D Industrial Animation",
              description:
                "ATX 3D industrial product animation with technical lighting and campaign ready finish.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Industrial", "ATX"],
              year: 2025,
            },
          ],
        },
        "atx",
      ),
      client(
        {
          slug: "prov-gap",
          name: "PROV GAP",
          industry: "Industrial Manufacturing",
          description:
            "Prov GAP 3D industrial animation for technical product storytelling and brand films.",
          projectCount: 1,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["Industrial Animation", "Product CGI", "Technical Film"],
          timeline: "2025",
          tools: ["Cinema 4D", "Blender", "After Effects"],
          projects: [
            {
              title: "Prov GAP 3D Industrial Animation",
              description:
                "Prov GAP industrial product animation with mechanical detail and cinematic presentation.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Industrial", "Prov GAP"],
              year: 2025,
            },
          ],
        },
        "prov-gap",
      ),
      client(
        {
          slug: "autoz-crave",
          name: "AUTOZ CRAVE",
          industry: "Automotive & Mechanical",
          description:
            "Autoz Crave industrial animation for mechanical and technical 3D product films.",
          projectCount: 1,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["Industrial Animation", "Mechanical CGI", "Technical Animation"],
          timeline: "2025",
          tools: ["Cinema 4D", "Blender", "After Effects"],
          projects: [
            {
              title: "Autoz Crave Industrial Animation",
              description:
                "Autoz Crave 3D industrial product video with mechanical technical animation and commercial polish.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "",
              tags: ["Industrial", "Autoz Crave"],
              year: 2025,
            },
          ],
        },
        "autoz-crave",
      ),
    ],
  },
];

export const workCategories = applyPortfolioYoutube(rawWorkCategories);

const showcaseLabels: Record<
  WorkCategorySlug,
  { tag: string; title: string }
> = {
  "2d-animation": { tag: "2D Animation", title: "2D Animation" },
  "3d-animation": { tag: "3D Animation", title: "3D Animation" },
  "motion-graphics": { tag: "Game Environment", title: "Game Environment" },
  "video-editing": { tag: "3D", title: "Product Animation" },
  vfx: { tag: "VFX", title: "VFX" },
  branding: { tag: "3D", title: "Industrial Animation" },
};

export const showcaseCategories = workCategories.map((c) => ({
  slug: c.slug,
  tag: showcaseLabels[c.slug as WorkCategorySlug].tag,
  title: showcaseLabels[c.slug as WorkCategorySlug].title,
  coverImage: c.coverImage,
}));
