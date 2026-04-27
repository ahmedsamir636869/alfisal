import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getLocale } from "@/lib/i18n.server";
import { getContentServer } from "@/lib/cms";
import { CITIES, getCityBySlug, CITY_SLUGS } from "@/data/cities";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alfisalcon.com";

// ── Static params — all city slugs pre-rendered at build time ─────────────
export function generateStaticParams() {
  return CITY_SLUGS.map((slug) => ({ city: slug }));
}

// ── Dynamic per-city metadata ─────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  const title = `Architecture & Construction in ${city.name}`;
  const url = `/services/${city.slug}`;

  return {
    title,
    description: city.metaDescription,
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}${url}`,
        ar: `${BASE_URL}${url}`,
      },
    },
    openGraph: {
      title: `${title} — Alfisal`,
      description: city.metaDescription,
      url,
    },
    other: {
      // hreflang self-reference helpers for Arabic locale crawlers
      "geo.region": city.countryCode,
      "geo.placename": city.name,
      "geo.position": `${city.geo.lat};${city.geo.lng}`,
      ICBM: `${city.geo.lat}, ${city.geo.lng}`,
    },
  };
}

// Core service offerings — same on every page but contextualised by city copy
const CORE_SERVICES = [
  {
    id: "design",
    icon: "architecture",
    en: { title: "Architectural Design", desc: "From first brief to construction documents — concept, schematic, and technical design." },
    ar: { title: "التصميم المعماري",  desc: "من الإحاطة الأولى حتى وثائق البناء — التصميم المفاهيمي والتخطيطي والتقني." },
  },
  {
    id: "engineering",
    icon: "engineering",
    en: { title: "Structural Engineering", desc: "In-house structural and MEP engineering integrated with design from day one." },
    ar: { title: "الهندسة الإنشائية", desc: "هندسة إنشائية وميكانيكية وكهربائية وصحية داخلية مدمجة مع التصميم منذ البداية." },
  },
  {
    id: "pm",
    icon: "manage_accounts",
    en: { title: "Project Management", desc: "Fixed-fee delivery with transparent programme, cost, and quality reporting." },
    ar: { title: "إدارة المشاريع",    desc: "تسليم بسعر ثابت مع تقارير شفافة للجدول الزمني والتكلفة والجودة." },
  },
  {
    id: "interiors",
    icon: "chair",
    en: { title: "Interior Fit-Out", desc: "Full interior delivery — FF&E specification, procurement, and installation." },
    ar: { title: "التشطيبات الداخلية", desc: "تسليم داخلي متكامل — تحديد المفروشات والمعدات والتجهيزات وشرائها وتركيبها." },
  },
  {
    id: "handover",
    icon: "handshake",
    en: { title: "Post-Handover Support", desc: "12-month defects liability period with a dedicated site team." },
    ar: { title: "دعم ما بعد التسليم", desc: "فترة ضمان عيوب لمدة 12 شهرًا مع فريق موقع مخصص." },
  },
];

// ── Page ──────────────────────────────────────────────────────────────────
export default async function CityServicePage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const [{ city: slug }, locale, cookieStore] = await Promise.all([
    params,
    getLocale(),
    cookies(),
  ]);
  const city = getCityBySlug(slug);
  if (!city) notFound();
  const isAr = locale === "ar";

  const supabase = await createClient(cookieStore);
  const ctaContent = await getContentServer(supabase, "cta_banner", locale);

  const cityName = isAr ? city.nameAr : city.name;
  const country  = isAr ? city.countryAr : city.country;
  const sector   = isAr ? city.dominantSectorAr : city.dominantSector;
  const landmark = isAr ? city.landmarkAr : city.landmark;
  const insight  = isAr ? city.marketInsightAr : city.marketInsight;

  // Inline JSON-LD for this city page
  const localBizSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Alfisal — ${isAr ? city.nameAr : city.name}`,
    description: city.metaDescription,
    url: `${BASE_URL}/services/${city.slug}`,
    areaServed: { "@type": "City", name: city.name, containedInPlace: { "@type": "Country", name: city.country } },
    address: { "@type": "PostalAddress", addressLocality: city.name, addressCountry: city.countryCode },
    geo: { "@type": "GeoCoordinates", latitude: city.geo.lat, longitude: city.geo.lng },
    parentOrganization: { "@id": `${BASE_URL}/#organization` },
  };

  // Sibling cities for internal linking
  const siblings = CITIES.filter((c) => c.slug !== city.slug).slice(0, 5);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizSchema) }}
      />

      {/* ── Breadcrumb ───────────────────────────────────────────────── */}
      <nav aria-label="breadcrumb" className="pt-32 md:pt-40 pb-0 border-b border-[var(--color-hairline)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <ol className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-8">
            <li><Link href="/" className="hover:text-[var(--color-ink)] transition-colors">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/services" className="hover:text-[var(--color-ink)] transition-colors">Services</Link></li>
            <li aria-hidden>/</li>
            <li className="text-[var(--color-ink)]">{cityName}</li>
          </ol>
        </div>
      </nav>

      {/* ── Hero Masthead ─────────────────────────────────────────────── */}
      <section className="pt-12 pb-20 md:pb-28 border-b border-[var(--color-hairline)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6 md:gap-x-10">
          <div className="col-span-12 md:col-span-3 mb-8 md:mb-0">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)]">
              {country} · {sector}
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h1 className="font-display text-[clamp(2.4rem,6.5vw,6rem)] leading-[0.98] tracking-[-0.035em] text-[var(--color-ink)]">
              {isAr
                ? <>عمارة وإنشاء في<br /><span className="text-[var(--color-saffron-deep)]">{cityName}.</span></>
                : <>Architecture & Construction<br />in <span className="text-[var(--color-saffron-deep)]">{cityName}.</span></>
              }
            </h1>
            <p className="mt-10 max-w-[62ch] text-[var(--color-ink-soft)] leading-[1.8] text-lg">
              {insight}
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-saffron-deep)] group"
            >
              <span>{isAr ? "ابدأ مشروعك" : "Start your project"}</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Market Context ────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 border-b border-[var(--color-hairline)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6 md:gap-x-10 gap-y-10">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)]">
              {isAr ? "السياق المحلي" : "Local Context"}
            </p>
          </div>
          <div className="col-span-12 md:col-span-9 grid md:grid-cols-2 gap-8">
            <div className="border border-[var(--color-hairline)] p-8 rounded-sm">
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-3">
                {isAr ? "القطاع الرئيسي" : "Primary Sector"}
              </p>
              <p className="font-display text-3xl text-[var(--color-ink)]">{sector}</p>
            </div>
            <div className="border border-[var(--color-hairline)] p-8 rounded-sm">
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-3">
                {isAr ? "مشروع بارز" : "Landmark Reference"}
              </p>
              <p className="font-display text-3xl text-[var(--color-ink)]">{landmark}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 border-b border-[var(--color-hairline)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-10 mb-16">
            <div className="col-span-12 md:col-span-3">
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)]">
                {isAr ? "خدماتنا" : "Our Services"}
              </p>
            </div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="font-display text-[clamp(1.8rem,4vw,3.5rem)] leading-tight tracking-[-0.03em] text-[var(--color-ink)]">
                {isAr
                  ? `ما نقدمه في ${cityName}`
                  : `What we deliver in ${cityName}`}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_SERVICES.map((s) => {
              const t = isAr ? s.ar : s.en;
              return (
                <div
                  key={s.id}
                  className="group border border-[var(--color-hairline)] p-8 rounded-sm hover:border-[var(--color-saffron)] transition-colors"
                >
                  <span className="material-symbols-outlined text-[var(--color-saffron)] text-[28px] mb-6 block">
                    {s.icon}
                  </span>
                  <h3 className="font-display text-xl mb-3 text-[var(--color-ink)]">{t.title}</h3>
                  <p className="text-[var(--color-ink-soft)] text-sm leading-relaxed">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 border-b border-[var(--color-hairline)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6 md:gap-x-10">
          <div className="col-span-12 md:col-span-3" />
          <div className="col-span-12 md:col-span-9">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-6">
              {isAr
                ? `لديك مشروع في ${cityName}؟`
                : `Have a project in ${cityName}?`}
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.03em] text-[var(--color-ink)] mb-10">
              {ctaContent.title || (isAr ? "هل أنت مستعدّ لبناء رؤيتك؟" : "Ready to construct your vision?")}
            </h2>
            <p className="text-[var(--color-ink-soft)] leading-[1.8] max-w-[56ch] mb-10 text-base sm:text-lg">
              {ctaContent.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-[var(--color-ink)] text-[var(--color-bone)] px-8 py-4 font-mono text-[11px] tracking-[0.18em] uppercase group hover:bg-[var(--color-saffron-deep)] transition-colors"
              >
                <span>{ctaContent.cta_primary || (isAr ? "ابدأ المحادثة" : "Start a conversation")}</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <a
                href={`tel:${ctaContent.phone || ""}`}
                className="inline-flex items-center gap-3 border border-[var(--color-hairline)] text-[var(--color-ink)] px-8 py-4 font-mono text-[11px] tracking-[0.18em] uppercase group hover:border-[var(--color-ink)] transition-colors"
              >
                {ctaContent.cta_secondary || (isAr ? "اتّصل بالاستوديو" : "Call the studio")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Internal links to other cities (hub & spoke) ─────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-8">
            {isAr ? "مدن أخرى نخدمها" : "Other Cities We Serve"}
          </p>
          <div className="flex flex-wrap gap-4">
            {siblings.map((c) => (
              <Link
                key={c.slug}
                href={`/services/${c.slug}`}
                className="border border-[var(--color-hairline)] px-5 py-3 font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors"
              >
                {isAr ? c.nameAr : c.name}
              </Link>
            ))}
            <Link
              href="/services"
              className="border border-[var(--color-hairline)] px-5 py-3 font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors"
            >
              {isAr ? "جميع الخدمات" : "All services →"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
