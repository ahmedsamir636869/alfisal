import { createClient as createBrowserClient } from "@/utils/supabase/client";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ContentBlock {
  id: string;
  section: string;
  key: string;
  value: string;
  value_ar: string | null;
  type: "text" | "textarea" | "url" | "email" | "phone";
  label: string;
  created_at: string;
  updated_at: string;
}

export interface ContentImage {
  id: string;
  section: string;
  key: string;
  url: string;
  alt: string;
  alt_ar: string | null;
  label: string;
  created_at: string;
  updated_at: string;
}

export interface LocalizedString {
  en: string;
  ar?: string;
}

export interface LocalizedImage {
  url: string;
  alt: LocalizedString;
}

export interface ContentValue {
  en: string;
  ar?: string;
  type: ContentBlock["type"];
  label: string;
}

// ── Section Definitions (default content) ──────────────────────────────────────

export const DEFAULT_CONTENT: Record<string, Record<string, ContentValue>> = {
  hero: {
    subtitle:     { en: "Structural Precision Since 1995", ar: "هندسة بدقة منذ ١٩٩٥", type: "text", label: "Eyebrow / Subtitle" },
    title_line1:  { en: "Architecture",                    ar: "عمارة",            type: "text", label: "Display Title — Line 1" },
    title_line2:  { en: "of consequence",                  ar: "ذات أثر",           type: "text", label: "Display Title — Line 2 (italic)" },
    lead:         { en: "We build landmark interiors, civic buildings, and private estates where structural intent and material restraint meet. Every project is measured, detailed, and signed.",
                    ar: "نبني فضاءات داخلية مميّزة ومبانٍ عامّة وبيوتاً خاصّة تلتقي فيها الفكرة الإنشائية مع تقتير المواد. كلّ مشروع مدروسٌ ومُفصَّلٌ وموقَّع.",
                    type: "textarea", label: "Lead Paragraph" },
    cta_primary:  { en: "Browse the portfolio",            ar: "تصفّح أعمالنا",     type: "text", label: "Primary Button" },
    cta_secondary:{ en: "Read the studio",                 ar: "تعرّف على الاستوديو", type: "text", label: "Secondary Button" },
    slider_before_label: { en: "Before",  ar: "قبل",  type: "text", label: "Slider — Before Label" },
    slider_after_label:  { en: "After",   ar: "بعد",   type: "text", label: "Slider — After Label" },
    slider_video_url:    { en: "",        ar: "",      type: "url",  label: "Slider — After Video URL (mp4)" },
    stat1_number: { en: "150",                             ar: "١٥٠",              type: "text", label: "Stat 01 — Number" },
    stat1_suffix: { en: "+",                               ar: "+",                type: "text", label: "Stat 01 — Suffix (e.g. +, %)" },
    stat1_label:  { en: "Landmark Projects",               ar: "مشروعاً مميّزاً",    type: "text", label: "Stat 01 — Label" },
    stat2_number: { en: "30",                              ar: "٣٠",               type: "text", label: "Stat 02 — Number" },
    stat2_suffix: { en: "",                                ar: "",                 type: "text", label: "Stat 02 — Suffix" },
    stat2_label:  { en: "Years of Practice",               ar: "عاماً من الممارسة",  type: "text", label: "Stat 02 — Label" },
    stat3_number: { en: "22",                              ar: "٢٢",               type: "text", label: "Stat 03 — Number" },
    stat3_suffix: { en: "",                                ar: "",                 type: "text", label: "Stat 03 — Suffix" },
    stat3_label:  { en: "Countries Served",                ar: "دولة حول العالم",   type: "text", label: "Stat 03 — Label" },
  },
  values: {
    section_label:       { en: "01 — Operating Principles", ar: "٠١ — مبادئ العمل", type: "text", label: "Section Label" },
    section_title:       { en: "We build with the restraint of a surgeon and the patience of a cartographer.",
                           ar: "نبني بدقّة الجرّاح وصبر رسّام الخرائط.",
                           type: "textarea", label: "Section Title" },
    section_description: { en: "Three commitments shape every line we draw — from first sketch to final handover.",
                           ar: "ثلاثة تعهّدات ترسم كلّ خطٍّ في عملنا — من أوّل رسم حتى التسليم النهائي.",
                           type: "textarea", label: "Section Description" },
    card1_title: { en: "Engineering Excellence",  ar: "تميّز هندسي",       type: "text", label: "Principle 01 — Title" },
    card1_text:  { en: "Advanced BIM modeling and first-principles structural analysis, so every beam and joint is deliberate.",
                   ar: "نمذجة معلومات البناء المتقدّمة وتحليل إنشائي من المبادئ الأولى، فكلّ عارضةٍ ووصلة مدروسة.",
                   type: "textarea", label: "Principle 01 — Text" },
    card1_icon:  { en: "architecture",            ar: "architecture",     type: "text", label: "Principle 01 — Icon (legacy)" },
    card2_title: { en: "Material Restraint",      ar: "تقتير في المواد",    type: "text", label: "Principle 02 — Title" },
    card2_text:  { en: "Honest materials left to speak for themselves. Concrete, stone, timber and steel, detailed to age with grace.",
                   ar: "موادّ صادقة تُترك لتعبّر عن نفسها. خرسانة وحجر وخشب وفولاذ، مُفصَّلة لتشيخ بأناقة.",
                   type: "textarea", label: "Principle 02 — Text" },
    card2_icon:  { en: "eco",                     ar: "eco",              type: "text", label: "Principle 02 — Icon (legacy)" },
    card3_title: { en: "On Time, On Record",      ar: "في الموعد، بالتوثيق", type: "text", label: "Principle 03 — Title" },
    card3_text:  { en: "We publish programme, budget and progress to our clients every Friday. Discipline, not drama.",
                   ar: "ننشر البرنامج والميزانية والتقدّم لعملائنا كلّ جمعة. انضباط، لا انفعال.",
                   type: "textarea", label: "Principle 03 — Text" },
    card3_icon:  { en: "schedule",                ar: "schedule",         type: "text", label: "Principle 03 — Icon (legacy)" },
  },
  featured_projects: {
    section_label: { en: "02 — Selected Works",  ar: "٠٢ — أعمال مختارة", type: "text",     label: "Section Label" },
    section_title: { en: "Architectural landmarks", ar: "علامات معماريّة", type: "text",     label: "Section Title" },
    intro_text:    { en: "A short selection. The archive holds the rest.", ar: "مختاراتٌ قصيرة. والأرشيف يحوي البقيّة.", type: "textarea", label: "Intro Text (optional)" },
    project1_location:    { en: "Dubai, UAE",                 ar: "دبي، الإمارات",             type: "text",     label: "Project 1 Location (legacy)" },
    project1_title:       { en: "The Zenith Tower Lobby",     ar: "بهو برج الزينث",             type: "text",     label: "Project 1 Title (legacy)" },
    project1_description: { en: "A masterclass in interior structural design, featuring seamless transitions and custom glass fabrication.",
                            ar: "درس بليغ في التصميم الإنشائي الداخلي، بانتقالات سلسة وزجاجٍ مصنوع خصّيصاً.",
                            type: "textarea", label: "Project 1 Description (legacy)" },
    project1_badge:       { en: "Featured",                   ar: "مميّز",                      type: "text",     label: "Project 1 Badge (legacy)" },
    project1_category:    { en: "Commercial",                 ar: "تجاري",                      type: "text",     label: "Project 1 Category (legacy)" },
    project2_location:    { en: "Riyadh, Saudi Arabia",       ar: "الرياض، المملكة العربية السعودية", type: "text", label: "Project 2 Location (legacy)" },
    project2_title:       { en: "Axis Research Center",       ar: "مركز أكسس للأبحاث",          type: "text",     label: "Project 2 Title (legacy)" },
    project2_category:    { en: "Industrial",                 ar: "صناعي",                      type: "text",     label: "Project 2 Category (legacy)" },
    project3_location:    { en: "Abu Dhabi, UAE",             ar: "أبوظبي، الإمارات",            type: "text",     label: "Project 3 Location (legacy)" },
    project3_title:       { en: "Solarium Private Estate",    ar: "مَنزل سولاريوم الخاص",        type: "text",     label: "Project 3 Title (legacy)" },
    project3_category:    { en: "Residential",                ar: "سكني",                        type: "text",     label: "Project 3 Category (legacy)" },
  },
  cta_banner: {
    title:         { en: "Ready to construct your vision?", ar: "هل أنت مستعدّ لبناء رؤيتك؟", type: "text",     label: "Banner Title" },
    description:   { en: "Principals are available for complex project consultations worldwide. One thoughtful call before the first drawing.",
                     ar: "شركاء الاستوديو متاحون لاستشارات المشاريع المعقّدة حول العالم. مكالمة واحدة مدروسة قبل أوّل رسم.",
                     type: "textarea", label: "Banner Description" },
    cta_primary:   { en: "Start a conversation",            ar: "ابدأ المحادثة",    type: "text",     label: "Primary Button" },
    cta_secondary: { en: "Call the studio",                 ar: "اتّصل بالاستوديو",  type: "text",     label: "Secondary Button" },
    phone:         { en: "+966123456789",                   ar: "+966123456789",  type: "phone",    label: "Phone Number" },
  },
  navigation: {
    brand_name: { en: "Alfisal",   ar: "الفيصل",  type: "text", label: "Brand Name" },
    link1_text: { en: "Home",      ar: "الرئيسية", type: "text", label: "Link 1 Text" },
    link1_url:  { en: "/",         ar: "/",       type: "text", label: "Link 1 URL" },
    link2_text: { en: "Projects",  ar: "المشاريع", type: "text", label: "Link 2 Text" },
    link2_url:  { en: "/projects", ar: "/projects", type: "text", label: "Link 2 URL" },
    link3_text: { en: "Services",  ar: "الخدمات", type: "text", label: "Link 3 Text" },
    link3_url:  { en: "/services", ar: "/services", type: "text", label: "Link 3 URL" },
    link4_text: { en: "Studio",    ar: "الاستوديو", type: "text", label: "Link 4 Text" },
    link4_url:  { en: "/about",    ar: "/about",  type: "text", label: "Link 4 URL" },
    link5_text: { en: "Contact",   ar: "تواصل",   type: "text", label: "Link 5 Text" },
    link5_url:  { en: "/contact",  ar: "/contact", type: "text", label: "Link 5 URL" },
    cta_text:   { en: "Start a project", ar: "ابدأ مشروعاً", type: "text", label: "Nav CTA Label" },
    cta_url:    { en: "/contact",        ar: "/contact",   type: "text", label: "Nav CTA URL"   },
    logo_size:  { en: "32",             ar: "32",         type: "text", label: "Logo Size (px)" },
  },

  about: {
    page_title:       { en: "A studio of architects, engineers, and builders",
                        ar: "استوديو من المعماريّين والمهندسين والبنّائين",
                        type: "text",     label: "Page Title" },
    subtitle:         { en: "01 — The Studio",           ar: "٠١ — الاستوديو",    type: "text",     label: "Eyebrow" },
    intro_paragraph:  { en: "Founded in 1995, Alfisal practices at the intersection of structural rigour and editorial restraint. Our work spans civic buildings, commercial landmarks, and private estates across twenty-two countries.",
                        ar: "تأسّس الفيصل عام ١٩٩٥، ويمارس عمله عند تقاطع الصّرامة الإنشائية مع التّقتير التحريري. تمتدّ أعمالنا من المباني العامّة إلى المعالم التجاريّة والبيوت الخاصّة في اثنتين وعشرين دولة.",
                        type: "textarea", label: "Intro Paragraph (italic lead)" },
    mission_title:    { en: "Our mission",  ar: "مهمّتنا",   type: "text",     label: "Mission Title" },
    mission_text:     { en: "To build sustainable, innovative, and structurally sound landmarks that define modern skylines — and reward close inspection at the handrail.",
                        ar: "أن نبني معالم مستدامة ومبتكرة وسليمة إنشائياً تُعرّف خطوطَ سماء المدن الحديثة — وتُكافئ التمعّن عن قرب عند درابزين السّلم.",
                        type: "textarea", label: "Mission Text" },
    vision_title:     { en: "Our vision",   ar: "رؤيتنا",    type: "text",     label: "Vision Title" },
    vision_text:      { en: "Pioneering the future of construction through advanced engineering, honest materials, and an uncompromising attention to the joint.",
                        ar: "نريد أن نقود مستقبل البناء عبر هندسة متقدّمة وموادّ صادقة وعناية لا تتنازل عند تفاصيل الوصلة.",
                        type: "textarea", label: "Vision Text" },
    philosophy_title: { en: "Our philosophy", ar: "فلسفتنا",  type: "text",   label: "Philosophy Title (optional)" },
    philosophy_text:  { en: "We detail for a hundred years, not a warranty period. Buildings are public acts; they owe their streets more than compliance.",
                        ar: "نُفصّل لمئة عام، لا لفترة الضّمان. المباني فعلٌ عام، وهي مَدينةٌ لشوارعها بأكثر من مجرّد المطابقة.",
                        type: "textarea", label: "Philosophy Text (optional)" },

    stat1_number: { en: "30",  ar: "٣٠",   type: "text", label: "Stat 01 — Number" },
    stat1_suffix: { en: "",    ar: "",     type: "text", label: "Stat 01 — Suffix" },
    stat1_label:  { en: "Years of practice",   ar: "عاماً من الممارسة", type: "text", label: "Stat 01 — Label" },
    stat2_number: { en: "150", ar: "١٥٠",  type: "text", label: "Stat 02 — Number" },
    stat2_suffix: { en: "+",   ar: "+",    type: "text", label: "Stat 02 — Suffix" },
    stat2_label:  { en: "Projects delivered",  ar: "مشروعاً مُسلَّماً",   type: "text", label: "Stat 02 — Label" },
    stat3_number: { en: "22",  ar: "٢٢",   type: "text", label: "Stat 03 — Number" },
    stat3_suffix: { en: "",    ar: "",     type: "text", label: "Stat 03 — Suffix" },
    stat3_label:  { en: "Countries",            ar: "دولة",                type: "text", label: "Stat 03 — Label" },
    stat4_number: { en: "64",  ar: "٦٤",   type: "text", label: "Stat 04 — Number" },
    stat4_suffix: { en: "",    ar: "",     type: "text", label: "Stat 04 — Suffix" },
    stat4_label:  { en: "Industry awards",     ar: "جائزة في الصناعة",   type: "text", label: "Stat 04 — Label" },

    principle1_title: { en: "Material honesty",     ar: "صدق المادّة",      type: "text",     label: "Principle 01 — Title" },
    principle1_text:  { en: "Concrete, stone, timber, and steel — left to speak for themselves.",
                        ar: "خرسانة، حجر، خشب، وفولاذ — تُترك لتعبّر عن نفسها.",
                        type: "textarea", label: "Principle 01 — Text" },
    principle2_title: { en: "Structural clarity",   ar: "وضوح إنشائي",     type: "text",     label: "Principle 02 — Title" },
    principle2_text:  { en: "Every load path is legible; ornament follows calculation.",
                        ar: "كلّ مسار حِملٍ مقروء؛ والزخرفة تتبع الحساب.",
                        type: "textarea", label: "Principle 02 — Text" },
    principle3_title: { en: "Civic responsibility", ar: "مسؤوليّة مدنيّة",   type: "text",     label: "Principle 03 — Title" },
    principle3_text:  { en: "We build for cities, not only for clients. Buildings are public acts.",
                        ar: "نبني للمدن، لا للعملاء فقط. فالمباني فعلٌ عام.",
                        type: "textarea", label: "Principle 03 — Text" },
    principle4_title: { en: "Lifetime performance", ar: "أداء مدى الحياة",  type: "text",     label: "Principle 04 — Title" },
    principle4_text:  { en: "We detail for a hundred years, not a warranty period.",
                        ar: "نُفصّل لمئة عام، لا لفترة الضّمان.",
                        type: "textarea", label: "Principle 04 — Text" },

    principles_label:   { en: "02 — Principles",                              ar: "٠٢ — المبادئ",                       type: "text", label: "Principles Section — Label" },
    principles_heading: { en: "Four commitments that precede every drawing.", ar: "أربعة التزامات تسبق كل رسم.",           type: "text", label: "Principles Section — Heading" },

    cta_label:        { en: "Working together",                              ar: "نعمل معاً",                          type: "text", label: "Bottom CTA — Eyebrow" },
    cta_title:        { en: "Commission a project, or come work with us.",    ar: "كلّفنا بمشروع، أو انضمّ إلى الفريق.", type: "text", label: "Bottom CTA — Title" },
    cta_enquire_btn:  { en: "Enquire",                                       ar: "تواصل معنا",                         type: "text", label: "Bottom CTA — Enquire Button" },
    cta_see_work_btn: { en: "See the work",                                  ar: "استعرض أعمالنا",                     type: "text", label: "Bottom CTA — See Work Button" },
  },
  services: {
    page_title:      { en: "Services",                                 ar: "الخدمات",                          type: "text",     label: "Page Title" },
    page_subtitle:   { en: "01 — Practice Areas",                      ar: "٠١ — مجالات الممارسة",            type: "text",     label: "Eyebrow" },
    intro_paragraph: { en: "From first sketch to handover, Alfisal provides concept, engineering, construction management, and post-occupancy care as a single integrated practice.",
                       ar: "من أوّل رسمٍ حتى التسليم، يقدّم الفيصل التصوّر والهندسة وإدارة البناء والعناية بعد الإشغال كممارسةٍ واحدة متكاملة.",
                       type: "textarea", label: "Intro Paragraph" },
    cta_title:       { en: "Considering a project? Let's speak before the first drawing.",
                       ar: "هل تفكّر في مشروع؟ لنتحدّث قبل أوّل رسم.",
                       type: "text", label: "Bottom CTA Title" },
    cta_btn:         { en: "Start a brief",                                  ar: "ابدأ المشروع",                       type: "text", label: "Bottom CTA — Button" },
    empty_state:     { en: "No services published yet.",                     ar: "لا توجد خدمات منشورة بعد.",          type: "text", label: "Empty State Message" },
    service1_title:  { en: "Structural Engineering",                   ar: "الهندسة الإنشائية", type: "text",     label: "Service 1 Title (legacy)" },
    service1_desc:   { en: "Advanced BIM modeling and structural analysis for complex architectural designs.",
                       ar: "نمذجة معلومات البناء المتقدّمة وتحليلٌ إنشائي للتصاميم المعمارية المعقّدة.",
                       type: "textarea", label: "Service 1 Description (legacy)" },
    service2_title:  { en: "Commercial Construction",                  ar: "البناء التجاري",     type: "text",     label: "Service 2 Title (legacy)" },
    service2_desc:   { en: "End-to-end construction management for high-rise commercial real estate.",
                       ar: "إدارة بناء متكاملة من البداية إلى النهاية للعقارات التجاريّة الشاهقة.",
                       type: "textarea", label: "Service 2 Description (legacy)" },
    service3_title:  { en: "Sustainable Infrastructure",               ar: "البنية التحتية المستدامة", type: "text", label: "Service 3 Title (legacy)" },
    service3_desc:   { en: "Eco-friendly building practices and renewable energy integrations.",
                       ar: "ممارساتٌ بنائيّة صديقة للبيئة وتكاملٌ مع مصادر الطاقة المتجدّدة.",
                       type: "textarea", label: "Service 3 Description (legacy)" },
  },
  contact: {
    page_title:       { en: "Begin a correspondence",                               ar: "ابدأ مراسلة",                          type: "text",     label: "Page Title" },
    page_subtitle:    { en: "01 — Get in touch",                                    ar: "٠١ — تواصل معنا",                     type: "text",     label: "Eyebrow" },
    page_description: { en: "Write to us about a project, a job, or a visit to the studio. We read every message.",
                        ar: "اكتب إلينا عن مشروعٍ أو وظيفةٍ أو زيارة للاستوديو. نقرأ كلّ رسالة.",
                        type: "textarea", label: "Page Description" },
    form_title:       { en: "Send a brief",                                         ar: "أرسِل ملخّصاً",                        type: "text",     label: "Form — Eyebrow" },
    form_heading:     { en: "Tell us what you're building.",                        ar: "أخبرنا بما تبنيه.",                  type: "text",     label: "Form — Heading" },
    form_intro:       { en: "Share the broad shape of the project — location, scale, programme. We reply within one working day with first questions and next steps.",
                        ar: "شاركنا الملامح العامّة للمشروع — الموقع، الحجم، البرنامج. نردّ خلال يوم عمل واحد بأسئلتنا الأولى وخطواتنا التالية.",
                        type: "textarea", label: "Form — Intro" },
    contact_email:    { en: "info@alfisalcon.com",                                   ar: "info@alfisalcon.com",                   type: "email",    label: "Email" },
    contact_phone:    { en: "+966 12 345 6789",                                     ar: "+966 12 345 6789",                   type: "phone",    label: "Phone" },
    contact_address:  { en: "12 Industrial Park, Riyadh, Saudi Arabia",             ar: "١٢ المنطقة الصناعيّة، الرياض، السعوديّة", type: "text", label: "Studio Address" },
    hours_title:      { en: "Studio hours",                                         ar: "ساعات العمل",                        type: "text",     label: "Hours — Label" },
    hours_text:       { en: "Sun–Thu, 09:00 – 18:00 AST",                           ar: "الأحد–الخميس، ٩:٠٠ – ١٨:٠٠ بتوقيت الرياض", type: "text", label: "Hours — Value" },
    notify_email:     { en: "info@alfisalcon.com",                                  ar: "info@alfisalcon.com",               type: "email",    label: "Auto-forward submissions to this email" },
    auto_send_email:  { en: "true",                                                 ar: "true",                              type: "text",     label: "Auto-send email on submission (true/false)" },
  },
  projects: {
    page_title:      { en: "Selected works",                                        ar: "أعمال مختارة",                        type: "text",     label: "Page Title" },
    page_subtitle:   { en: "01 — The Archive",                                      ar: "٠١ — الأرشيف",                       type: "text",     label: "Eyebrow" },
    intro_paragraph: { en: "A chronological archive of completed projects, filterable by typology. Everything here was built, measured, and signed.",
                       ar: "أرشيف زمني لمشاريع مكتملة، يمكن تصفيته حسب النوع. كلّ ما هنا قد بُني وقِيس ووُقِّع.",
                       type: "textarea", label: "Intro Paragraph" },
  },
  footer: {
    brand_name:        { en: "Alfisal",                                  ar: "الفيصل",                              type: "text",     label: "Brand Name" },
    brand_description: { en: "An architecture and construction studio building landmarks where structural intent and material restraint meet. Concept, engineering, delivery.",
                         ar: "استوديو معمارٍ وبناءٍ يصنع معالم تلتقي فيها الفكرة الإنشائيّة بتقتير المواد. تصوّرٌ، هندسةٌ، تسليم.",
                         type: "textarea", label: "Brand Description" },
    footer_label:      { en: "Correspondence",                           ar: "للتواصل",                              type: "text",     label: "Footer Eyebrow" },
    footer_heading:    { en: "Let's put something well-made into the world.",
                         ar: "لِنُهدِ العالَم شيئاً مصنوعاً بإتقان.",
                         type: "text", label: "Footer Heading" },
    offices_title:     { en: "Studios",                                  ar: "الاستوديوهات",                        type: "text",     label: "Offices Column Title" },
    office1:           { en: "Riyadh — 12 Industrial Park",              ar: "الرياض — ١٢ المنطقة الصناعيّة",       type: "text",     label: "Studio 1 Text" },
    office1_url:       { en: "#",                                        ar: "#",                                  type: "text",     label: "Studio 1 URL" },
    office2:           { en: "Dubai — Zenith Tower, Level 45",           ar: "دبي — برج الزينث، الطابق ٤٥",         type: "text",     label: "Studio 2 Text" },
    office2_url:       { en: "#",                                        ar: "#",                                  type: "text",     label: "Studio 2 URL" },
    office3:           { en: "London — 15 Structural Avenue",            ar: "لندن — ١٥ شارع الإنشاء",              type: "text",     label: "Studio 3 Text" },
    office3_url:       { en: "#",                                        ar: "#",                                  type: "text",     label: "Studio 3 URL" },
    social1_url:       { en: "#",                                        ar: "#",                                  type: "text",     label: "Social Link 1 URL (legacy)" },
    social2_url:       { en: "#",                                        ar: "#",                                  type: "text",     label: "Social Link 2 URL (legacy)" },
    social3_url:       { en: "#",                                        ar: "#",                                  type: "text",     label: "Social Link 3 URL (legacy)" },
    resources_title:   { en: "Resources",                                ar: "المراجع",                              type: "text",     label: "Resources Title" },
    resource1_text:    { en: "Project archive",                          ar: "أرشيف المشاريع",                     type: "text",     label: "Resource 1 Text" },
    resource1_url:     { en: "/projects",                                ar: "/projects",                          type: "text",     label: "Resource 1 URL" },
    resource2_text:    { en: "Careers",                                  ar: "الوظائف",                              type: "text",     label: "Resource 2 Text" },
    resource2_url:     { en: "/about",                                   ar: "/about",                             type: "text",     label: "Resource 2 URL" },
    resource3_text:    { en: "Press",                                    ar: "الصحافة",                              type: "text",     label: "Resource 3 Text" },
    resource3_url:     { en: "#",                                        ar: "#",                                  type: "text",     label: "Resource 3 URL" },
    legal_title:       { en: "Legal",                                    ar: "قانوني",                              type: "text",     label: "Legal Title" },
    legal1_text:       { en: "Privacy",                                  ar: "الخصوصيّة",                            type: "text",     label: "Legal 1 Text" },
    legal1_url:        { en: "#",                                        ar: "#",                                  type: "text",     label: "Legal 1 URL" },
    legal2_text:       { en: "Terms",                                    ar: "الشروط",                               type: "text",     label: "Legal 2 Text" },
    legal2_url:        { en: "#",                                        ar: "#",                                  type: "text",     label: "Legal 2 URL" },
    copyright:         { en: "Alfisal Studio. All rights reserved.",     ar: "استوديو الفيصل. جميع الحقوق محفوظة.", type: "text",     label: "Copyright" },
    tagline1:          { en: "Build",                                    ar: "ابنِ",                                type: "text",     label: "Tagline 1 (legacy)" },
    tagline2:          { en: "Design",                                   ar: "صمّم",                                type: "text",     label: "Tagline 2 (legacy)" },
    tagline3:          { en: "Innovate",                                 ar: "ابتكر",                               type: "text",     label: "Tagline 3 (legacy)" },
  },
};

