"use client";

import Navbar from "@/components/ui/Navbar";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import HeroSection from "@/components/sections/HeroSection";
import TrustSection from "@/components/sections/TrustSection";
import PhoneModelSelector from "@/components/sections/PhoneModelSelector";
import TrendingCarousel from "@/components/sections/TrendingCarousel";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import Footer from "@/components/ui/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CartSidebar from "@/components/cart/CartSidebar";

// ═══════════════════════════════════════════
// HOMEPAGE — Compact page assembly
// Announcement → Navbar → Hero → Trust Strip →
// Phone Selector → Trending → Testimonials →
// CTA Banner → Footer
// ═══════════════════════════════════════════

export default function HomePage() {
  return (
    <>
      {/* Overlay Components */}
      <CartSidebar />
      <WhatsAppButton />

      {/* Fixed Announcement Bar at very top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBar />
      </div>

      {/* Navbar sits below announcement bar */}
      <div className="fixed top-[32px] left-0 right-0 z-40">
        <Navbar />
      </div>

      {/* Main Content — padded to clear fixed bars */}
      <main className="pt-[88px]">
        {/* ═══ HERO ═══ */}
        <HeroSection />

        {/* ═══ TRUST STRIP (compact icon row) ═══ */}
        <TrustSection />

        {/* ═══ PHONE MODEL SELECTOR ═══ */}
        <PhoneModelSelector />

        {/* ═══ TRENDING CAROUSEL ═══ */}
        <TrendingCarousel />

        {/* ═══ TESTIMONIALS (compact) ═══ */}
        <TestimonialsSection />

        {/* ═══ CTA BANNER (slim) ═══ */}
        <section className="py-10 sm:py-14 bg-gradient-to-b from-white to-gray-50 text-center border-t border-gray-100">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-primary mb-2">
              Wrap Your World in <span className="text-accent">Style</span>
            </h2>
            <p className="text-sm text-text-secondary mb-5">
              Premium cases from ₹599. Join 10,000+ happy customers.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="#phones"
                className="bg-accent hover:bg-accent-dark text-white px-8 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-glow"
              >
                SHOP NOW →
              </a>
              <a
                href="https://www.instagram.com/luxewrap.in"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 text-text-secondary hover:text-accent hover:border-accent px-8 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                INSTAGRAM
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
