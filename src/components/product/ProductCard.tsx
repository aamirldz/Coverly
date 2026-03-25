"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/hooks/useCart";
import { useToast } from "@/components/ui/Toast";
import { formatPrice, calculateDiscount, getBadgeClass, getBadgeText } from "@/lib/utils";
import type { Product } from "@/types";

// ═══════════════════════════════════════════
// ⭐ PRODUCT CARD — THE MOST IMPORTANT COMPONENT
// 3D tilt on hover + orange glow following cursor
// Hover-to-play 360° video (PeachWeb technique)
// Badge system (NEW/BESTSELLER/FOR_HER/LOW_STOCK)
// Slide-up Add to Cart button
// ═══════════════════════════════════════════

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { showToast } = useToast();

  const discount = calculateDiscount(product.price, product.mrp);
  const mainImage = product.images?.[0] || "";

  // ── 3D TILT EFFECT ──
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !glowRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate tilt angles (max ±12 degrees)
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

    // Move orange glow to follow cursor
    glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(250, 112, 0, 0.2), transparent 60%)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !glowRef.current) return;

    cardRef.current.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    glowRef.current.style.background = "transparent";

    setIsHovered(false);

    // Pause video
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);

    // Play 360° video on hover
    if (product.videoUrl && videoRef.current) {
      if (!videoLoaded) {
        videoRef.current.src = product.videoUrl;
        videoRef.current.load();
        setVideoLoaded(true);
      }
      videoRef.current.play().catch(() => {});
    }
  };

  // ── ADD TO CART ──
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: mainImage,
      price: product.price,
      mrp: product.mrp,
      phoneModel: product.phoneModel,
      color: product.color,
      quantity: 1,
    });

    showToast(`${product.name} added to cart!`, "success");
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div
        ref={cardRef}
        className="product-card relative bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        {/* ── GLOW OVERLAY ── */}
        <div ref={glowRef} className="glow-overlay rounded-card" />

        {/* ── BADGE ── */}
        {product.badge && (
          <div className={`badge ${getBadgeClass(product.badge)} absolute top-3 left-3 z-10`}>
            {getBadgeText(product.badge)}
          </div>
        )}

        {/* ── DISCOUNT BADGE ── */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 z-10 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {discount}% OFF
          </div>
        )}

        {/* ── IMAGE / VIDEO AREA ── */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {/* Static Image (always visible, fades on hover if video exists) */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isHovered && product.videoUrl ? "opacity-0" : "opacity-100"
            }`}
          >
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 175px, 320px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-4xl opacity-30">📱</span>
              </div>
            )}
          </div>

          {/* 360° Video (lazy-loaded on first hover) */}
          {product.videoUrl && (
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover video-layer ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              loop
              muted
              playsInline
              preload="none"
            />
          )}
        </div>

        {/* ── PRODUCT INFO ── */}
        <div className="p-3 sm:p-4">
          {/* Phone Model */}
          <p className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider">
            {product.phoneModel}
          </p>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-semibold text-text-primary mt-1 line-clamp-1">
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            {(() => {
              const avgRating = product.reviews && product.reviews.length > 0
                ? Math.round(product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length)
                : 0;
              return [1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-xs ${star <= avgRating ? "star-filled" : "star-empty"}`}
                >
                  ★
                </span>
              ));
            })()}
            <span className="text-[10px] text-text-muted ml-1">
              ({product.reviews?.length || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base sm:text-lg font-bold text-accent">
              {formatPrice(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-text-muted line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>
        </div>

        {/* ── SLIDE-UP ADD TO CART BUTTON ── */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <div className="cart-button-wrapper p-3 sm:p-4 pt-0">
            <button
              onClick={handleAddToCart}
              className="w-full bg-accent hover:bg-accent-dark text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
