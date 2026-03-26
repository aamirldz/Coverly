"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/hooks/useCart";
import { useToast } from "@/components/ui/Toast";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

// ═══════════════════════════════════════════
// PRODUCT INFO — Right panel on detail page
// Price, color swatches, quantity, CTA buttons,
// trust badges, and accordion sections
// ═══════════════════════════════════════════

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const { showToast } = useToast();
  const router = useRouter();

  // Prefetch checkout so Buy Now is instantaneous
  import("react").then((React) => {
    React.useEffect(() => {
      router.prefetch("/checkout");
    }, [router]);
  });

  const discount = calculateDiscount(product.price, product.mrp);
  const mainImage = product.images?.[0] || "";
  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: mainImage,
      price: product.price,
      mrp: product.mrp,
      phoneModel: product.phoneModel,
      color: product.color,
      quantity,
    });
    showToast(`${product.name} added to cart!`, "success");
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: mainImage,
      price: product.price,
      mrp: product.mrp,
      phoneModel: product.phoneModel,
      color: product.color,
      quantity,
    });
    router.push("/checkout");
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Phone Model Badge */}
      <div className="inline-flex">
        <span className="bg-gray-100 text-text-secondary text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
          {product.phoneModel}
        </span>
      </div>

      {/* Product Name */}
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary leading-tight">
        {product.name}
      </h1>

      {/* Star Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-sm ${star <= Math.round(avgRating) ? "star-filled" : "star-empty"}`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-sm text-text-secondary">
          {avgRating > 0 ? avgRating.toFixed(1) : "No"} {" "}
          ({product.reviews?.length || 0} reviews)
        </span>
      </div>

      {/* Price Block */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-3xl font-bold text-accent">
          {formatPrice(product.price)}
        </span>
        {product.mrp > product.price && (
          <>
            <span className="text-lg text-text-muted line-through">
              {formatPrice(product.mrp)}
            </span>
            <span className="bg-accent/10 text-accent text-xs font-bold px-2.5 py-1 rounded-full">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      {/* Tax Info */}
      <p className="text-xs text-text-muted -mt-2">
        Inclusive of all taxes. <span className="text-accent">Free delivery</span> on prepaid orders.
      </p>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed">
        {product.description}
      </p>

      {/* Color */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-text-primary">Color:</span>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border-2 border-accent ring-2 ring-accent/20"
            style={{ backgroundColor: product.colorHex }}
            title={product.color}
          />
          <span className="text-sm text-text-secondary">{product.color}</span>
        </div>
      </div>

      {/* Material */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-text-primary">Material:</span>
        <span className="text-sm text-text-secondary capitalize">
          {product.material.replace("_", " ")}
        </span>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-text-primary">Quantity:</span>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 transition-colors text-lg"
          >
            −
          </button>
          <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-text-primary border-x border-gray-200">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stockQty, quantity + 1))}
            className="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 transition-colors text-lg"
          >
            +
          </button>
        </div>
        {product.stockQty <= 5 && product.stockQty > 0 && (
          <span className="text-xs text-error font-medium">
            Only {product.stockQty} left!
          </span>
        )}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 mt-2">
        <button
          onClick={handleAddToCart}
          disabled={product.stockQty === 0}
          className="w-full bg-accent hover:bg-accent-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-glow flex items-center justify-center gap-2 text-sm tracking-wide"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {product.stockQty === 0 ? "OUT OF STOCK" : "ADD TO CART"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stockQty === 0}
          className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-white disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed font-bold py-3.5 rounded-xl transition-all text-sm tracking-wide"
        >
          BUY NOW
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3 mt-2">
        {[
          { icon: "🚚", label: "Free Delivery" },
          { icon: "↩️", label: "7-Day Returns" },
          { icon: "🧲", label: "MagSafe Ready" },
        ].map((badge, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 border border-gray-100"
          >
            <span className="text-xl">{badge.icon}</span>
            <span className="text-[10px] text-text-secondary font-medium">{badge.label}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Accordion Sections */}
      {[
        {
          key: "description",
          title: "Full Description",
          content: product.description,
        },
        {
          key: "specs",
          title: "Specifications",
          content: `Material: ${product.material.replace("_", " ")}\nWeight: ${product.weight}g\nCase Type: ${product.caseType}\nCompatibility: ${product.phoneModel}\nColor: ${product.color}`,
        },
        {
          key: "shipping",
          title: "Shipping & Returns",
          content:
            "Free delivery on all prepaid orders. COD available for ₹50 extra. Delivered in 3-7 business days. 7-day easy return policy — no questions asked.",
        },
      ].map((section) => (
        <div key={section.key} className="border-b border-gray-200 pb-3">
          <button
            onClick={() => toggleAccordion(section.key)}
            className="w-full flex items-center justify-between text-sm font-semibold text-text-primary py-2"
          >
            {section.title}
            <svg
              className={`w-4 h-4 text-text-muted transition-transform ${
                openAccordion === section.key ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openAccordion === section.key && (
            <div className="text-sm text-text-secondary leading-relaxed mt-1 whitespace-pre-line">
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
