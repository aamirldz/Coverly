"use client";


import { useParams } from "next/navigation";
import { useProductStore } from "@/hooks/useProducts";
import { useEffect } from "react";
import ProductImages from "@/components/product/ProductImages";
import ProductInfo from "@/components/product/ProductInfo";
import ReviewSection from "@/components/product/ReviewSection";
import ProductCard from "@/components/product/ProductCard";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import Footer from "@/components/ui/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CartSidebar from "@/components/cart/CartSidebar";
import { useCartStore } from "@/hooks/useCart";
import Link from "next/link";

// ═══════════════════════════════════════════
// PRODUCT DETAIL PAGE — /products/[slug]
// Left: Image carousel (60%)
// Right: Product info panel (40%)
// Below: Reviews + Related Products
// ═══════════════════════════════════════════

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { products, initProducts } = useProductStore();

  // Initialize shared product store
  useEffect(() => { initProducts(); }, [initProducts]);

  // Find product from shared store (real-time admin updates)
  const publishedProducts = products.filter((p) => p.status === "published");
  const product = publishedProducts.find((p) => p.slug === slug);

  // Related products — same case type, different product
  const relatedProducts = product
    ? publishedProducts.filter(
        (p) => p.caseType === product.caseType && p.id !== product.id
      ).slice(0, 4)
    : [];

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-50">
          <AnnouncementBar />
        </div>
        <div className="fixed top-[32px] left-0 right-0 z-40">
          <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-heading font-bold text-text-primary">LUXEWRAP</span>
                <span className="text-[10px] font-body text-accent font-semibold tracking-widest">INDIA</span>
              </Link>
            </div>
          </nav>
        </div>
        <div className="flex-1 flex items-center justify-center pt-[88px]">
          <div className="text-center">
            <span className="text-6xl block mb-4">😕</span>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Product Not Found
            </h1>
            <p className="text-sm text-text-secondary mb-6">
              The product you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/"
              className="bg-accent hover:bg-accent-dark text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
            >
              ← Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* SEO: Product JSON-LD */}
      <ProductJsonLd product={product} />

      {/* Overlays */}
      <CartSidebar />
      <WhatsAppButton />

      {/* Fixed Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBar />
      </div>

      {/* Navbar */}
      <div className="fixed top-[32px] left-0 right-0 z-40">
        <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-heading font-bold text-text-primary group-hover:text-accent transition-colors">
                LUXEWRAP
              </span>
              <span className="text-[10px] font-body text-accent font-semibold tracking-widest">
                INDIA
              </span>
            </Link>

            {/* Center nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm text-text-secondary hover:text-accent transition-colors font-medium">Home</Link>
              <Link href="/#products" className="text-sm text-text-secondary hover:text-accent transition-colors font-medium">Shop</Link>
              <Link href="/track-order" className="text-sm text-text-secondary hover:text-accent transition-colors font-medium">Track Order</Link>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => useCartStore.getState().toggleCart()}
                className="relative text-text-secondary hover:text-accent transition-colors"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Page Content */}
      <main className="pt-[88px]">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-xs text-text-muted">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link href="/#products" className="hover:text-accent transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-text-secondary">{product.name}</span>
          </nav>
        </div>

        {/* Product Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left — Images (3 columns on lg) */}
            <div className="lg:col-span-3 lg:sticky lg:top-[100px] lg:self-start">
              <ProductImages images={product.images} productName={product.name} />
            </div>

            {/* Right — Product Info (2 columns on lg) */}
            <div className="lg:col-span-2">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <hr className="border-gray-200" />
          <ReviewSection reviews={product.reviews || []} productName={product.name} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
