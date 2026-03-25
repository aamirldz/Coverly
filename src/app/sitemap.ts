import type { MetadataRoute } from "next";

// ═══════════════════════════════════════════
// SITEMAP — Auto-generated for SEO
// Lists all public pages for Google crawlers
// ═══════════════════════════════════════════

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://luxewrapindia.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Product pages — dynamically from sample data
  // In production, this would query the database
  const productSlugs = [
    "carbon-fiber-ultra-case",
    "magsafe-clear-case",
    "aramid-stealth-case",
    "leather-executive-case",
    "cute-blossom-case",
    "carbon-fiber-pro-case",
    "magsafe-midnight-case",
    "aramid-shield-case",
    "cute-lavender-dreams",
    "leather-classic-brown",
  ];

  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Collection pages
  const collectionPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/collections?brand=Apple`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/collections?brand=Samsung`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/collections?type=MagSafe`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/collections?type=Carbon+Fiber`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/collections?type=Aramid+Fiber`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
  ];

  return [...staticPages, ...productPages, ...collectionPages];
}