export const DEFAULT_IMAGES: Record<string, Record<string, { url: string; alt: string; alt_ar?: string; label: string }>> = {
  hero: {
    background: { url: "/hero-bg.jpg", alt: "Modern glass and steel skyscraper", alt_ar: "ناطحة سحاب من الزجاج والفولاذ", label: "Hero Background Image" },
    before_photo: { url: "/hero-bg.jpg", alt: "Before — construction site", alt_ar: "قبل — موقع البناء", label: "Slider — Before Photo" },
  },
  featured_projects: {
    project1_image: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_-sphk4kzMgjZa0jDOi6jQvbpH44yLaMMz6KKeh0pcndtpg-bPHDGqfvmUPunPPFyqW9_x7b52BXi2FudXCvIOyh1nYENP8aeWtQOiFK7gyCvpXt6J_JCgTgh0qL5Ew6gPAW0Fidssmcd-RpLlrKyDThO5kw9VuLbiiTk3JXokX-30JtEqaJGDA5LiXImLiIrB4AT8YhPSQHFrQJahgIoIV0NAtUCKas24lYhsyN5SOcGQix0xm_Hu-H7Ear8I8EEgsJrt3TH4C4",
      alt: "The Zenith Tower Lobby",
      alt_ar: "بهو برج الزينث",
      label: "Project 1 Image",
    },
    project2_image: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJc3LFGDv3qCmpnTMhWPm7pV2nr0osDwAuR9JmC9d86rlamnEFZlAOHnFZI_ZtnXsb5hs-V81JAHqPiv8O2C0JjNXZEn4bmH1ZATJPxhd4PgWZxs7cNiGzqtCM6kxEE1q-ITiKM_VUsZ81y1cFK4zfZ-FdQy9n0tI-ydln7-wAeEzDQw3QLHiNCQnhcUks6OkJOxsMDGA1NzbF8aXkZMWw9xa0CYapew-0XRNszwBxJzrycRIwvQggP122nw65ssho52sC-5N27WU",
      alt: "Axis Research Center",
      alt_ar: "مركز أكسس للأبحاث",
      label: "Project 2 Image",
    },
    project3_image: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfVKHOf6vlZNixVFR-XfXt-cL-xy2roO8oGEEQQnya6fytmSFGKE8kTDTgVKMD_O4XSoko3GUVWr3lTFGT25oPDv_SJN-EdPGof2LlXFNa_BdH90va1fnRgK6BDRPbpKAZgIuu4-l1jGybALtjrUpER0qWayZgXz-6j4EyTgafORl-xwuLjffbLhaMJe_42kHNCKfwDNu8n0zRR25LPmr5o_jG26Dq2CdCXUWjNllWAjkbFT3vjHcVQ2B3vKGu-vOlT3vl_o-_1uk",
      alt: "Solarium Private Estate",
      alt_ar: "مَنزل سولاريوم الخاص",
      label: "Project 3 Image",
    },
  },
  navigation: {
    logo: { url: "/logo.png", alt: "Alfisal Logo", alt_ar: "شعار الفيصل", label: "Site Logo" },
  },
  about: {
    hero_image: { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfVKHOf6vlZNixVFR-XfXt-cL-xy2roO8oGEEQQnya6fytmSFGKE8kTDTgVKMD_O4XSoko3GUVWr3lTFGT25oPDv_SJN-EdPGof2LlXFNa_BdH90va1fnRgK6BDRPbpKAZgIuu4-l1jGybALtjrUpER0qWayZgXz-6j4EyTgafORl-xwuLjffbLhaMJe_42kHNCKfwDNu8n0zRR25LPmr5o_jG26Dq2CdCXUWjNllWAjkbFT3vjHcVQ2B3vKGu-vOlT3vl_o-_1uk", alt: "About Hero Image", alt_ar: "صورة قسم الاستوديو", label: "About Hero Image" }
  },
  services: {
    service1_img: { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_-sphk4kzMgjZa0jDOi6jQvbpH44yLaMMz6KKeh0pcndtpg-bPHDGqfvmUPunPPFyqW9_x7b52BXi2FudXCvIOyh1nYENP8aeWtQOiFK7gyCvpXt6J_JCgTgh0qL5Ew6gPAW0Fidssmcd-RpLlrKyDThO5kw9VuLbiiTk3JXokX-30JtEqaJGDA5LiXImLiIrB4AT8YhPSQHFrQJahgIoIV0NAtUCKas24lYhsyN5SOcGQix0xm_Hu-H7Ear8I8EEgsJrt3TH4C4", alt: "Structural Engineering", alt_ar: "الهندسة الإنشائية", label: "Service 1 Image" },
    service2_img: { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJc3LFGDv3qCmpnTMhWPm7pV2nr0osDwAuR9JmC9d86rlamnEFZlAOHnFZI_ZtnXsb5hs-V81JAHqPiv8O2C0JjNXZEn4bmH1ZATJPxhd4PgWZxs7cNiGzqtCM6kxEE1q-ITiKM_VUsZ81y1cFK4zfZ-FdQy9n0tI-ydln7-wAeEzDQw3QLHiNCQnhcUks6OkJOxsMDGA1NzbF8aXkZMWw9xa0CYapew-0XRNszwBxJzrycRIwvQggP122nw65ssho52sC-5N27WU", alt: "Commercial Construction", alt_ar: "البناء التجاري", label: "Service 2 Image" },
    service3_img: { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfVKHOf6vlZNixVFR-XfXt-cL-xy2roO8oGEEQQnya6fytmSFGKE8kTDTgVKMD_O4XSoko3GUVWr3lTFGT25oPDv_SJN-EdPGof2LlXFNa_BdH90va1fnRgK6BDRPbpKAZgIuu4-l1jGybALtjrUpER0qWayZgXz-6j4EyTgafORl-xwuLjffbLhaMJe_42kHNCKfwDNu8n0zRR25LPmr5o_jG26Dq2CdCXUWjNllWAjkbFT3vjHcVQ2B3vKGu-vOlT3vl_o-_1uk", alt: "Sustainable Infrastructure", alt_ar: "البنية التحتية المستدامة", label: "Service 3 Image" }
  }
};

// ── Internal helpers ───────────────────────────────────────────────────────────

function pickValue(en: string, ar: string | null | undefined, lang: Locale): string {
  if (lang === "ar") {
    const trimmed = (ar ?? "").trim();
    return trimmed.length > 0 ? trimmed : en;
  }
  return en;
}

function defaultsToRecord(
  section: string,
  lang: Locale
): Record<string, string> {
  const out: Record<string, string> = {};
  const defs = DEFAULT_CONTENT[section] || {};
  for (const [key, def] of Object.entries(defs)) {
    out[key] = pickValue(def.en, def.ar, lang);
  }
  return out;
}

function imageDefaultsToRecord(
  section: string,
  lang: Locale
): Record<string, { url: string; alt: string }> {
  const out: Record<string, { url: string; alt: string }> = {};
  const defs = DEFAULT_IMAGES[section] || {};
  for (const [key, def] of Object.entries(defs)) {
    out[key] = {
      url: def.url,
      alt: pickValue(def.alt, def.alt_ar, lang),
    };
  }
  return out;
}

// ── Client-side helpers ────────────────────────────────────────────────────────

export async function getContent(
  section: string,
  lang: Locale = DEFAULT_LOCALE
): Promise<Record<string, string>> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("key, value, value_ar")
    .eq("section", section);

  const result = defaultsToRecord(section, lang);

  if (data && !error) {
    for (const row of data) {
      result[row.key] = pickValue(row.value, row.value_ar, lang);
    }
  }

  return result;
}

export async function getImages(
  section: string,
  lang: Locale = DEFAULT_LOCALE
): Promise<Record<string, { url: string; alt: string }>> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("site_images")
    .select("key, url, alt, alt_ar")
    .eq("section", section);

  const result = imageDefaultsToRecord(section, lang);

  if (data && !error) {
    for (const row of data) {
      result[row.key] = {
        url: row.url,
        alt: pickValue(row.alt, row.alt_ar, lang),
      };
    }
  }

  return result;
}

// Returns the raw row (both languages) — used in the admin where editors need to see both.
export async function getContentRaw(
  section: string
): Promise<Record<string, { value: string; value_ar: string }>> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("key, value, value_ar")
    .eq("section", section);

  const result: Record<string, { value: string; value_ar: string }> = {};

  // seed with defaults so unsaved keys are still editable in the admin
  const defs = DEFAULT_CONTENT[section] || {};
  for (const [key, def] of Object.entries(defs)) {
    result[key] = { value: def.en, value_ar: def.ar ?? "" };
  }

  if (data && !error) {
    for (const row of data) {
      result[row.key] = {
        value: row.value ?? "",
        value_ar: row.value_ar ?? "",
      };
    }
  }

  return result;
}

