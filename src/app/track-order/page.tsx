"use client";

import { useState } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import Footer from "@/components/ui/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

// ═══════════════════════════════════════════
// TRACK ORDER PAGE
// Enter order number → see tracking status
// (Currently mock data — will use Shiprocket API)
// ═══════════════════════════════════════════

const MOCK_STATUSES = [
  { label: "Order Placed", done: true, date: "24 Mar 2026" },
  { label: "Confirmed", done: true, date: "24 Mar 2026" },
  { label: "Shipped", done: false, date: "" },
  { label: "Out for Delivery", done: false, date: "" },
  { label: "Delivered", done: false, date: "" },
];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [searched, setSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.length >= 4) {
      setSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <WhatsAppButton />
      <div className="fixed top-0 left-0 right-0 z-50"><AnnouncementBar /></div>
      <div className="fixed top-[32px] left-0 right-0 z-40">
        <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-heading font-bold text-text-primary">LUXEWRAP</span>
              <span className="text-[10px] text-accent font-semibold tracking-widest">INDIA</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm text-text-secondary hover:text-accent transition-colors font-medium">Home</Link>
              <Link href="/#products" className="text-sm text-text-secondary hover:text-accent transition-colors font-medium">Shop</Link>
            </div>
          </div>
        </nav>
      </div>

      <main className="pt-[100px] pb-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-text-primary">
              Track Your Order
            </h1>
            <p className="text-sm text-text-secondary mt-2">
              Enter your order number to see the latest status.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleTrack} className="flex gap-3 mb-10">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => {
                setOrderNumber(e.target.value.toUpperCase());
                setSearched(false);
              }}
              placeholder="e.g. LW-0001"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all bg-gray-50 font-medium tracking-wider"
            />
            <button
              type="submit"
              className="bg-accent hover:bg-accent-dark text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
            >
              TRACK
            </button>
          </form>

          {/* Tracking Result */}
          {searched && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-widest">Order</p>
                  <p className="text-lg font-bold text-accent">{orderNumber}</p>
                </div>
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Processing
                </span>
              </div>

              {/* Timeline */}
              <div className="space-y-0">
                {MOCK_STATUSES.map((status, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        status.done ? "bg-accent border-accent" : "bg-white border-gray-300"
                      }`}>
                        {status.done && (
                          <svg className="w-3 h-3 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      {i < MOCK_STATUSES.length - 1 && (
                        <div className={`w-0.5 h-8 ${status.done ? "bg-accent" : "bg-gray-200"}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-medium ${status.done ? "text-text-primary" : "text-text-muted"}`}>
                        {status.label}
                      </p>
                      {status.date && (
                        <p className="text-xs text-text-muted mt-0.5">{status.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
