/**
 * Add industrial service detail copy (EN/DE) and clean unnecessary dashes/hyphens
 * across locale JSON files.
 * Run: node scripts/patch-service-details-i18n.mjs
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

function cleanDashesInString(s) {
  if (typeof s !== "string") return s;
  let out = s;
  // Soft hyphen / odd unicode hyphens
  out = out.replace(/\u00AD/g, "");
  out = out.replace(/[\u2010\u2011\u2012]/g, "-");
  // Em / en dash used as pause → comma or space depending on context
  out = out.replace(/\s*[—–]\s*/g, ", ");
  // Double spaces from replacements
  out = out.replace(/,\s*,/g, ",");
  out = out.replace(/\s{2,}/g, " ").trim();
  // Common awkward compounds → readable phrasing
  const replacements = [
    [/CAD-zu-CGI/gi, "CAD zu CGI"],
    [/CAD-to-CGI/gi, "CAD to CGI"],
    [/CAD-zu-Film/gi, "CAD zu Film"],
    [/Explosions-\s*\/\s*Montageanimation/gi, "Explosions und Montageanimation"],
    [/Explosions-\s*&\s*Montageanimation/gi, "Explosions und Montageanimation"],
    [/Sales-\s*&\s*Marketing-Erklärfilme?/gi, "Sales und Marketing Erklärfilme"],
    [/Sales-\s*&\s*Marketing-Erklärfilm/gi, "Sales und Marketing Erklärfilm"],
    [/Medizintechnik-Hersteller/gi, "Hersteller von Medizintechnik"],
    [/Service-Training/gi, "Service Training"],
    [/On-Site-Drehs/gi, "Dreharbeiten vor Ort"],
    [/Engineering-Daten/gi, "Engineering Daten"],
    [/Marketing-Fiktion/gi, "Marketingfiktion"],
    [/Messe-Deadlines/gi, "Messedeadlines"],
    [/Go-live-Termine/gi, "Go live Termine"],
    [/Stand-,\s*Launch-/gi, "Stand, Launch"],
    [/Website-,\s*LinkedIn-\s*und\s*Hannover-Messe-taugliche/gi, "Website, LinkedIn und Hannover Messe taugliche"],
    [/TRADE-SHOW/g, "TRADE SHOW"],
    [/trade-show/gi, "trade show"],
    [/Exploded-View/gi, "Exploded view"],
    [/Pick-and-Place/gi, "Pick and Place"],
    [/pick-and-place/gi, "pick and place"],
  ];
  for (const [re, to] of replacements) out = out.replace(re, to);
  // Fix ", ," artifacts
  out = out.replace(/,\s*,/g, ",");
  out = out.replace(/\s+,/g, ",");
  out = out.replace(/,\s*\./g, ".");
  return out;
}

function cleanDashesDeep(value) {
  if (typeof value === "string") return cleanDashesInString(value);
  if (Array.isArray(value)) return value.map(cleanDashesDeep);
  if (value && typeof value === "object") {
    const next = {};
    for (const [k, v] of Object.entries(value)) next[k] = cleanDashesDeep(v);
    return next;
  }
  return value;
}

