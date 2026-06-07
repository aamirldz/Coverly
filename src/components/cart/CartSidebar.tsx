"use client";

import { useCartStore, getCartTotalPrice, getCartItemCount, getCartSavings } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// ═══════════════════════════════════════════
// CART SIDEBAR — Advanced Premium UI
// - Dynamic Free Shipping Progress
// - Slide-to-remove capability (visual only for now)
// - Premium animations & Upsell section
// ═══════════════════════════════════════════

const FREE_SHIPPING_THRESHOLD = 999;

const UPSELL_ITEMS = [
  { id: "up-1", name: "Premium Tempered Glass", price: 299, originalPrice: 599, badge: "Must Have" },
  { id: "up-2", name: "Camera Lens Protector", price: 199, originalPrice: 399, badge: "Popular" }
];

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const subtotal = getCartTotalPrice(items);
  const totalQuantity = getCartItemCount(items);
  const savings = getCartSavings(items);

  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountNeeded = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  if (!isOpen || !mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[100] border-l border-gray-200 flex flex-col shadow-2xl transition-transform duration-300 transform translate-x-0"
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-2xl font-heading font-bold text-text-primary tracking-tight">
              Your Cart
            </h2>
            <p className="text-xs text-text-muted mt-1 font-medium">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"} inside
            </p>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-text-secondary hover:text-text-primary transition-all active:scale-95"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Delivery Progress */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex justify-between items-end mb-2">
            <p className="text-xs font-bold text-text-primary">
              {amountNeeded > 0 ? (
                <>Add <span className="text-accent">{formatPrice(amountNeeded)}</span> for FREE Shipping!</>
              ) : (
                <span className="text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  You unlocked FREE Shipping!
                </span>
              )}
            </p>
            <span className="text-[10px] font-bold text-text-muted">{Math.round(shippingProgress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${amountNeeded > 0 ? "bg-accent" : "bg-green-500"}`}
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {items.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-xl font-heading font-bold text-text-primary mb-2">Your cart is empty</p>
              <p className="text-text-muted text-sm mb-8">Looks like you haven't added anything yet.</p>
              <button
                onClick={closeCart}
                className="bg-text-primary hover:bg-black text-white text-sm font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 w-full sm:w-auto"
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, i) => (
                <div
                  key={item.productId}
                  className="flex gap-4 bg-white rounded-2xl p-3 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all animate-slide-up group"
                  style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden relative border border-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm font-bold text-text-primary truncate block hover:text-accent transition-colors leading-tight"
                        >
                          {item.name}
                        </Link>
                        <p className="text-[11px] text-text-muted mt-1 font-medium">
                          {item.phoneModel} · {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>

                    {/* Price & Quantity */}
                    <div className="flex items-end justify-between mt-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-text-primary">
                            {formatPrice(item.price)}
                          </span>
                          {item.mrp > item.price && (
                            <span className="text-[10px] text-text-muted line-through font-medium">
                              {formatPrice(item.mrp)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-8">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-full flex items-center justify-center text-text-secondary hover:text-accent transition-colors"
                        >
                          −
                        </button>
                        <span className="text-xs font-bold text-text-primary w-6 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                          className="w-8 h-full flex items-center justify-center text-text-secondary hover:text-accent transition-colors disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Upsell Section */}
              <div className="mt-8 pt-6 border-t border-gray-100 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Perfect Add-ons</h3>
                <div className="grid grid-cols-2 gap-3">
                  {UPSELL_ITEMS.map((upsell) => (
                    <div key={upsell.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50 flex flex-col justify-between group">
                      <div>
                        <span className="inline-block bg-white text-[9px] font-bold text-accent px-1.5 py-0.5 rounded shadow-sm mb-2">{upsell.badge}</span>
                        <p className="text-[11px] font-bold text-text-primary leading-tight mb-1">{upsell.name}</p>
                        <p className="text-[10px] text-text-muted"><span className="text-text-primary font-bold">{formatPrice(upsell.price)}</span> <span className="line-through">{formatPrice(upsell.originalPrice)}</span></p>
                      </div>
                      <button className="mt-3 w-full py-1.5 text-[10px] font-bold text-accent bg-accent/10 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
                        + ADD
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom: Subtotal + Checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10">
            {/* Savings */}
            {savings > 0 && (
              <div className="flex items-center justify-center gap-1.5 bg-green-50/80 text-green-700 text-xs font-bold py-2.5 rounded-xl mb-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                You're saving {formatPrice(savings)} today!
              </div>
            )}

            {/* Subtotal */}
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-text-secondary text-sm font-medium">Subtotal</span>
                <p className="text-[10px] text-text-muted mt-0.5">Taxes & shipping calculated at checkout</p>
              </div>
              <span className="text-2xl font-black text-text-primary tabular-nums tracking-tight">
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="relative flex items-center justify-center w-full bg-accent hover:bg-accent-dark text-white text-center py-4 rounded-xl font-bold text-sm transition-all hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                SECURE CHECKOUT
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
