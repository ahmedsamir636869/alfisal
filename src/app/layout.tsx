import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Noto_Kufi_Arabic, Amiri } from "next/font/google";
import { preconnect } from "react-dom";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { headers } from "next/headers";
import { getLocale } from "@/lib/i18n.server";
import { LOCALE_META } from "@/lib/i18n";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alfisalcon.com";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Arabic body — modern, clean, supports a wide weight range.
const notoKufi = Noto_Kufi_Arabic({
  variable: "--font-noto-kufi-arabic",
  subsets: ["arabic"],
  display: "swap",
});

// Arabic display — classical naskh-style serif that pairs with Fraunces.
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Alfisal — Architecture of Consequence",
    template: "%s — Alfisal",
  },
  description:
    "Alfisal is an architecture and construction studio building landmarks with editorial precision across 22 countries. Concept, engineering, delivery.",
  keywords: [
    "architecture",
    "construction",
    "engineering",
    "design build",
    "landmarks",
    "Saudi Arabia",
    "Gulf",
    "هندسة معمارية",
    "مقاولات",
  ],
  authors: [{ name: "Alfisal Studio", url: BASE_URL }],
  creator: "Alfisal Studio",
  publisher: "Alfisal Studio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en": BASE_URL,
      "ar": BASE_URL,
      "x-default": BASE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_SA",
    url: BASE_URL,
    siteName: "Alfisal",
    title: "Alfisal — Architecture of Consequence",
    description:
      "An architecture and construction studio building landmarks with editorial precision across 22 countries.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Alfisal — Architecture of Consequence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alfisal — Architecture of Consequence",
    description:
      "An architecture and construction studio building landmarks with editorial precision across 22 countries.",
    images: ["/og-image.jpg"],
    creator: "@alfisal",
    site: "@alfisal",
  },
  verification: {
    // google: "your-google-verification-code",   // add after Search Console setup
    // yandex: "your-yandex-code",
  },
  category: "business",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#2b3747" },
  ],
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (SUPABASE_URL) preconnect(SUPABASE_URL);

  const [headerList, locale] = await Promise.all([headers(), getLocale()]);
  const pathname = headerList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");
  const meta = LOCALE_META[locale];

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      data-locale={locale}
      className={`${fraunces.variable} ${inter.variable} ${notoKufi.variable} ${amiri.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <JsonLd />
      </head>
      <body className="bg-bone text-ink min-h-full flex flex-col font-body">
        {isAdmin ? null : <Navigation />}
        <main id="main" className="flex-1">
          {children}
        </main>
        {isAdmin ? null : <Footer />}
      </body>
    </html>
  );
}