export async function getImagesRaw(
  section: string
): Promise<Record<string, { url: string; alt: string; alt_ar: string }>> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("site_images")
    .select("key, url, alt, alt_ar")
    .eq("section", section);

  const result: Record<string, { url: string; alt: string; alt_ar: string }> =
    {};

  const defs = DEFAULT_IMAGES[section] || {};
  for (const [key, def] of Object.entries(defs)) {
    result[key] = { url: def.url, alt: def.alt, alt_ar: def.alt_ar ?? "" };
  }

  if (data && !error) {
    for (const row of data) {
      result[row.key] = {
        url: row.url,
        alt: row.alt ?? "",
        alt_ar: row.alt_ar ?? "",
      };
    }
  }

  return result;
}

export async function upsertContent(
  section: string,
  key: string,
  value: string,
  value_ar?: string | null
): Promise<void> {
  const supabase = createBrowserClient();
  const defaults = DEFAULT_CONTENT[section]?.[key];

  const payload: Record<string, unknown> = {
    section,
    key,
    value,
    type: defaults?.type || "text",
    label: defaults?.label || key,
    updated_at: new Date().toISOString(),
  };

  // Only set value_ar when caller passes it explicitly (avoids clobbering existing translations).
  if (value_ar !== undefined) {
    payload.value_ar = value_ar;
  }

  const { error } = await supabase
    .from("site_content")
    .upsert(payload, { onConflict: "section,key" });

  if (error) throw error;
}

