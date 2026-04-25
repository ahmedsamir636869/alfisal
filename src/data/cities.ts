// Programmatic SEO — Location data for /services/[city] pages.
// Each entry carries city-specific content so pages are genuinely
// differentiated (skill principle: unique value per page).

export interface CityData {
  /** URL slug, e.g. "riyadh" */
  slug: string;
  /** Display name (English) */
  name: string;
  /** Display name (Arabic) */
  nameAr: string;
  /** Country */
  country: string;
  countryAr: string;
  /** ISO country code */
  countryCode: "SA" | "AE" | "QA" | "KW" | "BH" | "OM";
  /** One-sentence city construction market insight — used in intro */
  marketInsight: string;
  marketInsightAr: string;
  /** Dominant project type in this city */
  dominantSector: string;
  dominantSectorAr: string;
  /** Landmark or notable feature that establishes local credibility */
  landmark: string;
  landmarkAr: string;
  /** Page-level meta description */
  metaDescription: string;
  /** Representative hero image from Supabase storage or placeholder */
  imageHint: string;
  /** Approximate lat/lng for LocalBusiness schema */
  geo: { lat: number; lng: number };
}

export const CITIES: CityData[] = [
  {
    slug: "riyadh",
    name: "Riyadh",
    nameAr: "الرياض",
    country: "Saudi Arabia",
    countryAr: "المملكة العربية السعودية",
    countryCode: "SA",
    marketInsight:
      "Riyadh is in the midst of the world's most ambitious urban transformation — Vision 2030 is reshaping the skyline from King Abdullah Financial District to the new Cultural Mile.",
    marketInsightAr:
      "الرياض في خضم أكبر تحول عمراني في التاريخ — رؤية 2030 تعيد رسم الأفق من مركز الملك عبدالله المالي إلى الميل الثقافي.",
    dominantSector: "Commercial & Mixed-Use",
    dominantSectorAr: "تجاري ومتعدد الاستخدامات",
    landmark: "King Abdullah Financial District",
    landmarkAr: "مركز الملك عبدالله المالي",
    metaDescription:
      "Alfisal delivers landmark architecture and construction in Riyadh — from commercial towers to residential compounds aligned with Vision 2030.",
    imageHint: "riyadh skyline construction",
    geo: { lat: 24.7136, lng: 46.6753 },
  },
  {
    slug: "jeddah",
    name: "Jeddah",
    nameAr: "جدة",
    country: "Saudi Arabia",
    countryAr: "المملكة العربية السعودية",
    countryCode: "SA",
    marketInsight:
      "Jeddah's Corniche expansion and the Jeddah Tower project signal a coastal city redefining its vertical ambition while preserving its UNESCO-listed historic core.",
    marketInsightAr:
      "توسعة كورنيش جدة ومشروع برج جدة يؤشران إلى مدينة ساحلية تعيد تعريف طموحها العمودي مع الحفاظ على نواتها التاريخية المدرجة في اليونسكو.",
    dominantSector: "Hospitality & Coastal Residential",
    dominantSectorAr: "ضيافة وسكن ساحلي",
    landmark: "Jeddah Corniche & Historic District",
    landmarkAr: "كورنيش جدة والمنطقة التاريخية",
    metaDescription:
      "Alfisal delivers architecture and construction projects in Jeddah — hospitality towers, coastal villas, and mixed-use developments on the Red Sea.",
    imageHint: "jeddah coastline architecture",
    geo: { lat: 21.4858, lng: 39.1925 },
  },
  {
    slug: "dammam",
    name: "Dammam",
    nameAr: "الدمام",
    country: "Saudi Arabia",
    countryAr: "المملكة العربية السعودية",
    countryCode: "SA",
    marketInsight:
      "Dammam and the Eastern Province are evolving from a petroleum hub into a diversified industrial and logistics corridor, driving demand for modern facilities and workforce housing.",
    marketInsightAr:
      "الدمام والمنطقة الشرقية تتحول من مركز نفطي إلى ممر صناعي ولوجستي متنوع، ما يدفع الطلب على المرافق الحديثة والإسكان.",
    dominantSector: "Industrial & Logistics",
    dominantSectorAr: "صناعي ولوجستي",
    landmark: "King Fahd Causeway Corridor",
    landmarkAr: "ممر جسر الملك فهد",
    metaDescription:
      "Alfisal provides architecture and construction expertise in Dammam and the Eastern Province — industrial facilities, logistics parks, and residential developments.",
    imageHint: "dammam industrial construction",
    geo: { lat: 26.4207, lng: 50.0888 },
  },
  {
    slug: "dubai",
    name: "Dubai",
    nameAr: "دبي",
    country: "United Arab Emirates",
    countryAr: "الإمارات العربية المتحدة",
    countryCode: "AE",
    marketInsight:
      "Dubai's construction pipeline remains one of the region's most active — with entire new districts (Dubai Creek Harbour, Palm Jebel Ali) rising from land reclamation.",
    marketInsightAr:
      "خط أنابيب البناء في دبي يبقى من أكثر خطوط المنطقة نشاطاً — مع ظهور مجمعات جديدة بأكملها كميناء دبي كريك وبالم جبل علي.",
    dominantSector: "Luxury Residential & Hospitality",
    dominantSectorAr: "سكني فاخر وضيافة",
    landmark: "Dubai Creek Harbour",
    landmarkAr: "ميناء خور دبي",
    metaDescription:
      "Alfisal delivers high-end architecture and construction in Dubai — luxury residential towers, hospitality projects, and bespoke commercial fit-outs.",
    imageHint: "dubai luxury architecture towers",
    geo: { lat: 25.2048, lng: 55.2708 },
  },
  {
    slug: "abu-dhabi",
    name: "Abu Dhabi",
    nameAr: "أبوظبي",
    country: "United Arab Emirates",
    countryAr: "الإمارات العربية المتحدة",
    countryCode: "AE",
    marketInsight:
      "Abu Dhabi's Guggenheim, Zayed National Museum, and Saadiyat Cultural District make it the Gulf's most design-sensitive market for cultural and civic architecture.",
    marketInsightAr:
      "متحف غوغنهايم ومتحف زايد الوطني ومنطقة سعديات الثقافية يجعل أبوظبي أكثر أسواق الخليج حساسية للتصميم للعمارة الثقافية والمدنية.",
    dominantSector: "Civic & Cultural Architecture",
    dominantSectorAr: "عمارة مدنية وثقافية",
    landmark: "Saadiyat Cultural District",
    landmarkAr: "منطقة سعديات الثقافية",
    metaDescription:
      "Alfisal brings design excellence to architecture and construction in Abu Dhabi — civic institutions, cultural facilities, and premium residential projects.",
    imageHint: "abu dhabi cultural architecture",
    geo: { lat: 24.4539, lng: 54.3773 },
  },
  {
    slug: "doha",
    name: "Doha",
    nameAr: "الدوحة",
    country: "Qatar",
    countryAr: "قطر",
    countryCode: "QA",
    marketInsight:
      "Post-FIFA Qatar is channelling its infrastructure momentum into leisure, education, and research campuses, creating opportunities for landmark institutional buildings.",
    marketInsightAr:
      "قطر ما بعد كأس العالم تحوّل زخمها إلى مشاريع ترفيه وتعليم وأبحاث، مما يفتح الباب أمام مبانٍ مؤسسية بارزة.",
    dominantSector: "Institutional & Education",
    dominantSectorAr: "مؤسسي وتعليمي",
    landmark: "Education City, Lusail",
    landmarkAr: "مدينة التعليم، لوسيل",
    metaDescription:
      "Alfisal supports architecture and construction projects in Doha — from Education City campuses to luxury towers on the Lusail waterfront.",
    imageHint: "doha lusail waterfront construction",
    geo: { lat: 25.2854, lng: 51.531 },
  },
  {
    slug: "kuwait-city",
    name: "Kuwait City",
    nameAr: "مدينة الكويت",
    country: "Kuwait",
    countryAr: "الكويت",
    countryCode: "KW",
    marketInsight:
      "Kuwait City's master development plan targets waterfront regeneration and mixed-use corridors, moving the market beyond pure office towers toward lifestyle destinations.",
    marketInsightAr:
      "تستهدف خطة الكويت الرئيسية تجديد الواجهة البحرية وممرات متعددة الاستخدام، لتنتقل السوق من المكاتب البحتة نحو وجهات أسلوب الحياة.",
    dominantSector: "Mixed-Use & Waterfront",
    dominantSectorAr: "متعدد الاستخدامات وواجهة بحرية",
    landmark: "Kuwait Bay Waterfront",
    landmarkAr: "واجهة خليج الكويت",
    metaDescription:
      "Alfisal provides architecture and construction services in Kuwait City — waterfront developments, commercial complexes, and premium residential projects.",
    imageHint: "kuwait city waterfront development",
    geo: { lat: 29.3759, lng: 47.9774 },
  },
  {
    slug: "muscat",
    name: "Muscat",
    nameAr: "مسقط",
    country: "Oman",
    countryAr: "عُمان",
    countryCode: "OM",
    marketInsight:
      "Muscat's Oman Vision 2040 prioritises sustainable tourism infrastructure and low-density residential, demanding architecture that respects the dramatic landscape.",
    marketInsightAr:
      "رؤية عُمان 2040 تُولي الأولوية للبنية التحتية للسياحة المستدامة والسكن منخفض الكثافة، مما يستدعي عمارة تحترم المشهد الطبيعي المدهش.",
    dominantSector: "Eco & Boutique Hospitality",
    dominantSectorAr: "ضيافة صديقة للبيئة وراقية",
    landmark: "Muscat Old Town & Royal Opera House",
    landmarkAr: "مسقط القديمة ودار الأوبرا الملكية",
    metaDescription:
      "Alfisal delivers sensitive architecture and construction in Muscat — eco-lodges, boutique hotels, and residential villas designed for Oman's dramatic landscape.",
    imageHint: "muscat oman architecture landscape",
    geo: { lat: 23.5859, lng: 58.4059 },
  },
];

/** Look up a city by its URL slug */
export function getCityBySlug(slug: string): CityData | undefined {
  return CITIES.find((c) => c.slug === slug);
}

/** All city slugs — used for generateStaticParams */
export const CITY_SLUGS = CITIES.map((c) => c.slug);
