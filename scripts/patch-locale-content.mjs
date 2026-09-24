import fs from "node:fs";

const enPath = "c:/Users/DELL/Desktop/starlightsvisuals-main/src/locales/en/common.json";
const dePath = "c:/Users/DELL/Desktop/starlightsvisuals-main/src/locales/de/common.json";
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
const de = JSON.parse(fs.readFileSync(dePath, "utf8"));

en.trust = en.trust || {};
delete en.trust.subtitle;
de.trust = de.trust || {};
delete de.trust.subtitle;

en.aboutPage = {
  metaTitle: "About | Starlights Visuals",
  metaDescription:
    "CGI and animation for industrial machinery, robotics, and medical device manufacturers. CAD to CGI films engineers trust and sales teams use.",
  label: "About the studio",
  title: "CGI & Animation for Industrial Machinery, Robotics & Medical Device Manufacturers",
  lead: "We turn complex machines, automated systems, and technical products into CGI films that engineers trust and sales teams actually use.",
  p1: "Founded on years of hands-on experience creating technical animations for companies like SmarAct, Novatorq, Mintec, and INTEGRA-pw, Starlight Visual Studio was built for one purpose: helping industrial companies show exactly how their products work, inside and out, without relying on expensive on-site filming, stock footage, or generic marketing visuals.",
  p2: "We work directly from your CAD data, respect NDAs and IP protection as standard, and build every animation with technical accuracy reviewed alongside your engineering team, because in this industry, close enough is not good enough.",
  p3: "If your machine, product, or process deserves to be seen the way it deserves to be understood, let's talk.",
  p4: "",
  whoTitle: "Who we work with",
  whatTitle: "What we do",
  whoItems: [
    "Industrial machinery manufacturers",
    "Robotics & automation companies",
    "Medical device manufacturers",
    "Automotive component suppliers",
    "Machine builders & packaging machine manufacturers",
    "CNC, industrial pumps & industrial electronics companies",
  ],
  whatItems: [
    "CAD-to-CGI product animation",
    "Exploded-view & assembly animations for manuals and spare parts",
    "Technical explainer videos for websites and sales teams",
    "Trade show and product launch films",
    "Robotics & automation motion visualization",
  ],
  cta: "Book a call",
  website: "www.starlightvisualstudio.com",
};
// merge p2 into flow - user had p2 as the CAD/NDA paragraph which I put as p2, and closing as p3. Clear empty p4.
delete en.aboutPage.p4;

de.aboutPage = {
  metaTitle: "Über uns | Starlights Visuals",
  metaDescription:
    "CGI und Animation für Maschinenbau, Robotik und Medizintechnik. CAD zu CGI Filme, denen Engineers und Vertrieb vertrauen.",
  label: "Über das Studio",
  title: "CGI & Animation für Maschinenbau, Robotik und Medizintechnik",
  lead: "Wir verwandeln komplexe Maschinen, Automatisierungssysteme und technische Produkte in CGI Filme, denen Engineers vertrauen und die Vertriebsteams wirklich nutzen.",
  p1: "Aufgebaut auf jahrelanger Erfahrung mit technischen Animationen für Unternehmen wie SmarAct, Novatorq, Mintec und INTEGRA-pw wurde Starlight Visual Studio für einen Zweck gegründet: Industrieunternehmen helfen, genau zu zeigen, wie ihre Produkte von innen und außen funktionieren, ohne teure Drehs vor Ort, Stock Footage oder generische Marketing Visuals.",
  p2: "Wir arbeiten direkt aus Ihren CAD Daten, behandeln NDAs und IP Schutz als Standard und bauen jede Animation mit technischer Genauigkeit im Review mit Ihrem Engineering Team, weil in dieser Branche nah genug nicht gut genug ist.",
  p3: "Wenn Ihre Maschine, Ihr Produkt oder Ihr Prozess so gesehen werden soll, wie er verstanden werden muss, sprechen wir.",
  whoTitle: "Mit wem wir arbeiten",
  whatTitle: "Was wir tun",
  whoItems: [
    "Hersteller industrieller Maschinen",
    "Robotik und Automation Unternehmen",
    "Medizintechnik Hersteller",
    "Automotive Komponenten Zulieferer",
    "Maschinenbauer und Verpackungsmaschinen Hersteller",
    "CNC, Industriepumpen und Industrieelektronik Unternehmen",
  ],
  whatItems: [
    "CAD zu CGI Produktanimation",
    "Explosions und Montage Animationen für Manuals und Ersatzteile",
    "Technische Erklärfilme für Websites und Vertrieb",
    "Messe und Product Launch Filme",
    "Robotik und Automation Motion Visualization",
  ],
  cta: "Gespräch buchen",
  website: "www.starlightvisualstudio.com",
};