export async function upsertContentArabic(
  section: string,
  key: string,
  value_ar: string
): Promise<void> {
  const supabase = createBrowserClient();
  const defaults = DEFAULT_CONTENT[section]?.[key];

  // We need a value to satisfy NOT NULL. Read existing value first.
  const { data: existing } = await supabase
    .from("site_content")
    .select("value")
    .eq("section", section)
    .eq("key", key)
    .maybeSingle();

  const englishValue =
    existing?.value ?? defaults?.en ?? key;

  const { error } = await supabase
    .from("site_content")
    .upsert(
      {
        section,
        key,
        value: englishValue,
        value_ar,
        type: defaults?.type || "text",
        label: defaults?.label || key,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "section,key" }
    );

  if (error) throw error;
}

export async function upsertImage(
  section: string,
  key: string,
  url: string,
  alt: string,
  alt_ar?: string | null
): Promise<void> {
  const supabase = createBrowserClient();
  const defaults = DEFAULT_IMAGES[section]?.[key];

  const payload: Record<string, unknown> = {
    section,
    key,
    url,
    alt,
    label: defaults?.label || key,
    updated_at: new Date().toISOString(),
  };

  if (alt_ar !== undefined) {
    payload.alt_ar = alt_ar;
  }

  const { error } = await supabase
    .from("site_images")
    .upsert(payload, { onConflict: "section,key" });

  if (error) throw error;
}

