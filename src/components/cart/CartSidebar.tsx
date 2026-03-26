"use client";

import { useCartStore, getCartTotalPrice, getCartItemCount, getCartSavings } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

// ═══════════════════════════════════════════
// CART SIDEBAR — Slide-in from right
// Shows cart items, quantity controls, subtotal
// Opens automatically when item is added
// White theme matching main site design
// ═══════════════════════════════════════════

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();

  const subtotal = getCartTotalPrice(items);
  const totalQuantity = getCartItemCount(items);
  const savings = getCartSavings(items);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[100] border-l border-gray-200 flex flex-col shadow-2xl"
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-heading font-bold text-text-primary">
              Your Cart
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Delivery Banner */}
        {items.length > 0 && (
          <div className="px-5 py-2.5 bg-green-50 border-b border-green-100 text-center">
            <p className="text-xs text-green-700 font-medium">
              🚚 Free delivery on all prepaid orders!
            </p>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-text-primary font-medium mb-1">Your cart is empty</p>
              <p className="text-text-muted text-sm mb-5">Discover our premium phone cases</p>
              <button
                onClick={closeCart}
                className="bg-accent hover:bg-accent-dark text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
              >
                SHOP NOW
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-gray-200 transition-colors"
              >
                {/* Product Image */}
                <div className="w-20 h-20 rounded-lg bg-white flex-shrink-0 overflow-hidden relative border border-gray-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
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
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="text-sm font-medium text-text-primary truncate block hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-text-muted mt-0.5">
                    {item.phoneModel} · {item.color}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-accent">
                      {formatPrice(item.price)}
                    </span>
                    {item.mrp > item.price && (
                      <span className="text-xs text-text-muted line-through">
                        {formatPrice(item.mrp)}
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) {
                          removeItem(item.productId);
                        } else {
                          updateQuantity(item.productId, item.quantity - 1);
                        }
                      }}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-text-primary hover:border-accent hover:text-accent transition-colors text-sm font-bold flex items-center justify-center"
                      aria-label={item.quantity <= 1 ? "Remove item" : "Decrease quantity"}
                    >
                      {item.quantity <= 1 ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      ) : "−"}
                    </button>
                    <span className="text-sm font-semibold text-text-primary w-6 text-center tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-text-primary hover:border-accent hover:text-accent transition-colors text-sm font-bold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>

                    {/* Line Total */}
                    <span className="ml-auto text-sm font-semibold text-text-primary tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom: Subtotal + Checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4 bg-white space-y-3">
            {/* Savings */}
            {savings > 0 && (
              <div className="flex items-center justify-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium py-2 rounded-lg">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                You&apos;re saving {formatPrice(savings)}!
              </div>
            )}

            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Subtotal</span>
              <span className="text-xl font-bold text-text-primary tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Shipping & taxes calculated at checkout
            </p>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-accent hover:bg-accent-dark text-white text-center py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-glow"
            >
              CHECKOUT — {formatPrice(subtotal)}
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center text-sm text-text-secondary hover:text-accent transition-colors py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
