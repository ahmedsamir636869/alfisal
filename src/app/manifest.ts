import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alfisal — Architecture of Consequence",
    short_name: "Alfisal",
    description:
      "An architecture and construction studio building landmarks with editorial precision. Concept, engineering, delivery.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",   // --color-bone
    theme_color: "#324259",        // --color-ink
    orientation: "portrait-primary",
    icons: [
      { src: "/icon",    sizes: "192x192", type: "image/png" },
      { src: "/icon512", sizes: "512x512", type: "image/png" },
      { src: "/icon512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["business", "lifestyle"],
    lang: "en",
    dir: "ltr",
  };
}