const enDetails = {
  detailsNav: {
    back: "All services",
    outcomes: "What you get",
    audience: "Who it is for",
    process: "How we work",
    related: "Related services",
    readMore: "Read more",
  },
  items: {
    technical: {
      title: "Technical Product Animation",
      desc: "How the machine works, cutaways, internal mechanisms, and external motion with engineering accuracy.",
    },
    exploded: {
      title: "Exploded View and Assembly Animation",
      desc: "For manuals, spare parts catalogs, and service training without a live machine on site.",
    },
    tradeShow: {
      title: "CGI Product Renders and Trade Show Films",
      desc: "Booth ready films and hero renders that replace costly on site shoots of large equipment.",
    },
    robotics: {
      title: "Robotics and Motion Simulation Visuals",
      desc: "Automated cells, cobots, and pick and place sequences for sales and marketing.",
    },
    explainer: {
      title: "Sales and Marketing Explainer Videos",
      desc: "Website, LinkedIn, and trade show explainers that help product and sales teams communicate clearly.",
    },
    cad: {
      title: "CAD to CGI Conversion",
      desc: "Ingest STEP, IGES, SolidWorks, and CATIA exports and convert them into photoreal CGI motion.",
    },
  },
  details: {
    technical: {
      metaTitle: "Technical Product Animation | Starlights Visuals",
      metaDescription:
        "Engineering accurate CGI that shows how industrial machines work inside and out for sales, training, and marketing.",
      intro:
        "Technical product animation turns complex mechanisms into clear motion. We build cutaways, internal views, and external sequences that engineers trust and buyers understand.",
      outcomes: [
        "Cutaway and transparent views that reveal inner mechanisms without guessing",
        "Motion timed to real operating sequences and cycle logic",
        "Assets sized for websites, sales decks, and trade show loops",
        "Review checkpoints with your engineering team before final delivery",
      ],
      audience: [
        "Machine builders explaining multi stage processes",
        "Product managers launching a new series or feature set",
        "Sales teams who need a film when the machine cannot travel",
        "Marketing leads who need accuracy without a live shoot",
      ],
      steps: [
        "Brief and CAD intake under NDA, including the sequences that matter most",
        "Look development and technical storyboard aligned to your engineers",
        "Animation production with scheduled accuracy reviews",
        "Final delivery in formats ready for web, booth, and sales enablement",
      ],
      ctaTitle: "Ready to show how your machine really works?",
      ctaDesc: "Share your product, deadline, and CAD status. We reply within 24 hours.",
    },
    exploded: {
      metaTitle: "Exploded View Animation | Starlights Visuals",
      metaDescription:
        "Exploded view and assembly animations for spare parts manuals, service training, and industrial sales.",
      intro:
        "Exploded view and assembly films make part relationships and build order obvious. Ideal for manuals, spare parts portals, and technician onboarding.",
      outcomes: [
        "BOM aligned part groups that match your documentation",
        "Clear assembly and disassembly order in motion",
        "Stills and film exports for manuals and training portals",
        "Readable labeling and camera paths that stay service friendly",
      ],
      audience: [
        "Service and aftermarket teams writing manuals",
        "Spare parts marketers explaining kits and variants",
        "Training leads onboarding technicians remotely",
        "Manufacturers reducing support tickets on complex assemblies",
      ],
      steps: [
        "CAD and BOM review to define part groups and priority chapters",
        "Assembly storyboard with labeling conventions your team uses",
        "Animation of explode, isolate, and reassemble sequences",
        "Export stills, short films, and optional interactive frames",
      ],
      ctaTitle: "Need clearer spare parts and service visuals?",
      ctaDesc: "Tell us which assemblies drive the most questions. We start from your CAD.",
    },
    "trade-show": {
      metaTitle: "Trade Show Films and CGI Renders | Starlights Visuals",
      metaDescription:
        "Booth ready CGI films and product renders for industrial trade shows without expensive on site shoots.",
      intro:
        "Large machines are expensive to film and hard to stage. CGI product renders and trade show films deliver booth ready motion that stays accurate under engineer review.",
      outcomes: [
        "Hero films sized for booth loops and LED walls",
        "Photoreal product renders for print and digital collateral",
        "Timelines scoped to your show deadline with milestone reviews",
        "Formats ready for LinkedIn cutdowns after the event",
      ],
      audience: [
        "Exhibitors preparing for Hannover Messe and similar shows",
        "Brand teams who cannot ship the machine to every venue",
        "Agencies needing industrial CGI for a booth concept",
        "Sales leaders who want a looping film that holds attention",
      ],
      steps: [
        "Define booth use cases, screen sizes, and must show features",
        "CAD to look development with lighting matched to your brand",
        "Produce the master film plus short loops for continuous play",
        "Deliver show ready files with backup formats for AV teams",
      ],
      ctaTitle: "Got a booth deadline coming up?",
      ctaDesc: "Share the show date and what must be on screen. We plan milestones backwards from open day.",
    },
    robotics: {
      metaTitle: "Robotics Motion Simulation Visuals | Starlights Visuals",
      metaDescription:
        "CGI for robotic cells, cobots, and pick and place workflows that sales and marketing can share.",
      intro:
        "Robotics and automation cells are hard to film cleanly. We visualize cobots, pick and place, and cell layouts so prospects grasp throughput and safety without a factory tour.",
      outcomes: [
        "Cell layouts and motion paths that match integrator drawings",
        "Cycle storytelling that communicates takt and throughput",
        "Safety zone and workflow clarity for non specialists",
        "Films for RFQs, LinkedIn, and booth loops",
      ],
      audience: [
        "Automation builders and system integrators",
        "Robotics OEMs explaining cell concepts before install",
        "Sales engineers supporting complex RFQs",
        "Marketing teams who cannot film live production cells",
      ],
      steps: [
        "NDA and layout intake from CAD or integrator drawings",
        "Motion reference alignment with your applications team",
        "Simulation style animation with accuracy review passes",
        "Delivery of hero film and short clips for digital channels",
      ],
      ctaTitle: "Need to show your automation cell clearly?",
      ctaDesc: "Send layouts or CAD under NDA and the workflows buyers must understand.",
    },
    explainer: {
      metaTitle: "Sales and Marketing Explainer Videos | Starlights Visuals",
      metaDescription:
        "Industrial explainer videos for websites, LinkedIn, and trade shows that help teams sell complex products.",
      intro:
        "Sales and marketing explainers translate technical value into a short film your team can send, embed, and play at the booth.",
      outcomes: [
        "Script and structure built around buyer questions",
        "Technical accuracy without burying the message",
        "Versions for web, social, and trade show screens",
        "Clear CTAs that hand off to sales conversations",
      ],
      audience: [
        "Product marketers launching features or SKUs",
        "Sales teams needing a shareable product story",
        "Founders pitching partners and investors",
        "Distributors who need localized explainers later",
      ],
      steps: [
        "Discovery on audience, offer, and proof points",
        "Script and visual outline for stakeholder sign off",
        "Production with optional CAD based product shots",
        "Cutdowns and captions for the channels you use most",
      ],
      ctaTitle: "Want an explainer your sales team will actually use?",
      ctaDesc: "Tell us the product story and where the film will live. We scope a practical package.",
    },
    cad: {
      metaTitle: "CAD to CGI Conversion | Starlights Visuals",
      metaDescription:
        "Convert SolidWorks, CATIA, STEP, and IGES data into photoreal CGI product films for industrial marketing.",
      intro:
        "CAD to CGI conversion is our bridge from engineering data to marketing ready motion. We ingest common formats and turn assemblies into photoreal films.",
      outcomes: [
        "Support for STEP, IGES, SolidWorks, and CATIA exports",
        "Cleanup and optimization so heavy assemblies animate smoothly",
        "Materials and lighting that read as real product photography",
        "A path from raw CAD to booth and website ready files",
      ],
      audience: [
        "Manufacturers with CAD but no marketing film",
        "Engineering teams who need visuals without a photoshoot",
        "Agencies handing off CAD for industrial clients",
        "Anyone under NDA with unreleased product geometry",
      ],
      steps: [
        "Secure CAD handoff under NDA and format check",
        "Cleanup, hierarchy, and material look development",
        "Animation and lighting production with engineer review",
        "Final CGI delivery plus optional still frames",
      ],
      ctaTitle: "Have CAD ready to turn into a film?",
      ctaDesc: "Tell us your formats and deadline. We confirm compatibility before production starts.",
    },
  },
};

