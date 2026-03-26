"use client";


import { useParams } from "next/navigation";
import { useProductStore } from "@/hooks/useProducts";
import { useEffect, useMemo } from "react";
import Navbar from "@/components/ui/Navbar";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import Footer from "@/components/ui/Footer";
import ProductCard from "@/components/product/ProductCard";
import CartSidebar from "@/components/cart/CartSidebar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Link from "next/link";

// ═══════════════════════════════════════════
// MODEL PAGE — Shows all cases for a specific phone model
// Accessed from "Choose Your Phone" device selector
// ═══════════════════════════════════════════

export default function ModelPage() {
  const params = useParams();
  const modelSlug = decodeURIComponent(params.model as string);
  const { products, initProducts } = useProductStore();

  useEffect(() => { initProducts(); }, [initProducts]);

  // Find all published cases for this phone model
  const modelProducts = useMemo(() => {
    return products.filter(
      (p) => p.status === "published" && p.phoneModel === modelSlug
    );
  }, [products, modelSlug]);

  // Get brand from first product
  const brand = modelProducts[0]?.phoneBrand || "";

  // Group by case type for organized display
  const caseTypeGroups = useMemo(() => {
    const groups: Record<string, typeof modelProducts> = {};
    modelProducts.forEach((p) => {
      const ct = p.caseType || "Other";
      if (!groups[ct]) groups[ct] = [];
      groups[ct].push(p);
    });
    return groups;
  }, [modelProducts]);

  return (
    <>
      <CartSidebar />
      <WhatsAppButton />

      <div className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBar />
      </div>
      <div className="fixed top-[32px] left-0 right-0 z-40">
        <Navbar />
      </div>

      <main className="pt-[88px] min-h-screen bg-gray-50">
        {/* ── Breadcrumb + Hero ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <Link href="/#phones" className="hover:text-accent transition-colors">Choose Your Phone</Link>
              <span>/</span>
              <span className="text-text-primary font-medium">{modelSlug}</span>
            </nav>

            {/* Model Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                {brand === "Apple" ? (
                  <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                ) : brand === "Samsung" ? (
                  <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 1h-8A2.5 2.5 0 005 3.5v17A2.5 2.5 0 007.5 23h8a2.5 2.5 0 002.5-2.5v-17A2.5 2.5 0 0015.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z" />
                  </svg>
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
                  {modelSlug} Cases
                </h1>
                <p className="text-sm text-text-secondary mt-1">
                  {modelProducts.length} premium {modelProducts.length === 1 ? "case" : "cases"} available
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Products by Case Type ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {modelProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">📱</p>
              <h2 className="text-xl font-heading font-bold text-text-primary mb-2">
                No cases available yet
              </h2>
              <p className="text-text-secondary text-sm mb-6">
                We're working on bringing cases for {modelSlug}. Check back soon!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              >
                ← Browse All Cases
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(caseTypeGroups).map(([caseType, groupProducts]) => (
                <div key={caseType}>
                  {/* Group heading — only show if multiple groups */}
                  {Object.keys(caseTypeGroups).length > 1 && (
                    <div className="flex items-center gap-3 mb-5">
                      <h2 className="text-lg font-heading font-bold text-text-primary">
                        {caseType}
                      </h2>
                      <span className="text-xs text-text-muted bg-gray-100 px-2.5 py-1 rounded-full">
                        {groupProducts.length}
                      </span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                  )}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {groupProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-accent hover:underline text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
