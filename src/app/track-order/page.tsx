"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Timeline from "@/components/ui/Timeline";

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
    <div className="bg-white">
      <div className="pb-20 pt-12">
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
              className="flex-1 border border-gray-200 rounded-button px-4 py-3 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all bg-surface-secondary font-medium tracking-wider"
            />
            <Button type="submit">
              TRACK
            </Button>
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
              <div className="mt-8 ml-2">
                <Timeline steps={MOCK_STATUSES} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
