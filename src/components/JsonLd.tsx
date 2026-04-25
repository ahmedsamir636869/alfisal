// Renders structured data (schema.org JSON-LD) for SEO.
// Drop-in server component — no client JS involved.

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alfisalcon.com";

export default function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Alfisal Studio",
    alternateName: "الفيصل",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/icon-512.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      // Add your real social profile URLs when available
      // "https://www.linkedin.com/company/alfisal",
      // "https://www.instagram.com/alfisal",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "12 Industrial Park",
      addressLocality: "Riyadh",
      addressCountry: "SA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+966-12-345-6789",
      contactType: "customer service",
      availableLanguage: ["English", "Arabic"],
    },
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${BASE_URL}/#localbusiness`,
    name: "Alfisal Studio",
    image: `${BASE_URL}/og-image.jpg`,
    url: BASE_URL,
    telephone: "+966-12-345-6789",
    email: "info@alfisalcon.com",
    priceRange: "$$$",
    servesCuisine: undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: "12 Industrial Park",
      addressLocality: "Riyadh",
      addressRegion: "Riyadh Province",
      postalCode: "11564",
      addressCountry: "SA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.7136,
      longitude: 46.6753,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    hasMap: "https://maps.google.com/?q=Riyadh+Industrial+Park",
    parentOrganization: { "@id": `${BASE_URL}/#organization` },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "Alfisal — Architecture of Consequence",
    description:
      "Alfisal is an architecture and construction studio building landmarks with editorial precision across 22 countries.",
    inLanguage: ["en", "ar"],
    publisher: { "@id": `${BASE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/projects?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
