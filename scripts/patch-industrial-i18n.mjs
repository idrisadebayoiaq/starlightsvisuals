/**
 * One-shot patch: deep-merge industrial pivot strings into en/de common.json
 * Run: node scripts/patch-industrial-i18n.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== "object") target[key] = {};
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

const industryItem = (en) => en;

const enPatch = {
  nav: {
    portfolio: "Work",
    services: "Services",
    blog: "Blog",
    company: "About",
    contacts: "Contact",
    about: "About",
    contact: "Contact",
    faq: "FAQ",
    writeReview: "Write a review",
    portfolioCta: "Work →",
    industries: "Industries",
    caseStudies: "Case Studies",
    work: "Work",
  },
  footer: {
    newsletterDesc: "Project insights, industrial CGI examples, and studio updates.",
    tagline:
      "CGI and animation for machine builders, robotics, and medical device manufacturers — turning CAD and complex mechanisms into product films that sell.",
    entertainmentLink: "Brand & Entertainment",
  },
  home: {
    metaTitle: "Starlights Visuals | CGI & Animation for Industrial Manufacturers",
    metaDescription:
      "CGI and animation for machine builders, robotics, and medical device manufacturers. CAD-to-CGI product films, exploded views, and technical explainers that sell.",
    heroScript: "Technical visuals that sell,",
    heroTitle1: "CGI FOR",
    heroTitle2: "INDUSTRY",
    heroBody:
      "CGI and animation for machine builders, robotics, and medical device manufacturers. We turn CAD data and complex mechanisms into product films, exploded-view animations, and technical explainers that sell — for websites, sales teams, and trade shows.",
    seePortfolio: "See Work",
    startProject: "Book a Call",
    servicesLabel: "Industrial deliverables",
    servicesTitle: "SERVICES",
    allServices: "All Services",
    showcaseLabel: "Selected work",
    showcaseTitle1: "INDUSTRIAL",
    showcaseTitle2: "WORK",
    fullPortfolio: "Browse Work",
    ctaScript: "Ready for the next trade show,",
    ctaTitle1: "LET'S BUILD",
    ctaTitle2: "YOUR FILM",
    services: {
      "01": {
        title: "Technical Product Animation",
        desc: "Show how the machine works — internally and externally — with accuracy engineers trust.",
      },
      "02": {
        title: "Exploded-View & Assembly",
        desc: "Animations for manuals, spare parts, and service training that make complexity clear.",
      },
      "03": {
        title: "Trade Show Films & CGI Renders",
        desc: "Replace expensive on-site filming of large machinery with photoreal CGI ready for the booth.",
      },
      "04": {
        title: "CAD-to-CGI Conversion",
        desc: "We ingest SolidWorks, CATIA, STEP, and IGES exports and turn them into marketing-ready motion.",
      },
      "05": {
        title: "Robotics & Motion Simulation",
        desc: "Visualize automated workflows, cobots, and pick-and-place sequences for sales enablement.",
      },
      "06": {
        title: "Sales & Marketing Explainers",
        desc: "Website, LinkedIn, and Hannover Messe–ready explainers that help your team close.",
      },
    },
  },
  trust: {
    label: "Built for industrial buyers",
    title: "TRUST & PROCESS",
    subtitle: "What manufacturers look for before they brief a CGI partner.",
    items: {
      cad: {
        title: "CAD compatibility",
        desc: "SolidWorks, CATIA, STEP, and IGES import — we work from your engineering data, not guesswork.",
      },
      nda: {
        title: "NDA & confidentiality",
        desc: "Clear NDA process for proprietary machinery, unreleased products, and sensitive assemblies.",
      },
      review: {
        title: "Engineer review step",
        desc: "Technical accuracy reviews with your engineers before final delivery — no marketing fiction.",
      },
      turnaround: {
        title: "Trade-show deadlines",
        desc: "Scoped timelines that hit booth, launch, and LinkedIn go-live dates with milestone checkpoints.",
      },
    },
  },
  servicesPage: {
    metaTitle: "Industrial CGI Services | Starlights Visuals",
    metaDescription:
      "Technical product animation, exploded views, trade show films, robotics visuals, sales explainers, and CAD-to-CGI conversion.",
    label: "Industrial CGI",
    title: "SERVICES",
    subtitle:
      "Outcome-focused deliverables for machine builders, robotics teams, and medical device manufacturers.",
    ctaTitle1: "NEED A",
    ctaTitle2: "TRADE-SHOW",
    ctaTitle3: "FILM?",
    ctaDesc: "Tell us about the machine, the deadline, and the CAD you can share.",
    ctaButton: "Book a Call",
    entertainmentCta: "Looking for character, VFX, or brand entertainment work?",
    entertainmentLink: "Brand & Entertainment services",
    items: {
      technical: {
        title: "Technical Product Animation",
        desc: "How the machine works — cutaways, internal mechanisms, and external motion with engineering accuracy.",
      },
      exploded: {
        title: "Exploded-View / Assembly Animation",
        desc: "For manuals, spare parts catalogs, and service training without a live machine on site.",
      },
      tradeShow: {
        title: "CGI Product Renders & Trade Show Films",
        desc: "Booth-ready films and hero renders that replace costly on-site shoots of large equipment.",
      },
      robotics: {
        title: "Robotics & Motion Simulation Visuals",
        desc: "Automated cells, cobots, and pick-and-place sequences for sales and marketing.",
      },
      explainer: {
        title: "Sales & Marketing Explainer Videos",
        desc: "Website, LinkedIn, and trade-show explainers that help product and sales teams communicate clearly.",
      },
      cad: {
        title: "CAD-to-CGI Conversion",
        desc: "Ingest STEP, IGES, SolidWorks, and CATIA exports and convert them into photoreal CGI motion.",
      },
    },
  },
  entertainmentServicesPage: {
    metaTitle: "Brand & Entertainment | Starlights Visuals",
    metaDescription:
      "2D and 3D character animation, cinematic trailers, motion graphics, and VFX for brands and entertainment.",
    label: "Secondary line of business",
    title: "BRAND & ENTERTAINMENT",
    subtitle:
      "We still produce character-driven animation, trailers, and VFX — this is our entertainment offering alongside industrial CGI.",
    backToIndustrial: "Back to industrial services",
    ctaButton: "Start a Project",
    items: {
      "2d": {
        title: "2D Animation",
        desc: "Frame-by-frame and rigged 2D for series, shorts, explainers, and brand films.",
      },
      "3d": {
        title: "3D Character & Worlds",
        desc: "Stylized and photoreal characters, environments, and cinematic sequences.",
      },
      character: {
        title: "Character Design",
        desc: "Original characters, creatures, and concept art that anchor your IP.",
      },
      motion: {
        title: "Motion Graphics",
        desc: "Branded motion, UI animation, and broadcast packages with cinematic polish.",
      },
      vfx: {
        title: "Visual Effects (VFX)",
        desc: "Compositing, particle FX, and CG integration for film and campaigns.",
      },
      trailer: {
        title: "Cinematic Trailers",
        desc: "Story-driven trailers to launch brands, IPs, and campaigns.",
      },
    },
  },
  contactPage: {
    metaTitle: "Contact | Starlights Visuals",
    metaDescription:
      "Book a call for industrial CGI, technical product animation, CAD-to-CGI, and trade-show films.",
    subtitle: "Production inquiries for industrial CGI, CAD-to-film projects, or brand work.",
    formTitle: "BOOK A CALL",
    formDesc: "Share your machine, timeline, and CAD status — we reply within 24 hours.",
    projectTypes: {
      technical: "Technical Product Animation",
      exploded: "Exploded-View / Assembly",
      tradeShow: "Trade Show Film / CGI Renders",
      robotics: "Robotics & Motion Simulation",
      explainer: "Sales & Marketing Explainer",
      cad: "CAD-to-CGI Conversion",
      entertainment: "Brand & Entertainment",
      other: "Other",
    },
  },
  portfolioPage: {
    metaTitle: "Work | Starlights Visuals",
    metaDescription:
      "Industrial CGI and animation work — filter by machinery, robotics, medical, automotive, and more.",
    label: "Selected work",
    title1: "WORK",
    title2: "",
    subtitle: "Browse by industry — the way industrial buyers evaluate partners.",
    filterAll: "All industries",
    filterIndustry: "Filter by industry",
    byTechnique: "Browse by technique",
    emptyIndustry: "No projects tagged for this industry yet. Explore related case studies or get in touch.",
  },
  industriesPage: {
    metaTitle: "Industries | Starlights Visuals",
    metaDescription:
      "CGI and animation for industrial machinery, robotics, medical devices, automotive components, and more.",
    label: "Who we serve",
    title: "INDUSTRIES",
    subtitle:
      "Dedicated pages for the manufacturers and product teams we help sell complex technology visually.",
    viewWork: "View related work",
    bookCall: "Book a call",
    painPoints: "Common challenges",
    deliverables: "Typical deliverables",
    relatedWork: "Related work",
    relatedCases: "Case studies",
    relatedIndustries: "Related industries",
  },
  caseStudiesPage: {
    metaTitle: "Case Studies | Starlights Visuals",
    metaDescription:
      "Industrial CGI case studies — SmarAct, Novatorq, Mintec, and INTEGRA-pw.",
    label: "Proof of work",
    title: "CASE STUDIES",
    subtitle: "Problem, process, technical constraints, and outcomes — not just a testimonial carousel.",
    readCase: "Read case study",
    problem: "Problem",
    process: "Process",
    constraints: "CAD & technical constraints",
    result: "Result",
    watchFilm: "Watch the film",
    backToIndex: "All case studies",
    cta: "Start a similar project",
  },
  accordionPage: {
    metaTitle: "FAQ | Starlights Visuals",
    metaDescription:
      "FAQ on industrial CGI, CAD handoff, NDAs, engineer review, and trade-show timelines.",
    subtitle:
      "How we work with manufacturers — from CAD handoff and NDAs to engineer review and booth deadlines.",
    sections: {
      general: {
        title: "General",
        items: {
          "01": {
            question: "What types of projects do you work on?",
            answer:
              "Primarily industrial CGI: technical product animation, exploded views, trade-show films, robotics visuals, and sales explainers. We also offer brand and entertainment animation as a secondary line of business.",
          },
          "02": {
            question: "Where is Starlights Visuals based?",
            answer:
              "We're a remote-first studio collaborating with manufacturers across Germany, Europe, and globally — including trade-show timelines like Hannover Messe.",
          },
          "03": {
            question: "How do I start a project?",
            answer:
              "Use the contact form with your product, deadline, and whether CAD (STEP/SolidWorks/CATIA) can be shared under NDA. We'll scope milestones and deliverables on a discovery call.",
          },
        },
      },
      services: {
        title: "Services & scope",
        items: {
          "01": {
            question: "What services do you offer for industrial clients?",
            answer:
              "Technical product animation, exploded-view/assembly films, CGI renders and trade-show films, robotics simulation visuals, sales explainers, and CAD-to-CGI conversion.",
          },
          "02": {
            question: "Can you work under NDA with proprietary machinery?",
            answer:
              "Yes. We use a clear confidentiality process before receiving CAD or unreleased product data.",
          },
          "03": {
            question: "Do you still do entertainment / character work?",
            answer:
              "Yes — see Brand & Entertainment services. Industrial buyers see industrial messaging first; entertainment is a separate offering.",
          },
        },
      },
      production: {
        title: "Process & delivery",
        items: {
          "01": {
            question: "What are typical timelines for a trade-show film?",
            answer:
              "Depends on scope — a focused product film may take a few weeks; fuller packages need longer. We lock milestones against your booth or launch date.",
          },
          "02": {
            question: "How do technical accuracy reviews work?",
            answer:
              "We schedule review passes with your engineers so mechanisms, proportions, and sequences match the real product before final delivery.",
          },
          "03": {
            question: "Which CAD formats do you accept?",
            answer:
              "STEP and IGES neutrals, plus SolidWorks and CATIA exports commonly used by machine builders and device manufacturers.",
          },
        },
      },
    },
  },
};

// Industry page copy (EN)
const industryCopy = {
  "industrial-machinery": {
    navLabel: "Industrial Machinery & Machine Building",
    headline: "CGI Animation for Machine Builders",
    intro:
      "Turn complex machines into clear product films that help sales, marketing, and distributors explain value without a live demo floor.",
    pains: [
      "Machines are too large or confidential to film on site for every campaign.",
      "Buyers struggle to understand internal mechanisms from static CAD screenshots.",
      "Trade-show booths need motion assets that stay accurate under engineer scrutiny.",
      "Service and spare-parts teams need exploded views that match the real assembly.",
    ],
  },
  "robotics-automation": {
    navLabel: "Robotics & Automation",
    headline: "CGI Animation for Robotics & Automation",
    intro:
      "Show automated cells, precision positioning, and cobot workflows in motion — so prospects grasp throughput and safety without a factory tour.",
    pains: [
      "Live cells are hard to film cleanly amid production schedules and IP concerns.",
      "Cycle times and multi-axis motion are difficult to explain in stills or slides.",
      "Sales teams need visuals that work for LinkedIn, RFQs, and booth loops.",
      "Integrators must communicate cell layouts before hardware is installed.",
    ],
  },
  "medical-devices": {
    navLabel: "Medical Device Manufacturers",
    headline: "CGI Animation for Medical Device Manufacturers",
    intro:
      "Visualize internal mechanisms and clinical workflows without violating IP or regulatory constraints — accurate enough for engineers, clear enough for buyers.",
    pains: [
      "You need to show internals without exposing proprietary designs inappropriately.",
      "Regulatory and marketing teams need aligned, reviewable visuals.",
      "Physical prototypes are limited, expensive, or not camera-ready.",
      "Clinicians and procurement need clarity faster than a dense IFU.",
    ],
  },
  "automotive-components": {
    navLabel: "Automotive Components",
    headline: "CGI Animation for Automotive Component Manufacturers",
    intro:
      "Explain powertrains, EV subsystems, and mechanical assemblies with technical CGI that partners and OEMs trust.",
    pains: [
      "EV and mechanical systems are hard to show without cutaways and motion.",
      "OEM and partner presentations need accuracy plus polish.",
      "Prototypes may not be available for every sales meeting.",
      "Marketing needs assets that engineering will approve.",
    ],
  },
  "packaging-machines": {
    navLabel: "Packaging Machines",
    headline: "CGI Animation for Packaging Machine Manufacturers",
    intro:
      "Demonstrate format changes, throughput, and changeover sequences when the line cannot come to the booth.",
    pains: [
      "Lines are too large or busy to film for every market.",
      "Changeovers and format flexibility need clear motion storytelling.",
      "Distributors need shareable films for customer pitches.",
    ],
  },
  "cnc-machines": {
    navLabel: "CNC Machines",
    headline: "CGI Animation for CNC Machine Manufacturers",
    intro:
      "Explain multi-axis tool paths and machining advantages without a live machine on site.",
    pains: [
      "Multi-axis motion is hard to convey in still photography.",
      "Prospects cannot always visit a showroom or open house.",
      "Trade shows need looping films that stay technically honest.",
    ],
  },
  "industrial-pumps": {
    navLabel: "Industrial Pumps",
    headline: "CGI Animation for Industrial Pump Manufacturers",
    intro:
      "Reveal flow paths, seals, and serviceability with cutaways and exploded assemblies.",
    pains: [
      "Internal flow and wear points are invisible in product photos.",
      "Service manuals need clearer assembly storytelling.",
      "Sales teams need short explainers for complex SKUs.",
    ],
  },
  "industrial-electronics": {
    navLabel: "Industrial Electronics",
    headline: "CGI Animation for Industrial Electronics",
    intro:
      "Product films and explainers for connectors, modules, and industrial electronics lines that need precision visuals.",
    pains: [
      "Small components need macro-level clarity in motion.",
      "Product family differences (e.g. series variants) must be easy to compare.",
      "Trade-show and web assets must stay consistent with engineering drawings.",
    ],
  },
};

enPatch.industries = {
  ...enPatch.industriesPage,
  items: industryCopy,
};

enPatch.caseStudies = {
  ...enPatch.caseStudiesPage,
  items: {
    smaract: {
      title: "SmarAct — Automation CGI that clarifies core competencies",
      summary:
        "A CGI film presenting precision automation capabilities clearly for marketing and sales.",
      problem:
        "SmarAct needed a professional CGI video to present core competencies in a clear, visually engaging way — without relying solely on complex live setups.",
      process:
        "We aligned on messaging, built accurate motion from technical references, iterated quickly with the marketing team, and delivered final files ready for digital channels.",
      constraints:
        "Precision mechanisms required careful visual fidelity and a fast, reliable turnaround with strong communication throughout.",
      result:
        "A clear, professional CGI film the team could use confidently for high-quality visual content — with fast response times and dependable delivery praised by the client.",
    },
    novatorq: {
      title: "Novatorq — EV technology visuals partners understand",
      summary:
        "Technical animation that communicates how electric vehicle technology works to partners and stakeholders.",
      problem:
        "Novatorq needed visuals that clearly communicate how their EV / PHR technology works to partners — not just a stylized brand film.",
      process:
        "We refined the concept with the founders, iterated on technical storytelling, and delivered an animation suitable for stakeholder presentations.",
      constraints:
        "Engineering accuracy and clarity for non-specialist stakeholders had to coexist in one film.",
      result:
        "A clearer way to present the product to partners and stakeholders, with a smooth collaborative process.",
    },
    mintec: {
      title: "Mintec — M12 vs B12 product clarity",
      summary:
        "Animations that make product-line differences obvious for buyers and sales teams.",
      problem:
        "Mintec needed a clear way to show the differences between M12 and B12 products.",
      process:
        "We focused on the details that matter to buyers, produced high-quality animations, and kept every important distinction readable on screen.",
      constraints:
        "Product-line comparison had to stay accurate and easy to understand at a glance.",
      result:
        "Animations that matched what the production team needed — clear, detailed, and ready for sales enablement.",
    },
    "integra-pw": {
      title: "INTEGRA-pw — Complex products made easy to explain",
      summary:
        "Animation that helps sales present a strong product with confidence.",
      problem:
        "The product was strong, but explaining it clearly to customers was the ongoing challenge.",
      process:
        "We took time to understand how everything works, then turned that into an animation that holds attention and communicates cleanly.",
      constraints:
        "Technical storytelling had to stay faithful while remaining accessible to customers.",
      result:
        "A professional film that helps the sales team present with more confidence — straightforward collaboration end to end.",
    },
  },
};

const dePatch = {
  nav: {
    portfolio: "Arbeiten",
    services: "Leistungen",
    blog: "Blog",
    company: "Über uns",
    contacts: "Kontakt",
    about: "Über uns",
    contact: "Kontakt",
    faq: "FAQ",
    writeReview: "Schreiben Sie eine Rezension",
    portfolioCta: "Arbeiten →",
    industries: "Branchen",
    caseStudies: "Fallstudien",
    work: "Arbeiten",
  },
  footer: {
    newsletterDesc: "Projekteinblicke, industrielle CGI Beispiele und Studio Updates.",
    tagline:
      "CGI und Animation für Maschinenbauer, Robotik und Medizintechnik — aus CAD und komplexen Mechanismen werden Produktfilme, die verkaufen.",
    entertainmentLink: "Brand & Entertainment",
  },
  home: {
    metaTitle: "Starlights Visuals | CGI & Animation für die Industrie",
    metaDescription:
      "CGI und Animation für Maschinenbauer, Robotik und Medizintechnik. CAD-zu-CGI Produktfilme, Explosionsdarstellungen und technische Erklärfilme.",
    heroScript: "Technische Visuals, die verkaufen,",
    heroTitle1: "CGI FÜR",
    heroTitle2: "DIE INDUSTRIE",
    heroBody:
      "CGI und Animation für Maschinenbauer, Robotik und Medizintechnik-Hersteller. Wir verwandeln CAD-Daten und komplexe Mechanismen in Produktfilme, Explosionsanimationen und technische Erklärfilme — für Websites, Vertriebsteams und Messen.",
    seePortfolio: "Arbeiten ansehen",
    startProject: "Gespräch buchen",
    servicesLabel: "Industrielle Leistungen",
    servicesTitle: "LEISTUNGEN",
    allServices: "Alle Leistungen",
    showcaseLabel: "Ausgewählte Arbeiten",
    showcaseTitle1: "INDUSTRIE",
    showcaseTitle2: "ARBEITEN",
    fullPortfolio: "Alle Arbeiten",
    ctaScript: "Bereit für die nächste Messe,",
    ctaTitle1: "LASS UNS",
    ctaTitle2: "IHR FILM BAUEN",
    services: {
      "01": {
        title: "Technische Produktanimation",
        desc: "Zeigen, wie die Maschine innen und außen funktioniert — mit Genauigkeit, der Ingenieure vertrauen.",
      },
      "02": {
        title: "Explosions- & Montageanimation",
        desc: "Für Handbücher, Ersatzteile und Service-Training, das Komplexität verständlich macht.",
      },
      "03": {
        title: "Messefilme & CGI Renders",
        desc: "Ersetzen Sie teure On-Site-Drehs großer Maschinen durch fotorealistisches CGI für den Stand.",
      },
      "04": {
        title: "CAD-zu-CGI Konvertierung",
        desc: "SolidWorks, CATIA, STEP und IGES — aus Engineering-Daten werden marketingtaugliche Filme.",
      },
      "05": {
        title: "Robotik & Bewegungssimulation",
        desc: "Automatisierte Abläufe, Cobots und Pick-and-Place für Sales Enablement visualisieren.",
      },
      "06": {
        title: "Sales- & Marketing-Erklärfilme",
        desc: "Website-, LinkedIn- und Hannover-Messe-taugliche Erklärfilme für Ihr Team.",
      },
    },
  },
  trust: {
    label: "Für industrielle Entscheider",
    title: "VERTRAUEN & PROZESS",
    subtitle: "Worauf Hersteller achten, bevor sie einen CGI Partner briefen.",
    items: {
      cad: {
        title: "CAD Kompatibilität",
        desc: "SolidWorks, CATIA, STEP und IGES — wir arbeiten mit Ihren Engineering-Daten, nicht mit Schätzungen.",
      },
      nda: {
        title: "NDA & Vertraulichkeit",
        desc: "Klarer NDA Prozess für proprietäre Maschinen, unveröffentlichte Produkte und sensible Baugruppen.",
      },
      review: {
        title: "Review mit Ingenieuren",
        desc: "Technische Freigabe mit Ihren Engineers vor der finalen Lieferung — keine Marketing-Fiktion.",
      },
      turnaround: {
        title: "Messe-Deadlines",
        desc: "Zeitpläne, die Stand-, Launch- und Go-live-Termine mit Meilensteinen treffen.",
      },
    },
  },
  servicesPage: {
    metaTitle: "Industrielle CGI Leistungen | Starlights Visuals",
    metaDescription:
      "Technische Produktanimation, Explosionsansichten, Messefilme, Robotik Visuals, Sales Erklärfilme und CAD-zu-CGI.",
    label: "Industrielles CGI",
    title: "LEISTUNGEN",
    subtitle:
      "Ergebnisorientierte Deliverables für Maschinenbauer, Robotik Teams und Medizintechnik.",
    ctaTitle1: "BRAUCHEN SIE EINEN",
    ctaTitle2: "MESSE",
    ctaTitle3: "FILM?",
    ctaDesc: "Erzählen Sie uns von der Maschine, dem Deadline und dem verfügbaren CAD.",
    ctaButton: "Gespräch buchen",
    entertainmentCta: "Suchen Sie Character, VFX oder Brand Entertainment?",
    entertainmentLink: "Brand & Entertainment Leistungen",
    items: {
      technical: {
        title: "Technische Produktanimation",
        desc: "Wie die Maschine funktioniert — Cutaways, innere Mechanismen und äußere Bewegung mit Engineering Genauigkeit.",
      },
      exploded: {
        title: "Explosions- / Montageanimation",
        desc: "Für Handbücher, Ersatzteilkataloge und Service Training ohne Live Maschine vor Ort.",
      },
      tradeShow: {
        title: "CGI Renders & Messefilme",
        desc: "Standfertige Filme und Hero Renders statt teurer Drehs großer Anlagen.",
      },
      robotics: {
        title: "Robotik & Bewegungssimulation",
        desc: "Automatisierte Zellen, Cobots und Pick-and-Place für Vertrieb und Marketing.",
      },
      explainer: {
        title: "Sales- & Marketing-Erklärfilme",
        desc: "Website, LinkedIn und Messe Erklärfilme, die Produkt- und Sales Teams klar kommunizieren lassen.",
      },
      cad: {
        title: "CAD-zu-CGI Konvertierung",
        desc: "STEP, IGES, SolidWorks und CATIA Exporte in fotorealistisches CGI Motion überführen.",
      },
    },
  },
  entertainmentServicesPage: {
    metaTitle: "Brand & Entertainment | Starlights Visuals",
    metaDescription:
      "2D und 3D Character Animation, filmische Trailer, Motion Graphics und VFX für Brands und Entertainment.",
    label: "Zweite Geschäftslinie",
    title: "BRAND & ENTERTAINMENT",
    subtitle:
      "Wir produzieren weiterhin Character Animation, Trailer und VFX — parallel zu industriellem CGI.",
    backToIndustrial: "Zurück zu industriellen Leistungen",
    ctaButton: "Projekt starten",
    items: {
      "2d": {
        title: "2D Animation",
        desc: "Frame by frame und geriggte 2D für Serien, Shorts, Erklärfilme und Brand Films.",
      },
      "3d": {
        title: "3D Character & Welten",
        desc: "Stilisierte und fotorealistische Charaktere, Environments und filmische Sequenzen.",
      },
      character: {
        title: "Character Design",
        desc: "Originale Charaktere, Kreaturen und Concept Art für Ihr IP.",
      },
      motion: {
        title: "Motion Graphics",
        desc: "Branded Motion, UI Animation und Broadcast Packages mit filmischem Finish.",
      },
      vfx: {
        title: "Visual Effects (VFX)",
        desc: "Compositing, Particle FX und CG Integration für Film und Kampagnen.",
      },
      trailer: {
        title: "Filmische Trailer",
        desc: "Storybasierte Trailer für Brands, IPs und Kampagnen.",
      },
    },
  },
  contactPage: {
    metaTitle: "Kontakt | Starlights Visuals",
    metaDescription:
      "Gespräch buchen für industrielles CGI, technische Produktanimation, CAD-zu-CGI und Messefilme.",
    subtitle: "Anfragen für industrielles CGI, CAD-zu-Film Projekte oder Brand Work.",
    formTitle: "GESPRÄCH BUCHEN",
    formDesc: "Maschine, Timeline und CAD Status — Antwort innerhalb von 24 Stunden.",
    projectTypes: {
      technical: "Technische Produktanimation",
      exploded: "Explosions- / Montageanimation",
      tradeShow: "Messefilm / CGI Renders",
      robotics: "Robotik & Bewegungssimulation",
      explainer: "Sales- & Marketing-Erklärfilm",
      cad: "CAD-zu-CGI Konvertierung",
      entertainment: "Brand & Entertainment",
      other: "Sonstiges",
    },
  },
  portfolioPage: {
    metaTitle: "Arbeiten | Starlights Visuals",
    metaDescription:
      "Industrielles CGI und Animation — filtern nach Maschinenbau, Robotik, Medizintechnik, Automotive und mehr.",
    label: "Ausgewählte Arbeiten",
    title1: "ARBEITEN",
    title2: "",
    subtitle: "Nach Branche filtern — so bewerten industrielle Käufer Partner.",
    filterAll: "Alle Branchen",
    filterIndustry: "Nach Branche filtern",
    byTechnique: "Nach Technik browsen",
    emptyIndustry: "Noch keine Projekte für diese Branche. Fallstudien ansehen oder Kontakt aufnehmen.",
  },
  industriesPage: {
    metaTitle: "Branchen | Starlights Visuals",
    metaDescription:
      "CGI und Animation für Maschinenbau, Robotik, Medizintechnik, Automotive Komponenten und mehr.",
    label: "Wen wir bedienen",
    title: "BRANCHEN",
    subtitle:
      "Eigene Seiten für Hersteller und Produktteams, die komplexe Technologie visuell verkaufen.",
    viewWork: "Verwandte Arbeiten",
    bookCall: "Gespräch buchen",
    painPoints: "Typische Herausforderungen",
    deliverables: "Typische Deliverables",
    relatedWork: "Verwandte Arbeiten",
    relatedCases: "Fallstudien",
    relatedIndustries: "Verwandte Branchen",
  },
  caseStudiesPage: {
    metaTitle: "Fallstudien | Starlights Visuals",
    metaDescription:
      "Industrielle CGI Fallstudien — SmarAct, Novatorq, Mintec und INTEGRA-pw.",
    label: "Nachweis",
    title: "FALLSTUDIEN",
    subtitle: "Problem, Prozess, technische Constraints und Ergebnis — nicht nur Testimonials.",
    readCase: "Fallstudie lesen",
    problem: "Problem",
    process: "Prozess",
    constraints: "CAD & technische Constraints",
    result: "Ergebnis",
    watchFilm: "Film ansehen",
    backToIndex: "Alle Fallstudien",
    cta: "Ähnliches Projekt starten",
  },
  accordionPage: {
    metaTitle: "FAQ | Starlights Visuals",
    metaDescription:
      "FAQ zu industriellem CGI, CAD Übergabe, NDAs, Engineer Review und Messe Timelines.",
    subtitle:
      "So arbeiten wir mit Herstellern — von CAD und NDA bis Engineer Review und Stand Deadline.",
    sections: {
      general: {
        title: "Allgemein",
        items: {
          "01": {
            question: "An welchen Projekten arbeiten Sie?",
            answer:
              "Schwerpunkt industrielles CGI: technische Produktanimation, Explosionsansichten, Messefilme, Robotik Visuals und Sales Erklärfilme. Brand & Entertainment ist eine zweite Linie.",
          },
          "02": {
            question: "Wo ist Starlights Visuals ansässig?",
            answer:
              "Remote first Studio mit Kunden in Deutschland, Europa und weltweit — inklusive Messeterminen wie Hannover Messe.",
          },
          "03": {
            question: "Wie starte ich ein Projekt?",
            answer:
              "Kontaktformular mit Produkt, Deadline und CAD Status (STEP/SolidWorks/CATIA unter NDA). Danach Discovery Call und Angebot mit Meilensteinen.",
          },
        },
      },
      services: {
        title: "Leistungen & Umfang",
        items: {
          "01": {
            question: "Welche Leistungen für Industrie Kunden?",
            answer:
              "Technische Produktanimation, Explosions-/Montagefilme, CGI Renders und Messefilme, Robotik Simulation, Sales Erklärfilme und CAD-zu-CGI.",
          },
          "02": {
            question: "Arbeiten Sie unter NDA mit proprietären Maschinen?",
            answer:
              "Ja. Klarer Vertraulichkeitsprozess vor Erhalt von CAD oder unveröffentlichten Produktdaten.",
          },
          "03": {
            question: "Machen Sie noch Entertainment / Character Work?",
            answer:
              "Ja — siehe Brand & Entertainment. Industrielle Besucher sehen zuerst industrielle Botschaften.",
          },
        },
      },
      production: {
        title: "Prozess & Lieferung",
        items: {
          "01": {
            question: "Typische Timelines für einen Messefilm?",
            answer:
              "Abhängig vom Scope — fokussierte Produktfilme in wenigen Wochen, größere Packages länger. Meilensteine gegen Ihren Stand- oder Launch Termin.",
          },
          "02": {
            question: "Wie läuft die technische Freigabe?",
            answer:
              "Review Runden mit Ihren Ingenieuren, damit Mechanismen und Abläufe dem realen Produkt entsprechen.",
          },
          "03": {
            question: "Welche CAD Formate akzeptieren Sie?",
            answer:
              "STEP und IGES sowie SolidWorks und CATIA Exporte, wie sie Maschinenbauer und Gerätehersteller nutzen.",
          },
        },
      },
    },
  },
};

const deIndustryCopy = {
  "industrial-machinery": {
    navLabel: "Maschinenbau & Anlagenbau",
    headline: "CGI Animation für Maschinenbauer",
    intro:
      "Komplexe Maschinen in klare Produktfilme verwandeln — für Vertrieb, Marketing und Distributoren ohne Live Demo.",
    pains: [
      "Maschinen sind zu groß oder vertraulich für jeden Kampagnen Dreh vor Ort.",
      "Käufer verstehen innere Mechanismen aus statischen CAD Screenshots schlecht.",
      "Messestände brauchen Motion Assets, die Engineer Reviews standhalten.",
      "Service und Ersatzteile brauchen Explosionsansichten passend zur realen Montage.",
    ],
  },
  "robotics-automation": {
    navLabel: "Robotik & Automation",
    headline: "CGI Animation für Robotik & Automation",
    intro:
      "Automatisierte Zellen, Präzisionspositionierung und Cobot Workflows in Bewegung zeigen.",
    pains: [
      "Live Zellen sind schwer zu filmen — Produktion und IP.",
      "Taktzeiten und Mehrachsbewegung sind in Stills schwer erklärbar.",
      "Sales braucht Visuals für LinkedIn, RFQs und Stand Loops.",
      "Integratoren müssen Zellenlayouts zeigen, bevor Hardware steht.",
    ],
  },
  "medical-devices": {
    navLabel: "Medizintechnik Hersteller",
    headline: "CGI Animation für Medizintechnik",
    intro:
      "Innere Mechanismen und Workflows visualisieren — ohne IP oder Regulatory Constraints zu verletzen.",
    pains: [
      "Innereien zeigen, ohne proprietäre Designs unangemessen freizugeben.",
      "Regulatory und Marketing brauchen abgestimmte, reviewbare Visuals.",
      "Prototypen sind limitiert, teuer oder nicht kamera tauglich.",
      "Kliniker und Einkauf brauchen Klarheit schneller als eine dichte IFU.",
    ],
  },
  "automotive-components": {
    navLabel: "Automotive Komponenten",
    headline: "CGI Animation für Automotive Komponenten",
    intro:
      "Antriebe, EV Subsysteme und mechanische Baugruppen mit technischem CGI erklären.",
    pains: [
      "EV und Mechanik brauchen Cutaways und Motion.",
      "OEM und Partner Präsentationen brauchen Genauigkeit plus Polish.",
      "Prototypen sind nicht für jedes Meeting verfügbar.",
      "Marketing Assets müssen von Engineering freigegeben werden.",
    ],
  },
  "packaging-machines": {
    navLabel: "Verpackungsmaschinen",
    headline: "CGI Animation für Verpackungsmaschinen",
    intro:
      "Formatwechsel, Durchsatz und Changeover zeigen, wenn die Linie nicht auf den Stand kommt.",
    pains: [
      "Linien sind zu groß oder ausgelastet für jeden Marktdreh.",
      "Changeovers brauchen klare Motion Storytelling.",
      "Distributoren brauchen teilbare Filme für Kundengespräche.",
    ],
  },
  "cnc-machines": {
    navLabel: "CNC Maschinen",
    headline: "CGI Animation für CNC Hersteller",
    intro:
      "Mehrachs Toolpaths und Bearbeitungsvorteile erklären — ohne Live Maschine vor Ort.",
    pains: [
      "Mehrachsbewegung ist in Fotos schwer vermittelbar.",
      "Prospects können nicht immer Showroom oder Open House besuchen.",
      "Messen brauchen Looping Filme, die technisch ehrlich bleiben.",
    ],
  },
  "industrial-pumps": {
    navLabel: "Industriepumpen",
    headline: "CGI Animation für Industriepumpen",
    intro:
      "Strömungswege, Dichtungen und Wartbarkeit mit Cutaways und Explosionsansichten zeigen.",
    pains: [
      "Innere Strömung und Verschleißpunkte sind auf Produktfotos unsichtbar.",
      "Service Handbücher brauchen klarere Montage Storytelling.",
      "Sales braucht kurze Erklärfilme für komplexe SKUs.",
    ],
  },
  "industrial-electronics": {
    navLabel: "Industrieelektronik",
    headline: "CGI Animation für Industrieelektronik",
    intro:
      "Produktfilme und Erklärfilme für Steckverbinder, Module und Elektroniklinien mit Präzisionsvisuals.",
    pains: [
      "Kleine Bauteile brauchen makroskopische Klarheit in Motion.",
      "Produktfamilien Unterschiede müssen leicht vergleichbar sein.",
      "Messe und Web Assets müssen zu Engineering Drawings passen.",
    ],
  },
};

dePatch.industries = {
  ...dePatch.industriesPage,
  items: deIndustryCopy,
};

dePatch.caseStudies = {
  ...dePatch.caseStudiesPage,
  items: {
    smaract: {
      title: "SmarAct — Automations CGI für klare Kernkompetenzen",
      summary:
        "CGI Film, der Präzisionsautomation klar für Marketing und Sales darstellt.",
      problem:
        "SmarAct brauchte ein professionelles CGI Video, um Kernkompetenzen klar und visuell ansprechend zu präsentieren.",
      process:
        "Messaging abgestimmt, präzise Motion aus technischen Referenzen, schnelle Iteration mit Marketing, finale Files für digitale Kanäle.",
      constraints:
        "Präzisionsmechanismen erforderten visuelle Treue und schnelle, zuverlässige Lieferung.",
      result:
        "Klarer, professioneller CGI Film — mit schnellen Reaktionszeiten und verlässlicher Delivery laut Kundenfeedback.",
    },
    novatorq: {
      title: "Novatorq — EV Technologie, die Partner verstehen",
      summary:
        "Technische Animation, die erklärt, wie die EV Technologie funktioniert.",
      problem:
        "Novatorq brauchte Visuals, die Partnern klar zeigen, wie die EV / PHR Technologie funktioniert.",
      process:
        "Konzept mit Foundern geschärft, technische Storytelling Iterationen, Animation für Stakeholder Präsentationen.",
      constraints:
        "Engineering Genauigkeit und Klarheit für Nicht Spezialisten in einem Film.",
      result:
        "Klarere Präsentation für Partner und Stakeholder — reibungslose Zusammenarbeit.",
    },
    mintec: {
      title: "Mintec — M12 vs B12 Produktklarheit",
      summary:
        "Animationen, die Produktlinien Unterschiede für Käufer und Sales offensichtlich machen.",
      problem:
        "Mintec brauchte eine klare Darstellung der Unterschiede zwischen M12 und B12.",
      process:
        "Fokus auf kaufrelevante Details, hochwertige Animationen, lesbare Unterscheidungen.",
      constraints:
        "Produktvergleich musste akkurat und auf einen Blick verständlich bleiben.",
      result:
        "Animationen, die das Produktionsteam brauchte — klar, detailliert, sales ready.",
    },
    "integra-pw": {
      title: "INTEGRA-pw — Komplexe Produkte leicht erklärt",
      summary:
        "Animation, die dem Vertrieb hilft, ein starkes Produkt selbstbewusst zu präsentieren.",
      problem:
        "Das Produkt war stark — es klar Kunden zu erklären blieb die Herausforderung.",
      process:
        "Verständnis der Funktionsweise, dann Animation die Aufmerksamkeit hält und klar kommuniziert.",
      constraints:
        "Technisches Storytelling musste treu und zugänglich bleiben.",
      result:
        "Professioneller Film für mehr Präsentationssicherheit im Sales — direkte Zusammenarbeit.",
    },
  },
};

for (const [locale, patch] of [
  ["en", enPatch],
  ["de", dePatch],
]) {
  const file = path.join(root, "src", "locales", locale, "common.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  deepMerge(data, patch);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log("patched", locale);
}
