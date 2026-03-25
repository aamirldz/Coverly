import type { MetadataRoute } from "next";

// ═══════════════════════════════════════════
// ROBOTS.TXT — Crawler instructions
// Allow all public pages, block admin
// ═══════════════════════════════════════════

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout", "/order-confirmation"],
      },
    ],
    sitemap: "https://luxewrapindia.com/sitemap.xml",
  };
}
