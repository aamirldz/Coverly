"use client";

import { useProductStore } from "@/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// ═══════════════════════════════════════════
// TRENDING NOW — Premium center-focus carousel
// Center item: full-size, elevated with glow
// Side items: scaled down, faded, blurred
// Horizontal drag/swipe + auto-slide
// ═══════════════════════════════════════════

export default function TrendingCarousel() {
  const { products, initProducts } = useProductStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);

  useEffect(() => { initProducts(); }, [initProducts]);

  // Trending: featured, bestseller, or new — up to 8
  const trendingProducts = useMemo(() => {
    return products.filter(
      (p) => p.status === "published" && (p.showInTrending !== false) && (p.featured || p.badge === "BESTSELLER" || p.badge === "NEW")
    ).slice(0, 8);
  }, [products]);

  const total = trendingProducts.length;

  // Auto-slide every 3s (slightly faster)
  useEffect(() => {
    if (isHovered || isDragging || total <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3000);
    return () => clearInterval(timer);
  }, [isHovered, isDragging, total]);

  const goTo = useCallback((idx: number) => {
    setActiveIndex(((idx % total) + total) % total);
  }, [total]);

  // Drag handlers — real-time tracking
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragOffset(0);
    dragStartX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX.current;
    setDragOffset(diff);
  };
  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap to next/prev if dragged far enough (30px threshold)
    if (Math.abs(dragOffset) > 30) {
      dragOffset < 0 ? goTo(activeIndex + 1) : goTo(activeIndex - 1);
    }
    setDragOffset(0);
  };

  if (total === 0) return null;

  // Card positioning
  const getCardStyle = (index: number): React.CSSProperties => {
    let offset = index - activeIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    const absOffset = Math.abs(offset);

    if (absOffset > 2) return { display: "none" };

    const isCenter = offset === 0;
    // Progressive scaling: center=1, ±1=0.88, ±2=0.76
    const scale = isCenter ? 1 : absOffset === 1 ? 0.88 : 0.76;
    // Progressive opacity: center=1, ±1=0.7, ±2=0.45
    const opacity = isCenter ? 1 : absOffset === 1 ? 0.7 : 0.45;
    // Horizontal spread — tighter on mobile to show more cards
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const translateX = offset * (isMobile ? 115 : 280);
    // Vertical lift for center
    const translateY = isCenter ? -8 : absOffset === 1 ? 0 : 8;

    return {
      transform: `translateX(${translateX + (isDragging ? dragOffset : 0)}px) scale(${scale}) translateY(${translateY}px)`,
      opacity,
      zIndex: 10 - absOffset,
      transition: isDragging ? "none" : "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
      position: "absolute",
      left: "50%",
      marginLeft: isMobile ? "-88px" : "-160px",
      filter: isCenter ? "none" : `blur(${absOffset * 0.3}px)`,
      pointerEvents: isCenter ? "auto" as const : "auto" as const,
    };
  };

  return (
    <section className="py-10 sm:py-20 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
      {/* Accent glow behind center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/8 px-4 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="text-accent text-[11px] font-bold uppercase tracking-widest">
              Trending Now
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary">
            Bestsellers & New Arrivals
          </h2>
          <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto leading-relaxed">
            Handpicked by our community — the cases everyone&apos;s talking about
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative h-[280px] sm:h-[500px] cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: 'pan-y' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {trendingProducts.map((product, index) => {
            const style = getCardStyle(index);
            if (style.display === "none") return null;
            const isCenter = index === activeIndex;

            return (
              <div
                key={product.id}
                className="w-[175px] sm:w-[320px]"
                style={style}
                onClick={(e) => {
                  if (isDragging) { e.preventDefault(); e.stopPropagation(); return; }
                  if (!isCenter) { e.preventDefault(); e.stopPropagation(); goTo(index); }
                }}
              >
                <div
                  className={`rounded-2xl transition-shadow duration-600 ${
                    isCenter
                      ? "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-accent/10"
                      : "shadow-lg"
                  }`}
                >
                  <ProductCard product={product} />
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-xl border border-gray-100 flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/30 hover:shadow-2xl transition-all hover:scale-110 active:scale-95"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-xl border border-gray-100 flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/30 hover:shadow-2xl transition-all hover:scale-110 active:scale-95"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {trendingProducts.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-400 ${
                i === activeIndex
                  ? "w-8 h-2.5 bg-accent shadow-sm shadow-accent/30"
                  : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <p className="text-center text-[11px] text-text-muted mt-3 font-medium tracking-wide">
          {activeIndex + 1} / {total}
        </p>
      </div>
    </section>
  );
}