function industryItem(navLabel, headline, intro, pains) {
  return { navLabel, headline, intro, pains };
}

en.industries.items["brand-entertainment"] = industryItem(
  "Brand & Entertainment",
  "CGI Animation for Brand & Entertainment",
  "Character animation, cartoons, VTuber, and entertainment films for brands that need expressive motion beyond industrial product storytelling.",
  [
    "Campaigns need character-driven motion that still feels premium and on brand.",
    "Entertainment assets must ship fast across social, ads, and launch films.",
    "Teams want one studio that can move between industrial CGI and brand entertainment.",
    "Style exploration needs clear reviews without losing production speed.",
  ],
);

en.industries.items["commercial-product"] = industryItem(
  "Commercial Product",
  "CGI Animation for Commercial Products",
  "Product animation for jewelry, vapes, gadgets, packaging, and consumer goods, photoreal packshots and launch films that sell the product.",
  [
    "Physical shoots are expensive for every SKU, finish, and colorway.",
    "Buyers expect cinematic product detail online before they purchase.",
    "Marketing needs packshot and hero films that stay consistent across channels.",
    "Launch timelines leave little room for reshoots when materials change.",
  ],
);

de.industries.items["brand-entertainment"] = industryItem(
  "Brand & Entertainment",
  "CGI Animation für Brand & Entertainment",
  "Character Animation, Cartoons, VTuber und Entertainment Filme für Marken, die expressive Motion jenseits industrieller Produktstories brauchen.",
  [
    "Kampagnen brauchen character driven Motion, die trotzdem premium und on brand wirkt.",
    "Entertainment Assets müssen schnell für Social, Ads und Launch Filme geliefert werden.",
    "Teams wollen ein Studio, das zwischen Industrial CGI und Brand Entertainment wechseln kann.",
    "Style Exploration braucht klare Reviews ohne Tempo zu verlieren.",
  ],
);

de.industries.items["commercial-product"] = industryItem(
  "Commercial Product",
  "CGI Animation für Commercial Products",
  "Produktanimation für Jewelry, Vapes, Gadgets, Packaging und Consumer Goods, photoreale Packshots und Launch Filme, die verkaufen.",
  [
    "Physische Shoots sind teuer für jede SKU, Finish und Colorway.",
    "Käufer erwarten online filmische Produktdetails vor dem Kauf.",
    "Marketing braucht Packshot und Hero Filme, die über Kanäle konsistent bleiben.",
    "Launch Timelines lassen wenig Raum für Reshoots bei Materialänderungen.",
  ],
);

en.caseStudies.items.ijockey = {
  title: "iJockey, CGI product renders built for brand and booth",
  summary: "Trade show ready CGI product visualization that pairs branded storytelling with clear product presence.",
  problem: "iJockey needed product visuals that could work for brand presentation and trade show contexts without a heavy live production setup.",
  process: "We shaped CGI product renders and motion that highlighted form, finish, and brand presence, then delivered booth and digital ready outputs.",
  constraints: "The film had to stay product accurate while carrying entertainment grade polish for brand channels.",
  result: "A versatile CGI product film the team could use across presentations and trade show storytelling.",
};
en.caseStudies.items["autoz-crave"] = {
  title: "Autoz Crave, mechanical product animation that clarifies motion",
  summary: "Industrial mechanical CGI that shows how the product moves and why the engineering matters.",
  problem: "Autoz Crave needed technical product animation that communicated mechanical function clearly to partners and buyers.",
  process: "We built mechanical animation passes focused on motion readability, lighting, and commercial pacing for industrial storytelling.",
  constraints: "Engineering clarity and commercial finish had to coexist in one short film.",
  result: "A mechanical CGI film suited for sales enablement and industrial product presentation.",
};
en.caseStudies.items.credex = {
  title: "Credex, cleaning equipment CGI with cinematic SFX",
  summary: "Industrial product animation for Credex carpet cleaning equipment with polished sound and motion.",
  problem: "Credex needed a product film that showed equipment capability with commercial energy, not only a static render pack.",
  process: "We animated the machine with cinematic camera work and SFX finish for marketing and product storytelling.",
  constraints: "Product readability had to survive dynamic motion and sound design polish.",
  result: "A finished industrial product film ready for digital campaigns and sales use.",
};