export async function uploadImage(file: File, section: string): Promise<string> {
  const supabase = createBrowserClient();
  const ext = file.name.split(".").pop();
  const fileName = `${section}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  const { error } = await supabase.storage
    .from("site-images")
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("site-images")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

// ── Server-side helpers ────────────────────────────────────────────────────────

export async function getContentServer(
  supabase: ReturnType<typeof createBrowserClient>,
  section: string,
  lang: Locale = DEFAULT_LOCALE
): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("site_content")
    .select("key, value, value_ar")
    .eq("section", section);

  const result = defaultsToRecord(section, lang);

  if (data && !error) {
    for (const row of data) {
      result[row.key] = pickValue(row.value, row.value_ar, lang);
    }
  }

  return result;
}

export async function getImagesServer(
  supabase: ReturnType<typeof createBrowserClient>,
  section: string,
  lang: Locale = DEFAULT_LOCALE
): Promise<Record<string, { url: string; alt: string }>> {
  const { data, error } = await supabase
    .from("site_images")
    .select("key, url, alt, alt_ar")
    .eq("section", section);

  const result = imageDefaultsToRecord(section, lang);

  if (data && !error) {
    for (const row of data) {
      result[row.key] = {
        url: row.url,
        alt: pickValue(row.alt, row.alt_ar, lang),
      };
    }
  }

  return result;
}
