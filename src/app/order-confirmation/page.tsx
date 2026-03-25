"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import Footer from "@/components/ui/Footer";
import { formatPrice } from "@/lib/utils";

// ═══════════════════════════════════════════
// ORDER CONFIRMATION PAGE — Success state
// Shows order details after successful checkout
// Reads order data from localStorage
// ═══════════════════════════════════════════

interface OrderData {
  orderNumber: string;
  items: Array<{
    name: string;
    phoneModel: string;
    color: string;
    quantity: number;
    price: number;
    mrp: number;
    image: string;
  }>;
  subtotal: number;
  savings: number;
  shippingCost: number;
  prepaidDiscount: number;
  total: number;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    pincode: string;
  };
  orderDate: string;
}

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem("lastOrder");
      if (savedOrder) {
        const parsed = JSON.parse(savedOrder);
        setOrder(parsed);
      }
    } catch {
      // Corrupted localStorage data
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <div className="fixed top-0 left-0 right-0 z-50"><AnnouncementBar /></div>
        <div className="flex items-center justify-center min-h-screen pt-[88px]">
          <div className="text-center px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">No order found</h1>
            <p className="text-text-secondary text-sm mb-6">You haven&apos;t placed any orders recently.</p>
            <Link href="/" className="text-accent font-semibold text-sm hover:underline">← Back to shop</Link>
          </div>
        </div>
      </div>
    );
  }

  const orderDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-50"><AnnouncementBar /></div>
      <div className="fixed top-[32px] left-0 right-0 z-40">
        <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-heading font-bold text-text-primary">LUXEWRAP</span>
              <span className="text-[10px] text-accent font-semibold tracking-widest">INDIA</span>
            </Link>
          </div>
        </nav>
      </div>

      <main className="pt-[100px] pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Success Hero */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {/* Confetti dots */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <div className="absolute -bottom-1 -left-2 w-2.5 h-2.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
              <div className="absolute top-0 -left-3 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.6s" }} />
            </div>
            <h1 className="text-3xl font-heading font-bold text-text-primary">
              Order Confirmed!
            </h1>
            <p className="text-text-secondary mt-2">
              Thank you, {order.customerName}! Your order has been placed successfully.
            </p>
          </div>

          {/* Order Number Card */}
          <div className="bg-accent/5 border-2 border-accent/20 rounded-2xl p-6 text-center mb-8">
            <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Order Number</p>
            <p className="text-3xl font-bold text-accent font-heading tracking-wide">
              {order.orderNumber}
            </p>
            {orderDate && (
              <p className="text-xs text-text-muted mt-2">Placed on {orderDate}</p>
            )}
          </div>

          {/* Order Details Card */}
          <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 shadow-sm">
            {/* Items */}
            <div className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                      <p className="text-xs text-text-muted">{item.phoneModel} · {item.color} · Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-text-primary tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="p-5 space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(order.subtotal)}</span>
              </div>
              {order.savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>MRP Savings</span>
                  <span className="tabular-nums">-{formatPrice(order.savings)}</span>
                </div>
              )}
              {order.prepaidDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Prepaid Discount</span>
                  <span className="tabular-nums">-{formatPrice(order.prepaidDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span className={order.shippingCost === 0 ? "text-green-600 font-medium" : "tabular-nums"}>
                  {order.shippingCost === 0 ? "FREE" : formatPrice(order.shippingCost)}
                </span>
              </div>
              <hr className="border-gray-100 !my-3" />
              <div className="flex justify-between text-base font-bold">
                <span className="text-text-primary">Total Paid</span>
                <span className="text-accent tabular-nums">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Payment & Shipping */}
            <div className="p-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Payment</span>
                <span className="font-medium text-text-primary">
                  {order.paymentMethod === "online" ? "💳 Paid Online" : "💵 Cash on Delivery"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Email</span>
                <span className="font-medium text-text-primary">{order.customerEmail}</span>
              </div>
              {order.customerPhone && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Phone</span>
                  <span className="font-medium text-text-primary">+91 {order.customerPhone}</span>
                </div>
              )}
              {order.shippingAddress && (
                <div className="flex justify-between text-sm items-start">
                  <span className="text-text-secondary">Ship to</span>
                  <span className="font-medium text-text-primary text-right max-w-[60%]">
                    {order.shippingAddress.address1}
                    {order.shippingAddress.address2 && `, ${order.shippingAddress.address2}`}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 space-y-3">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-text-primary">Order confirmation sent</p>
                <p className="text-xs text-text-muted">Check {order.customerEmail} for details.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <div>
                <p className="text-sm font-medium text-text-primary">Estimated delivery: 3–7 business days</p>
                <p className="text-xs text-text-muted">We&apos;ll share tracking details once shipped.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link
              href="/track-order"
              className="flex-1 text-center bg-accent hover:bg-accent-dark text-white font-bold py-3.5 rounded-xl transition-all text-sm"
            >
              TRACK YOUR ORDER
            </Link>
            <Link
              href="/"
              className="flex-1 text-center border-2 border-gray-200 hover:border-accent text-text-secondary hover:text-accent font-bold py-3.5 rounded-xl transition-all text-sm"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
