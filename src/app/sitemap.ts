import type { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { CITY_SLUGS } from "@/data/cities";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alfisalcon.com";

// Static pages with priority + change frequency tuning
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE_URL,                   priority: 1.0, changeFrequency: "monthly"  },
  { url: `${BASE_URL}/about`,        priority: 0.9, changeFrequency: "monthly"  },
  { url: `${BASE_URL}/services`,     priority: 0.9, changeFrequency: "monthly"  },
  { url: `${BASE_URL}/projects`,     priority: 0.9, changeFrequency: "weekly"   },
  { url: `${BASE_URL}/contact`,      priority: 0.8, changeFrequency: "yearly"   },
  // Programmatic city pages
  ...CITY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    priority: 0.8 as const,
    changeFrequency: "monthly" as const,
  })),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const static_entries = STATIC_ROUTES.map((r) => ({
    ...r,
    lastModified: now,
    // Alternate language URLs for Arabic
    alternates: {
      languages: {
        en: r.url,
        ar: r.url, // same URL, language controlled by cookie — still useful for crawlers
      },
    },
  }));

  // Dynamically add one entry per project so Google can discover project pages
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: projects } = await supabase
      .from("projects")
      .select("id, updated_at")
      .order("created_at", { ascending: false });

    const project_entries: MetadataRoute.Sitemap = (projects ?? []).map((p) => ({
      url: `${BASE_URL}/projects#${p.id}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const { data: services } = await supabase
      .from("services")
      .select("id, updated_at")
      .order("created_at", { ascending: true });

    const service_entries: MetadataRoute.Sitemap = (services ?? []).map((s) => ({
      url: `${BASE_URL}/services#${s.id}`,
      lastModified: s.updated_at ? new Date(s.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...static_entries, ...project_entries, ...service_entries];
  } catch {
    return static_entries;
  }
}
