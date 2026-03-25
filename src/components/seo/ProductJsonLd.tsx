"use client";

import type { Product } from "@/types";

// ═══════════════════════════════════════════
// PRODUCT JSON-LD — Structured data for
// Google Shopping, rich results, and SEO
// Renders a <script type="application/ld+json">
// in the product detail page
// ═══════════════════════════════════════════

interface ProductJsonLdProps {
  product: Product;
}

export default function ProductJsonLd({ product }: ProductJsonLdProps) {
  const avgRating =
    product.reviews && product.reviews.length > 0
      ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
      : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.[0] || "",
    brand: {
      "@type": "Brand",
      name: "LuxeWrap India",
    },
    sku: product.sku || product.id,
    category: "Phone Cases & Covers",
    material: product.material,
    color: product.color,
    offers: {
      "@type": "Offer",
      url: `https://luxewrapindia.com/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability:
        product.stockQty > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "LuxeWrap India",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "INR",
        },
      },
    },
    ...(avgRating && product.reviews && product.reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating,
            reviewCount: product.reviews.length,
            bestRating: "5",
            worstRating: "1",
          },
          review: product.reviews.slice(0, 3).map((r) => ({
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: "5",
            },
            author: {
              "@type": "Person",
              name: r.customerName,
            },
            reviewBody: r.comment,
          })),
        }
      : {}),
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Compatible With",
        value: product.phoneModel,
      },
      {
        "@type": "PropertyValue",
        name: "Case Type",
        value: product.caseType,
      },
    ],
  };

  // BreadcrumbList for product navigation
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://luxewrapindia.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: "https://luxewrapindia.com/#products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://luxewrapindia.com/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
