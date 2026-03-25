import type { MetadataRoute } from "next";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";

// ═══════════════════════════════════════════
// SITEMAP — Auto-generated for SEO
// Dynamically pulls slugs from product data
// Lists all public pages for Google crawlers
// ═══════════════════════════════════════════

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://luxewrapindia.com";

  // Static pages — only pages that actually exist in the app
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Product pages — dynamically from actual product data
  const productPages: MetadataRoute.Sitemap = SAMPLE_PRODUCTS
    .filter((p) => p.status === "published")
    .map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // Model collection pages — based on unique phone models in product data
  const uniqueBrands = [...new Set(SAMPLE_PRODUCTS.map((p) => p.phoneBrand))];
  const brandPages: MetadataRoute.Sitemap = uniqueBrands.map((brand) => ({
    url: `${baseUrl}/products/model/${encodeURIComponent(brand)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...brandPages];
}
