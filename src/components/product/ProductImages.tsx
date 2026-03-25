"use client";

import { useState } from "react";

// ═══════════════════════════════════════════
// PRODUCT IMAGES — Large main image + thumbnail strip
// Click thumbnail to switch main image
// Zoom on hover for desktop
// ═══════════════════════════════════════════

interface ProductImagesProps {
  images: string[];
  productName: string;
}

export default function ProductImages({ images, productName }: ProductImagesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const displayImages = images.length > 0 ? images : ["/products/carbon-fiber.png"];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div
        className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden cursor-crosshair border border-gray-200"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={displayImages[activeIndex]}
          alt={`${productName} - Image ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-200"
          style={{
            transform: isZooming ? "scale(1.8)" : "scale(1)",
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
          }}
        />

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          {activeIndex + 1} / {displayImages.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? "border-accent ring-2 ring-accent/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