de.caseStudies.items.ijockey = {
  title: "iJockey, CGI Produktrender für Brand und Stand",
  summary: "Messetaugliche CGI Produktvisualisierung mit Brand Storytelling und klarer Produktpräsenz.",
  problem: "iJockey brauchte Produktvisuals für Brand Präsentation und Messe, ohne schwere Live Produktion.",
  process: "Wir entwickelten CGI Produktrender und Motion mit Fokus auf Form, Finish und Brand Presence.",
  constraints: "Das Filmstück musste produkttreu bleiben und gleichzeitig Entertainment Polishing für Brand Kanäle tragen.",
  result: "Ein vielseitiger CGI Produktfilm für Präsentationen und Messestorytelling.",
};
de.caseStudies.items["autoz-crave"] = {
  title: "Autoz Crave, mechanische Produktanimation mit klarer Motion",
  summary: "Industrielle mechanische CGI, die zeigt, wie das Produkt bewegt und warum Engineering zählt.",
  problem: "Autoz Crave brauchte technische Produktanimation, die mechanische Funktion klar kommuniziert.",
  process: "Wir bauten mechanische Animation mit Fokus auf Lesbarkeit, Lighting und kommerziellem Pacing.",
  constraints: "Engineering Klarheit und kommerzielles Finish mussten in einem kurzen Film zusammenpassen.",
  result: "Ein mechanischer CGI Film für Sales Enablement und industrielle Produktpräsentation.",
};
de.caseStudies.items.credex = {
  title: "Credex, Reinigungsgeräte CGI mit filmischem SFX",
  summary: "Industrielle Produktanimation für Credex Teppichreinigungsgeräte mit Sound und Motion Finish.",
  problem: "Credex brauchte einen Produktfilm, der Gerätetalente mit kommerzieller Energie zeigt.",
  process: "Wir animierten die Maschine mit filmischer Kamera und SFX Finish für Marketing und Produktstory.",
  constraints: "Produktlesbarkeit musste dynamische Motion und Sound Design überstehen.",
  result: "Ein fertiger Industrieproduktfilm für digitale Kampagnen und Vertrieb.",
};

en.works = en.works || {};
en.works.clients = en.works.clients || {};
en.works.clients.branding = en.works.clients.branding || {};
en.works.clients.branding.ijockey = {
  name: "IJOCKEY",
  industry: "Brand & Industrial CGI",
  description:
    "iJockey CGI product renders and trade show style films combining branded storytelling with industrial product visualization.",
  timeline: "2025",
  services: { "0": "CGI Product Renders", "1": "Trade Show Films", "2": "Brand CGI" },
  tools: { "0": "Cinema 4D", "1": "Blender", "2": "After Effects" },
};
en.works.projects = en.works.projects || {};
en.works.projects["ijockey-p1"] = {
  title: "iJockey CGI Product Film",
  description:
    "CGI product render and motion film for iJockey, built for trade show and brand presentation use.",
  tags: { "0": "iJockey", "1": "CGI", "2": "Trade Show" },
};

de.works = de.works || {};
de.works.clients = de.works.clients || {};
de.works.clients.branding = de.works.clients.branding || {};
de.works.clients.branding.ijockey = {
  name: "IJOCKEY",
  industry: "Brand & Industrial CGI",
  description:
    "iJockey CGI Produktrender und messetaugliche Filme, die Brand Storytelling mit industrieller Produktvisualisierung verbinden.",
  timeline: "2025",
  services: { "0": "CGI Produktrender", "1": "Messefilme", "2": "Brand CGI" },
  tools: { "0": "Cinema 4D", "1": "Blender", "2": "After Effects" },
};
de.works.projects = de.works.projects || {};
de.works.projects["ijockey-p1"] = {
  title: "iJockey CGI Produktfilm",
  description:
    "CGI Produktrender und Motion Film für iJockey, gebaut für Messe und Brand Präsentation.",
  tags: { "0": "iJockey", "1": "CGI", "2": "Messe" },
};

en.servicesPage.detailsNav.prev = "Previous";
en.servicesPage.detailsNav.next = "Next";
en.servicesPage.detailsNav.gallery = "Project gallery";
de.servicesPage.detailsNav.prev = "Zurück";
de.servicesPage.detailsNav.next = "Weiter";
de.servicesPage.detailsNav.gallery = "Projektgalerie";

fs.writeFileSync(enPath, `${JSON.stringify(en, null, 2)}\n`);
fs.writeFileSync(dePath, `${JSON.stringify(de, null, 2)}\n`);
console.log("locale patches written");