const deDetails = {
  detailsNav: {
    back: "Alle Leistungen",
    outcomes: "Was Sie erhalten",
    audience: "Für wen es ist",
    process: "So arbeiten wir",
    related: "Verwandte Leistungen",
    readMore: "Mehr erfahren",
  },
  items: {
    technical: {
      title: "Technische Produktanimation",
      desc: "Wie die Maschine funktioniert, Cutaways, innere Mechanismen und äußere Bewegung mit Engineering Genauigkeit.",
    },
    exploded: {
      title: "Explosions und Montageanimation",
      desc: "Für Handbücher, Ersatzteilkataloge und Service Training ohne Live Maschine vor Ort.",
    },
    tradeShow: {
      title: "CGI Renders und Messefilme",
      desc: "Standfertige Filme und Hero Renders statt teurer Drehs großer Anlagen.",
    },
    robotics: {
      title: "Robotik und Bewegungssimulation",
      desc: "Automatisierte Zellen, Cobots und Pick and Place für Vertrieb und Marketing.",
    },
    explainer: {
      title: "Sales und Marketing Erklärfilme",
      desc: "Website, LinkedIn und Messe Erklärfilme, die Produkt und Sales Teams klar kommunizieren lassen.",
    },
    cad: {
      title: "CAD zu CGI Konvertierung",
      desc: "STEP, IGES, SolidWorks und CATIA Exporte in fotorealistisches CGI Motion überführen.",
    },
  },
  details: {
    technical: {
      metaTitle: "Technische Produktanimation | Starlights Visuals",
      metaDescription:
        "Engineering genaue CGI Filme, die zeigen, wie Industriemaschinen innen und außen funktionieren.",
      intro:
        "Technische Produktanimation macht komplexe Mechanismen verständlich. Wir bauen Cutaways, Innenansichten und äußere Sequenzen, denen Ingenieure vertrauen und die Käufer verstehen.",
      outcomes: [
        "Cutaways und transparente Ansichten für innere Mechanismen",
        "Motion abgestimmt auf reale Betriebsabläufe",
        "Assets für Website, Sales Decks und Messeloops",
        "Review Schritte mit Ihrem Engineering Team vor der finalen Lieferung",
      ],
      audience: [
        "Maschinenbauer mit mehrstufigen Prozessen",
        "Product Manager bei Launch neuer Serien oder Features",
        "Sales Teams, wenn die Maschine nicht mitreisen kann",
        "Marketing, das Genauigkeit ohne Live Dreh braucht",
      ],
      steps: [
        "Briefing und CAD Aufnahme unter NDA",
        "Look Development und technisches Storyboard mit Ihren Engineers",
        "Animation mit geplanten Accuracy Reviews",
        "Finale Lieferung für Web, Stand und Sales Enablement",
      ],
      ctaTitle: "Bereit zu zeigen, wie Ihre Maschine wirklich funktioniert?",
      ctaDesc: "Produkt, Deadline und CAD Status reichen. Antwort innerhalb von 24 Stunden.",
    },
    exploded: {
      metaTitle: "Explosionsanimation | Starlights Visuals",
      metaDescription:
        "Explosions und Montageanimationen für Ersatzteilhandbücher, Service Training und industriellen Vertrieb.",
      intro:
        "Explosions und Montagefilme machen Teilebeziehungen und Reihenfolge klar. Ideal für Handbücher, Ersatzteilportale und Techniker Onboarding.",
      outcomes: [
        "BOM orientierte Teilegruppen passend zu Ihrer Dokumentation",
        "Klare Montage und Demontage Reihenfolge in Motion",
        "Stills und Film Exports für Handbücher und Trainingsportale",
        "Lesbare Beschriftung und kamera Wege für den Service",
      ],
      audience: [
        "Service und Aftermarket Teams",
        "Ersatzteil Marketing für Kits und Varianten",
        "Training Leads für Remote Onboarding",
        "Hersteller, die Support Tickets zu Baugruppen senken wollen",
      ],
      steps: [
        "CAD und BOM Review für Prioritätskapitel",
        "Montage Storyboard mit Ihren Label Konventionen",
        "Animation von Explode, Isolate und Reassemble",
        "Export von Stills, Kurzfilmen und optionalen Frames",
      ],
      ctaTitle: "Klarere Visuals für Ersatzteile und Service?",
      ctaDesc: "Sagen Sie uns, welche Baugruppen die meisten Fragen auslösen. Wir starten mit Ihrem CAD.",
    },
    "trade-show": {
      metaTitle: "Messefilme und CGI Renders | Starlights Visuals",
      metaDescription:
        "Standfertige CGI Filme und Produktrenders für Industriemessen ohne teure Drehs vor Ort.",
      intro:
        "Große Maschinen sind teuer zu drehen und schwer zu inszenieren. CGI Renders und Messefilme liefern standfertige Motion mit Engineer Review.",
      outcomes: [
        "Hero Filme für Stand Loops und LED Walls",
        "Fotorealistische Renders für Print und Digital",
        "Zeitpläne rückwärts vom Messetermin mit Meilensteinen",
        "Formate auch für LinkedIn Cutdowns nach der Messe",
      ],
      audience: [
        "Aussteller für Hannover Messe und ähnliche Events",
        "Teams, die die Maschine nicht zu jedem Venue bringen können",
        "Agenturen mit Bedarf an industriellem CGI für den Stand",
        "Sales Leader, die einen Loop Film mit Aufmerksamkeit brauchen",
      ],
      steps: [
        "Use Cases, Screen Größen und Must show Features definieren",
        "CAD zu Look Development mit Marken Lighting",
        "Master Film plus kurze Loops für Dauerbetrieb",
        "Show ready Files inklusive Backup Formate für AV Teams",
      ],
      ctaTitle: "Messedeadline vor der Tür?",
      ctaDesc: "Messedatum und Pflichtinhalte auf dem Screen. Wir planen Meilensteine rückwärts.",
    },
    robotics: {
      metaTitle: "Robotik Bewegungssimulation | Starlights Visuals",
      metaDescription:
        "CGI für Robotik Zellen, Cobots und Pick and Place Workflows für Sales und Marketing.",
      intro:
        "Robotik und Automationszellen sind schwer sauber zu filmen. Wir visualisieren Cobots, Pick and Place und Zellenlayouts, damit Prospects Durchsatz und Sicherheit verstehen.",
      outcomes: [
        "Zellenlayouts und Motion Paths passend zu Integrator Drawings",
        "Zyklus Storytelling für Takt und Throughput",
        "Sicherheitszonen und Workflow Klarheit für Nicht Spezialisten",
        "Filme für RFQs, LinkedIn und Stand Loops",
      ],
      audience: [
        "Automationsbauer und Systemintegratoren",
        "Robotik OEMs vor der Installation",
        "Sales Engineers bei komplexen RFQs",
        "Marketing ohne Zugang zu Live Produktionszellen",
      ],
      steps: [
        "NDA und Layout Intake aus CAD oder Drawings",
        "Motion Referenzen mit Ihrem Applications Team",
        "Simulationsnahe Animation mit Accuracy Reviews",
        "Hero Film und Kurzclips für digitale Kanäle",
      ],
      ctaTitle: "Automationszelle klar zeigen?",
      ctaDesc: "Layouts oder CAD unter NDA und die Workflows, die Käufer verstehen müssen.",
    },
    explainer: {
      metaTitle: "Sales und Marketing Erklärfilme | Starlights Visuals",
      metaDescription:
        "Industrielle Erklärfilme für Website, LinkedIn und Messen, die Teams helfen, komplexe Produkte zu verkaufen.",
      intro:
        "Sales und Marketing Erklärfilme übersetzen technischen Nutzen in einen kurzen Film, den Ihr Team senden, einbetten und am Stand spielen kann.",
      outcomes: [
        "Skript und Struktur entlang von Käuferfragen",
        "Technische Genauigkeit ohne die Botschaft zu begraben",
        "Versionen für Web, Social und Messescreens",
        "Klare CTAs in Richtung Sales Gespräch",
      ],
      audience: [
        "Product Marketing bei Feature oder SKU Launches",
        "Sales Teams mit Bedarf an teilbarer Produktstory",
        "Founder für Partner und Investor Pitches",
        "Distributoren mit späterem Lokalisierungsbedarf",
      ],
      steps: [
        "Discovery zu Audience, Offer und Proof Points",
        "Skript und Visual Outline zur Freigabe",
        "Produktion mit optionalen CAD Produktshots",
        "Cutdowns und Captions für Ihre Hauptkanäle",
      ],
      ctaTitle: "Erklärfilm, den Sales wirklich nutzt?",
      ctaDesc: "Produktstory und Einsatzorte. Wir scopen ein praktisches Paket.",
    },
    cad: {
      metaTitle: "CAD zu CGI Konvertierung | Starlights Visuals",
      metaDescription:
        "SolidWorks, CATIA, STEP und IGES Daten in fotorealistische CGI Produktfilme für industrielles Marketing überführen.",
      intro:
        "CAD zu CGI ist die Brücke von Engineering Daten zu marketingtauglicher Motion. Wir nehmen gängige Formate an und machen daraus fotorealistische Filme.",
      outcomes: [
        "Support für STEP, IGES, SolidWorks und CATIA Exporte",
        "Cleanup und Optimierung schwerer Assemblies",
        "Materials und Lighting wie echte Produktfotografie",
        "Pfad von Roh CAD zu stand und website fertigen Files",
      ],
      audience: [
        "Hersteller mit CAD aber ohne Marketingfilm",
        "Engineering Teams ohne Photoshoot Kapazität",
        "Agenturen mit CAD Handoff für Industrie Kunden",
        "Teams unter NDA mit unveröffentlichter Geometrie",
      ],
      steps: [
        "Sicherer CAD Handoff unter NDA und Format Check",
        "Cleanup, Hierarchie und Material Look Development",
        "Animation und Lighting mit Engineer Review",
        "Finale CGI Lieferung plus optionale Stills",
      ],
      ctaTitle: "CAD bereit für den Film?",
      ctaDesc: "Formate und Deadline. Wir bestätigen Kompatibilität vor Produktionsstart.",
    },
  },
};

