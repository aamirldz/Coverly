import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

// ═══════════════════════════════════════════
// ROOT LAYOUT — Global SEO, Fonts, Theme
// Google Fonts: Playfair Display + Inter
// Comprehensive Open Graph + Twitter Cards
// JSON-LD Organization structured data
// ═══════════════════════════════════════════

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FA7000",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://luxewrapindia.com"),
  title: {
    default: "LuxeWrap India — Premium Phone Cases | MagSafe, Carbon Fiber, Aramid",
    template: "%s | LuxeWrap India",
  },
  description:
    "India's #1 premium phone case brand. Shop luxury MagSafe, Carbon Fiber & Aramid cases for iPhone 15-17 and Samsung Galaxy S-Series. Military-grade protection meets stunning design. Free delivery on prepaid orders. Starting at ₹599.",
  keywords: [
    "phone cases India",
    "luxury phone covers",
    "MagSafe cases India",
    "carbon fiber phone case",
    "aramid fiber case",
    "iPhone 16 Pro Max case",
    "iPhone 17 Pro case",
    "Samsung S26 Ultra case",
    "premium phone case India",
    "LuxeWrap India",
    "phone cover online India",
    "military grade phone case",
    "best phone cases India",
  ],
  authors: [{ name: "LuxeWrap India", url: "https://luxewrapindia.com" }],
  creator: "LuxeWrap India",
  publisher: "LuxeWrap India",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    title: "LuxeWrap India — Premium Phone Cases",
    description:
      "Shop India's most premium phone cases. MagSafe, Carbon Fiber & Aramid — military-grade protection starting at ₹599. Free delivery on prepaid orders.",
    url: "https://luxewrapindia.com",
    siteName: "LuxeWrap India",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LuxeWrap India — Premium Phone Cases",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LuxeWrap India — Premium Phone Cases",
    description:
      "Shop India's most premium phone cases. MagSafe, Carbon Fiber & Aramid — starting at ₹599.",
    images: ["/og-image.png"],
  },
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
    canonical: "https://luxewrapindia.com",
  },
  category: "E-Commerce",
};

// JSON-LD Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LuxeWrap India",
  url: "https://luxewrapindia.com",
  logo: "https://luxewrapindia.com/logo.png",
  description: "India's #1 premium phone case brand — MagSafe, Carbon Fiber & Aramid cases.",
  foundingDate: "2026",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi"],
  },
  sameAs: [
    "https://www.instagram.com/luxewrap.in",
  ],
};

// JSON-LD WebSite Schema (enables sitelinks search box)
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "LuxeWrap India",
  url: "https://luxewrapindia.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://luxewrapindia.com/collections?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-white text-text-primary font-body antialiased">
        <a href="#main-content" className="skip-to-content">Skip to main content</a>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
