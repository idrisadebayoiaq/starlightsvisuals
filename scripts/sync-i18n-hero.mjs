import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "..", "src", "locales");

/** Hero copy translations — overwrites stale English placeholders in locale files. */
const heroByLang = {
  de: {
    heroScript: "Geschichten in Bewegung —",
    heroTitle1: "ANIMATIONEN",
    heroTitle2: "UND VFX",
    heroBody:
      "Starlights Visuals erweckt Geschichten mit Animation und visuellen Effekten zum Leben, die Publikum fesseln und jeden Frame aufwerten. Wir animieren Fantasy-Kreaturen, menschliche Charaktere, Fahrzeuge, Umgebungen, Requisiten und Hard-Surface-Objekte — für Film, Serien, Werbung und Markenkampagnen.",
  },
  fr: {
    heroScript: "Des histoires en mouvement —",
    heroTitle1: "ANIMATION",
    heroTitle2: "& VFX",
    heroBody:
      "Starlights Visuals donne vie aux histoires grâce à l'animation et aux effets visuels qui captivent le public et subliment chaque image. Nous animons créatures fantastiques, personnages humains, véhicules, environnements, accessoires et objets hard-surface — pour le cinéma, la série, la publicité et les campagnes de marque.",
  },
  es: {
    heroScript: "Historias en movimiento —",
    heroTitle1: "ANIMACIÓN",
    heroTitle2: "Y VFX",
    heroBody:
      "Starlights Visuals da vida a las historias con animación y efectos visuales que cautivan al público y elevan cada fotograma. Animamos criaturas fantásticas, personajes humanos, vehículos, entornos, utilería y objetos de superficie dura — para cine, series, publicidad y campañas de marca.",
  },
  pt: {
    heroScript: "Histórias em movimento —",
    heroTitle1: "ANIMAÇÃO",
    heroTitle2: "& VFX",
    heroBody:
      "A Starlights Visuals dá vida a histórias com animação e efeitos visuais que cativam o público e elevam cada frame. Animamos criaturas fantásticas, personagens humanos, veículos, ambientes, adereços e objetos hard-surface — para cinema, séries, publicidade e campanhas de marca.",
  },
  it: {
    heroScript: "Storie in movimento —",
    heroTitle1: "ANIMAZIONE",
    heroTitle2: "& VFX",
    heroBody:
      "Starlights Visuals dà vita alle storie con animazione ed effetti visivi che catturano il pubblico e valorizzano ogni fotogramma. Animi creature fantasy, personaggi umani, veicoli, ambienti, oggetti di scena e hard-surface — per cinema, serie, pubblicità e campagne di brand.",
  },
  ja: {
    heroScript: "動く物語 —",
    heroTitle1: "アニメーション",
    heroTitle2: "& VFX",
    heroBody:
      "Starlights Visualsは、アニメーションとビジュアルエフェクトで物語に命を吹き込み、観客を魅了し、すべてのフレームを高めます。ファンタジーの生き物、人間キャラクター、乗り物、環境、小道具、ハードサーフェスオブジェクトをアニメーション化 — 映画、シリーズ、広告、ブランドキャンペーン向けに。",
  },
  ko: {
    heroScript: "움직이는 이야기 —",
    heroTitle1: "애니메이션",
    heroTitle2: "& VFX",
    heroBody:
      "Starlights Visuals는 애니메이션과 시각 효과로 이야기에 생명을 불어넣어 관객을 사로잡고 모든 프레임을 한층 끌어올립니다. 판타지 생물, 인간 캐릭터, 차량, 환경, 소품, 하드 서페이스 오브젝트를 애니메이션화합니다 — 영화, 시리즈, 광고, 브랜드 캠페인을 위해.",
  },
  zh: {
    heroScript: "故事在动 —",
    heroTitle1: "动画",
    heroTitle2: "& VFX",
    heroBody:
      "Starlights Visuals 用动画与视觉特效让故事鲜活起来，吸引观众并提升每一帧。我们为电影、剧集、广告与品牌活动制作奇幻生物、人物、载具、环境、道具与硬表面物体的动画。",
  },
  ar: {
    heroScript: "قصص في حركة —",
    heroTitle1: "الرسوم المتحركة",
    heroTitle2: "والمؤثرات البصرية",
    heroBody:
      "تُحيي Starlights Visuals القصص بالرسوم المتحركة والمؤثرات البصرية التي تأسر الجمهور وترفع كل إطار. نُحرّك مخلوقات خيالية وشخصيات بشرية ومركبات وبيئات ودعائم وأجسام hard-surface — للأفلام والمسلسلات والإعلانات وحملات العلامات التجارية.",
  },
  ru: {
    heroScript: "Истории в движении —",
    heroTitle1: "АНИМАЦИЯ",
    heroTitle2: "И VFX",
    heroBody:
      "Starlights Visuals оживляет истории с помощью анимации и визуальных эффектов, которые захватывают зрителей и поднимают каждый кадр. Мы анимируем фантастических существ, человеческих персонажей, транспорт, окружение, реквизит и hard-surface объекты — для кино, сериалов, рекламы и брендовых кампаний.",
  },
  nl: {
    heroScript: "Verhalen in beweging —",
    heroTitle1: "ANIMATIE",
    heroTitle2: "& VFX",
    heroBody:
      "Starlights Visuals brengt verhalen tot leven met animatie en visuele effecten die het publiek boeien en elk frame verheffen. We animeren fantasy-wezens, menselijke personages, voertuigen, omgevingen, props en hard-surface objecten — voor film, series, reclame en merkcampagnes.",
  },
  pl: {
    heroScript: "Historie w ruchu —",
    heroTitle1: "ANIMACJA",
    heroTitle2: "I VFX",
    heroBody:
      "Starlights Visuals ożywia historie animacją i efektami wizualnymi, które urzekają widzów i podnoszą każdą klatkę. Animujemy fantasy stworzenia, ludzkie postacie, pojazdy, środowiska, rekwizyty i obiekty hard-surface — na potrzeby filmu, seriali, reklam i kampanii marki.",
  },
  tr: {
    heroScript: "Hareket halindeki hikâyeler —",
    heroTitle1: "ANİMASYON",
    heroTitle2: "VE VFX",
    heroBody:
      "Starlights Visuals, izleyicileri büyüleyen ve her kareyi yükselten animasyon ve görsel efektlerle hikâyelere hayat verir. Fantastik yaratıklar, insan karakterler, araçlar, ortamlar, aksesuarlar ve hard-surface nesneleri canlandırıyoruz — film, dizi, reklam ve marka kampanyaları için.",
  },
  hi: {
    heroScript: "गति में कहानियाँ —",
    heroTitle1: "एनिमेशन",
    heroTitle2: "और VFX",
    heroBody:
      "Starlights Visuals एनिमेशन और विज़ुअल इफ़ेक्ट्स के साथ कहानियों को जीवंत करता है, जो दर्शकों को मोहित करते हैं और हर फ्रेम को ऊँचा उठाते हैं। हम फंतासी प्राणियों, मानव पात्रों, वाहनों, वातावरण, प्रॉप्स और hard-surface ऑब्जेक्ट्स को एनिमेट करते हैं — फिल्म, सीरीज़, विज्ञापन और ब्रांड अभियानों के लिए।",
  },
  sv: {
    heroScript: "Berättelser i rörelse —",
    heroTitle1: "ANIMATION",
    heroTitle2: "& VFX",
    heroBody:
      "Starlights Visuals väcker berättelser till liv med animation och visuella effekter som fängslar publiken och lyfter varje bildruta. Vi animerar fantasy-varelser, mänskliga karaktärer, fordon, miljöer, rekvisita och hard-surface-objekt — för film, serier, reklam och varumärkeskampanjer.",
  },
  da: {
    heroScript: "Historier i bevægelse —",
    heroTitle1: "ANIMATION",
    heroTitle2: "& VFX",
    heroBody:
      "Starlights Visuals vækker historier til live med animation og visuelle effekter, der fænger publikum og løfter hver enkelt frame. Vi animerer fantasy-væsener, menneskelige karakterer, køretøjer, miljøer, rekvisitter og hard-surface-objekter — til film, serier, reklame og brandkampagner.",
  },
  no: {
    heroScript: "Historier i bevegelse —",
    heroTitle1: "ANIMASJON",
    heroTitle2: "& VFX",
    heroBody:
      "Starlights Visuals bringer historier til live med animasjon og visuelle effekter som fenger publikum og løfter hver eneste frame. Vi animerer fantasy-skapninger, menneskelige karakterer, kjøretøy, miljøer, rekvisitter og hard-surface-objekter — for film, serier, reklame og merkevarekampanjer.",
  },
  fi: {
    heroScript: "Tarinoita liikkeessä —",
    heroTitle1: "ANIMAATIO",
    heroTitle2: "& VFX",
    heroBody:
      "Starlights Visuals herättää tarinat eloon animaatiolla ja visuaalisilla efeteillä, jotka vangitsevat yleisön ja nostavat jokaisen ruudun tasoa. Animoimme fantasiaolentoja, ihmishahmoja, ajoneuvoja, ympäristöjä, rekvisiittaa ja hard-surface-objekteja — elokuviin, sarjoihin, mainontaan ja brändikampanjoihin.",
  },
  id: {
    heroScript: "Cerita bergerak —",
    heroTitle1: "ANIMASI",
    heroTitle2: "& VFX",
    heroBody:
      "Starlights Visuals menghidupkan cerita dengan animasi dan efek visual yang memikat audiens dan mengangkat setiap frame. Kami menganimasikan makhluk fantasi, karakter manusia, kendaraan, lingkungan, properti, dan objek hard-surface — untuk film, serial, iklan, dan kampanye merek.",
  },
  th: {
    heroScript: "เรื่องราวที่เคลื่อนไหว —",
    heroTitle1: "แอนิเมชัน",
    heroTitle2: "& VFX",
    heroBody:
      "Starlights Visuals ทำให้เรื่องราวมีชีวิตด้วยแอนิเมชันและวิชวลเอฟเฟกต์ที่ดึงดูดผู้ชมและยกระดับทุกเฟรม เราสร้างแอนิเมชันสิ่งมีชีวิตแฟนตาซี ตัวละครมนุษย์ ยานพาหนะ สภาพแวดล้อม อุปกรณ์ประกอบฉาก และวัตถุ hard-surface — สำหรับภาพยนตร์ ซีรีส์ โฆษณา และแคมเปญแบรนด์",
  },
  vi: {
    heroScript: "Câu chuyện trong chuyển động —",
    heroTitle1: "HOẠT HÌNH",
    heroTitle2: "& VFX",
    heroBody:
      "Starlights Visuals thổi sức sống vào câu chuyện bằng hoạt hình và hiệu ứng hình ảnh thu hút khán giả và nâng tầm từng khung hình. Chúng tôi tạo hoạt hình cho sinh vật fantasy, nhân vật con người, phương tiện, môi trường, đạo cụ và vật thể hard-surface — cho phim, series, quảng cáo và chiến dịch thương hiệu.",
  },
  he: {
    heroScript: "סיפורים בתנועה —",
    heroTitle1: "אנימציה",
    heroTitle2: "& VFX",
    heroBody:
      "Starlights Visuals מחיה סיפורים באמצעות אנימציה ואפקטים ויזואליים שמקסימים את הקהל ומרימים כל פריים. אנו מנפישים יצורי פנטזיה, דמויות אנושיות, כלי רכב, סביבות, אביזרים ואובייקטי hard-surface — לקולנוע, סדרות, פרסום וקמפיינים ממותגים.",
  },
  uk: {
    heroScript: "Історії в русі —",
    heroTitle1: "АНІМАЦІЯ",
    heroTitle2: "ТА VFX",
    heroBody:
      "Starlights Visuals оживлює історії за допомогою анімації та візуальних ефектів, які захоплюють глядачів і піднімають кожен кадр. Ми анімуємо фантастичних істот, людських персонажів, транспорт, середовища, реквізит і hard-surface об'єкти — для кіно, серіалів, реклами та брендових кампаній.",
  },
  cs: {
    heroScript: "Příběhy v pohybu —",
    heroTitle1: "ANIMACE",
    heroTitle2: "A VFX",
    heroBody:
      "Starlights Visuals oživuje příběhy animací a vizuálními efekty, které zaujmou publikum a pozvednou každý snímek. Animujeme fantasy bytosti, lidské postavy, vozidla, prostředí, rekvizity a hard-surface objekty — pro film, seriály, reklamu a brandové kampaně.",
  },
};

for (const lang of fs.readdirSync(localesDir)) {
  if (lang === "en") continue;

  const hero = heroByLang[lang];
  if (!hero) {
    console.warn(`No hero translations for ${lang}, skipping`);
    continue;
  }

  const filePath = path.join(localesDir, lang, "common.json");
  const locale = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (!locale.home) locale.home = {};
  Object.assign(locale.home, hero);

  fs.writeFileSync(filePath, `${JSON.stringify(locale, null, 2)}\n`, "utf8");
  console.log(`Updated hero copy in ${lang}/common.json`);
}

console.log("Done syncing hero i18n keys.");