// Also clean home/services titles in DE patch
const deHomeCleanup = {
  home: {
    heroBody:
      "CGI und Animation für Maschinenbauer, Robotik und Hersteller von Medizintechnik. Wir verwandeln CAD Daten und komplexe Mechanismen in Produktfilme, Explosionsanimationen und technische Erklärfilme, für Websites, Vertriebsteams und Messen.",
    services: {
      "01": {
        title: "Technische Produktanimation",
        desc: "Zeigen, wie die Maschine innen und außen funktioniert, mit Genauigkeit, der Ingenieure vertrauen.",
      },
      "02": {
        title: "Explosions und Montageanimation",
        desc: "Für Handbücher, Ersatzteile und Service Training, das Komplexität verständlich macht.",
      },
      "03": {
        title: "Messefilme und CGI Renders",
        desc: "Ersetzen Sie teure Dreharbeiten vor Ort bei großen Maschinen durch fotorealistisches CGI für den Stand.",
      },
      "04": {
        title: "CAD zu CGI Konvertierung",
        desc: "SolidWorks, CATIA, STEP und IGES, aus Engineering Daten werden marketingtaugliche Filme.",
      },
      "05": {
        title: "Robotik und Bewegungssimulation",
        desc: "Automatisierte Abläufe, Cobots und Pick and Place für Sales Enablement visualisieren.",
      },
      "06": {
        title: "Sales und Marketing Erklärfilme",
        desc: "Erklärfilme für Website, LinkedIn und Hannover Messe, die Ihr Team klar unterstützt.",
      },
    },
    ctaTitle2: "IHR FILM BAUEN",
  },
  servicesPage: {
    ctaTitle2: "MESSE",
    ...deDetails,
  },
  footer: {
    tagline:
      "CGI und Animation für Maschinenbauer, Robotik und Medizintechnik, aus CAD und komplexen Mechanismen werden Produktfilme, die verkaufen.",
  },
  contactPage: {
    projectTypes: {
      technical: "Technische Produktanimation",
      exploded: "Explosions und Montageanimation",
      tradeShow: "Messefilm / CGI Renders",
      robotics: "Robotik und Bewegungssimulation",
      explainer: "Sales und Marketing Erklärfilm",
      cad: "CAD zu CGI Konvertierung",
      entertainment: "Brand und Entertainment",
      other: "Sonstiges",
    },
  },
  trust: {
    items: {
      cad: {
        title: "CAD Kompatibilität",
        desc: "SolidWorks, CATIA, STEP und IGES, wir arbeiten mit Ihren Engineering Daten, nicht mit Schätzungen.",
      },
      review: {
        title: "Review mit Ingenieuren",
        desc: "Technische Freigabe mit Ihren Engineers vor der finalen Lieferung, keine Marketingfiktion.",
      },
      turnaround: {
        title: "Messedeadlines",
        desc: "Zeitpläne, die Stand, Launch und Go live Termine mit Meilensteinen treffen.",
      },
    },
  },
};

