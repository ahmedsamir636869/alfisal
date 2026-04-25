import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { getContentServer, getImagesServer } from "@/lib/cms";
import { getLocale } from "@/lib/i18n.server";
import NavShell from "./NavShell";

export default async function Navigation() {
  const [cookieStore, headerList, locale] = await Promise.all([
    cookies(),
    headers(),
    getLocale(),
  ]);
  const supabase = await createClient(cookieStore);

  const [content, images] = await Promise.all([
    getContentServer(supabase, "navigation", locale),
    getImagesServer(supabase, "navigation", locale),
  ]);

  const pathname = headerList.get("x-pathname") || "/";

  const links = [
    { label: content.link1_text || "Home",     href: content.link1_url || "/"        },
    { label: content.link2_text || "Projects", href: content.link2_url || "/projects" },
    { label: content.link3_text || "Services", href: content.link3_url || "/services" },
    { label: content.link4_text || "Studio",   href: content.link4_url || "/about"    },
    { label: content.link5_text || "Contact",  href: content.link5_url || "/contact"  },
  ];

  return (
    <NavShell
      brandName={content.brand_name || "Alfisal"}
      logoUrl={images.logo?.url || "/logo.png"}
      logoAlt={images.logo?.alt || "Alfisal"}
      links={links}
      ctaLabel={content.cta_text || "Start a project"}
      ctaHref={content.cta_url || "/contact"}
      activeLocale={locale}
      serverPath={pathname}
    />
  );
}
