"use client";

// ═══════════════════════════════════════════
// HERO SECTION — Premium Mobile-First Hero
// Compact on mobile, expansive on desktop
// Auto-rotating product carousel
// ═══════════════════════════════════════════

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useProductStore } from "@/hooks/useProducts";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [activeCase, setActiveCase] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { initProducts, getHeroProducts } = useProductStore();

  useEffect(() => { initProducts(); }, [initProducts]);

  // Use admin-configured hero products (fallback handled inside getter)
  const heroProducts = getHeroProducts();

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveCase((prev) => (prev + 1) % heroProducts.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [heroProducts.length]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* ── BACKGROUND VIDEO ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-[0]"
      >
        <source src="/hero-background.mp4" type="video/mp4" />
      </video>

      {/* Decorative gradient blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] bg-accent/6 rounded-full blur-[80px] sm:blur-[120px] z-[2]" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-orange-200/30 rounded-full blur-[80px] sm:blur-[100px] z-[2]" />

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle, #FA7000 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating particles — fewer, smaller */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${2 + Math.random() * 2}px`,
                height: `${2 + Math.random() * 2}px`,
                background: `rgba(250, 112, 0, ${0.08 + Math.random() * 0.12})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${7 + Math.random() * 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-4 items-center">

          {/* ═══ MOBILE: Text first, then product  ═══ */}
          {/* ═══ DESKTOP: Text left, product right  ═══ */}

          {/* ── TEXT CONTENT ── */}
          <div className="text-center lg:text-left order-1 lg:order-1">
            {/* Badge */}
            <div className={`${mounted ? "hero-text-animate" : "opacity-0"}`}>
              <span className="inline-flex items-center gap-2 bg-accent/8 text-accent text-[11px] font-semibold px-3 py-1 rounded-full mb-3 sm:mb-5 border border-accent/10">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
                </span>
                India&apos;s #1 Premium Cases
              </span>
            </div>

            {/* Brand Name */}
            <div className={`${mounted ? "hero-text-animate" : "opacity-0"}`}>
              <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight leading-[0.9]">
                <span className="text-text-primary">LUXE</span>
                <span className="bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">WRAP</span>
              </h1>
              <div className="flex items-center gap-2 justify-center lg:justify-start mt-1">
                <div className="h-px w-6 sm:w-10 bg-accent/30" />
                <p className="text-accent text-[10px] sm:text-xs font-bold tracking-[0.5em]">INDIA</p>
                <div className="h-px w-6 sm:w-10 bg-accent/30" />
              </div>
            </div>

            {/* Tagline */}
            <p className={`text-lg sm:text-xl md:text-2xl text-text-secondary mt-3 sm:mt-5 font-light leading-snug ${
              mounted ? "hero-text-animate hero-text-animate-delay-1" : "opacity-0"
            }`}>
              Wrap Your World in{" "}
              <span className="text-text-primary font-semibold">Style</span>
            </p>

            {/* Description — hidden on mobile to save space */}
            <p className={`hidden sm:block text-sm text-text-muted mt-2 max-w-md mx-auto lg:mx-0 leading-relaxed ${
              mounted ? "hero-text-animate hero-text-animate-delay-2" : "opacity-0"
            }`}>
              Premium MagSafe, Carbon Fiber & Aramid cases. Military-grade protection meets stunning design.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-row gap-2.5 justify-center lg:justify-start mt-4 sm:mt-6 ${
              mounted ? "hero-text-animate hero-text-animate-delay-2" : "opacity-0"
            }`}>
              <a
                href="#products"
                className="group bg-accent hover:bg-accent-dark text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all hover:shadow-glow hover:translate-y-[-2px] flex items-center gap-2"
              >
                SHOP NOW
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#features"
                className="border border-gray-300 hover:border-accent text-text-secondary hover:text-accent px-5 sm:px-8 py-3 sm:py-3.5 rounded-xl font-medium text-xs sm:text-sm tracking-wide transition-all flex items-center gap-2"
              >
                EXPLORE
              </a>
            </div>

            {/* Stats — compact on mobile */}
            <div className={`flex justify-center lg:justify-start gap-4 sm:gap-8 mt-5 sm:mt-8 ${
              mounted ? "hero-text-animate hero-text-animate-delay-3" : "opacity-0"
            }`}>
              {[
                { value: "10K+", label: "Sold", color: "text-accent" },
                { value: "4.9★", label: "Rating", color: "text-text-primary" },
                { value: "MIL-STD", label: "Certified", color: "text-text-primary" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  {i > 0 && <div className="w-px h-6 sm:h-8 bg-gray-200" />}
                  <div className={`${i > 0 ? "pl-2 sm:pl-3" : ""} text-center lg:text-left`}>
                    <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-[8px] sm:text-[10px] text-text-muted uppercase tracking-widest">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── PRODUCT SHOWCASE ── */}
          <div className={`relative flex justify-center lg:justify-end order-2 lg:order-2 mt-2 lg:mt-0 ${
            mounted ? "hero-text-animate hero-text-animate-delay-1" : "opacity-0"
          }`}>
            <div className="relative w-48 h-48 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              {/* Glow */}
              <div className="absolute inset-[-15%] bg-gradient-to-b from-accent/6 via-accent/4 to-transparent rounded-full blur-2xl" />

              {/* Product images — crossfade, clipped to circle */}
              <div className="relative w-full h-full rounded-full overflow-hidden">
                {heroProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      index === activeCase ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>

              {/* Case name label */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-full px-3 py-1 shadow-sm z-20">
                <p className="text-[9px] sm:text-xs font-semibold text-text-primary whitespace-nowrap">
                  {heroProducts[activeCase]?.name}
                </p>
              </div>

              {/* Floating badges — hidden on very small screens, visible from sm+ */}
              <div className="hidden sm:block absolute top-2 -left-4 bg-white rounded-xl shadow-lg border border-gray-100 px-2.5 py-1.5 z-20 hero-float-badge">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-[10px] font-bold text-text-primary">MIL-STD 810G</p>
                    <p className="text-[8px] text-text-muted">10ft Drop Tested</p>
                  </div>
                </div>
              </div>

              <div className="hidden sm:block absolute bottom-16 -right-4 bg-white rounded-xl shadow-lg border border-gray-100 px-2.5 py-1.5 z-20 hero-float-badge" style={{ animationDelay: "1.2s" }}>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <p className="text-[10px] font-bold text-accent">MagSafe Ready</p>
                    <p className="text-[8px] text-text-muted">N52 Magnets</p>
                  </div>
                </div>
              </div>

              {/* Case selector dots */}
              <div className="absolute -bottom-7 sm:-bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                {heroProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCase(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === activeCase
                        ? "w-5 h-1.5 bg-accent"
                        : "w-1.5 h-1.5 bg-gray-300 hover:bg-accent/50"
                    }`}
                    aria-label={`View case ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator — hidden on mobile */}
      <div className={`hidden sm:flex absolute bottom-5 left-1/2 -translate-x-1/2 flex-col items-center gap-1 ${
        mounted ? "hero-text-animate hero-text-animate-delay-3" : "opacity-0"
      }`}>
        <p className="text-[8px] text-text-muted uppercase tracking-[0.15em] font-medium">Scroll</p>
        <div className="w-4 h-7 border border-gray-300 rounded-full flex items-start justify-center p-0.5">
          <div className="w-1 h-1.5 bg-accent rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