const enHomeCleanup = {
  home: {
    services: {
      "01": {
        title: "Technical Product Animation",
        desc: "Show how the machine works, internally and externally, with accuracy engineers trust.",
      },
      "02": {
        title: "Exploded View and Assembly",
        desc: "Animations for manuals, spare parts, and service training that make complexity clear.",
      },
      "03": {
        title: "Trade Show Films and CGI Renders",
        desc: "Replace expensive on site filming of large machinery with photoreal CGI ready for the booth.",
      },
      "04": {
        title: "CAD to CGI Conversion",
        desc: "We ingest SolidWorks, CATIA, STEP, and IGES exports and turn them into marketing ready motion.",
      },
      "05": {
        title: "Robotics and Motion Simulation",
        desc: "Visualize automated workflows, cobots, and pick and place sequences for sales enablement.",
      },
      "06": {
        title: "Sales and Marketing Explainers",
        desc: "Website, LinkedIn, and Hannover Messe ready explainers that help your team close.",
      },
    },
  },
  servicesPage: {
    ctaTitle2: "TRADE SHOW",
    ...enDetails,
  },
  contactPage: {
    projectTypes: {
      technical: "Technical Product Animation",
      exploded: "Exploded View / Assembly",
      tradeShow: "Trade Show Film / CGI Renders",
      robotics: "Robotics and Motion Simulation",
      explainer: "Sales and Marketing Explainer",
      cad: "CAD to CGI Conversion",
      entertainment: "Brand and Entertainment",
      other: "Other",
    },
  },
};

const localesDir = path.join(root, "src", "locales");

// Merge EN/DE content then clean dashes in ALL locales
for (const loc of fs.readdirSync(localesDir)) {
  const file = path.join(localesDir, loc, "common.json");
  if (!fs.existsSync(file)) continue;
  let data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (loc === "en") deepMerge(data, enHomeCleanup);
  if (loc === "de") deepMerge(data, deHomeCleanup);
  // Ensure non EN/DE still get English details as fallback structure if missing
  if (loc !== "en" && loc !== "de") {
    if (!data.servicesPage) data.servicesPage = {};
    if (!data.servicesPage.details) {
      deepMerge(data.servicesPage, {
        detailsNav: enDetails.detailsNav,
        details: enDetails.details,
        items: {
          ...((data.servicesPage && data.servicesPage.items) || {}),
          ...enDetails.items,
        },
      });
    }
  }
  data = cleanDashesDeep(data);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log("patched", loc);
}
