"use client";

// ═══════════════════════════════════════════
// ADMIN ORDERS — Order management
// Matching main site design: Playfair + Inter + #FA7000
// ═══════════════════════════════════════════

import { useState } from "react";
import { useAdminStore } from "@/hooks/useAdmin";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

const STATUS_OPTIONS: Order["orderStatus"][] = ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  confirmed: "bg-blue-50 text-blue-600 border-blue-100",
  shipped: "bg-purple-50 text-purple-600 border-purple-100",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-error/10 text-error border-error/20",
  returned: "bg-gray-100 text-text-muted border-gray-200",
};

const statusIcons: Record<string, string> = {
  pending: "⏳",
  confirmed: "✓",
  shipped: "🚚",
  delivered: "✅",
  cancelled: "✕",
  returned: "↩",
};

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useAdminStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.customerEmail.toLowerCase().includes(search.toLowerCase()) || o.customerPhone.includes(search);
    const matchesStatus = statusFilter === "all" || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts: Record<string, number> = { all: orders.length };
  orders.forEach((o) => { statusCounts[o.orderStatus] = (statusCounts[o.orderStatus] || 0) + 1; });

  // Sum totals
  const totalValue = filtered.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-text-primary">Orders</h2>
          <p className="text-sm text-text-muted mt-0.5">{orders.length} total orders · {formatPrice(totalValue)} filtered value</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {["all", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all capitalize flex items-center gap-1.5 border ${
              statusFilter === s
                ? "bg-accent text-white border-accent shadow-sm"
                : "bg-white text-text-muted border-gray-200 hover:border-gray-300"
            }`}
          >
            {s !== "all" && <span className="text-[10px]">{statusIcons[s]}</span>}
            {s === "all" ? "All Orders" : s}
            <span className={`text-[9px] min-w-[18px] text-center px-1.5 py-px rounded-full ${
              statusFilter === s ? "bg-white/20" : "bg-gray-100"
            }`}>
              {statusCounts[s] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-card">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all placeholder:text-text-muted"
            placeholder="Search by order #, customer name, email, or phone..."
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Order</th>
                <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Customer</th>
                <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Product</th>
                <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Total</th>
                <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Payment</th>
                <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id} className={`border-t border-gray-50 hover:bg-accent/[0.02] transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                  <td className="px-6 py-3">
                    <p className="text-[13px] font-semibold text-text-primary">{o.orderNumber}</p>
                    <p className="text-[10px] text-text-muted">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-[13px] text-text-secondary">{o.customerName}</p>
                    <p className="text-[10px] text-text-muted">{o.city}, {o.state}</p>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-[13px] text-text-secondary truncate max-w-[180px]">{o.items[0]?.productName}</p>
                    <p className="text-[10px] text-text-muted">× {o.items[0]?.quantity}</p>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-[13px] font-semibold text-text-primary">{formatPrice(o.total)}</p>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      o.paymentMethod === "razorpay" ? "bg-blue-50 text-blue-600" : "bg-warning/10 text-warning"
                    }`}>
                      {o.paymentMethod === "razorpay" ? "Online" : "COD"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value as Order["orderStatus"])}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border outline-none cursor-pointer capitalize ${statusColors[o.orderStatus] || ""}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="capitalize text-text-primary bg-white">{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button onClick={() => setSelectedOrder(o)} className="text-[11px] text-accent hover:underline font-semibold px-3 py-1 rounded-lg hover:bg-accent/5 transition-colors">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-text-muted">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
              <p className="text-sm font-medium">No orders found</p>
              <p className="text-[11px] mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-body">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-heading font-bold text-text-primary">Order {selectedOrder.orderNumber}</h2>
                <p className="text-[10px] text-text-muted">{new Date(selectedOrder.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-text-muted hover:text-text-primary p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full capitalize border ${statusColors[selectedOrder.orderStatus]}`}>
                  {statusIcons[selectedOrder.orderStatus]} {selectedOrder.orderStatus}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  selectedOrder.paymentMethod === "razorpay" ? "bg-blue-50 text-blue-600" : "bg-warning/10 text-warning"
                }`}>
                  {selectedOrder.paymentMethod === "razorpay" ? "Paid Online" : "Cash on Delivery"}
                </span>
              </div>

              {/* Customer */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-[10px] font-semibold text-accent uppercase tracking-[0.15em] mb-2">Customer</p>
                <p className="text-[13px] font-semibold text-text-primary">{selectedOrder.customerName}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{selectedOrder.customerEmail}</p>
                <p className="text-[11px] text-text-muted">{selectedOrder.customerPhone}</p>
              </div>

              {/* Address */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-[10px] font-semibold text-accent uppercase tracking-[0.15em] mb-2">Shipping Address</p>
                <p className="text-[13px] text-text-secondary">
                  {selectedOrder.addressLine1}<br />
                  {selectedOrder.city}, {selectedOrder.state} — {selectedOrder.pincode}
                </p>
              </div>

              {/* Items */}
              <div>
                <p className="text-[10px] font-semibold text-accent uppercase tracking-[0.15em] mb-3">Items Ordered</p>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-[13px] font-medium text-text-primary">{item.productName}</p>
                      <p className="text-[10px] text-text-muted">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <p className="text-[13px] font-semibold text-text-primary">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="text-text-secondary">{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-text-muted">Shipping</span>
                  <span className="text-text-secondary">{selectedOrder.shippingCost === 0 ? "Free" : formatPrice(selectedOrder.shippingCost)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-text-muted">Discount</span>
                    <span className="text-success font-medium">−{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2.5 mt-2">
                  <span className="text-text-primary">Total</span>
                  <span className="text-accent text-base">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Tracking */}
              {selectedOrder.trackingId && (
                <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">
                  <p className="text-[10px] font-semibold text-accent uppercase tracking-[0.15em] mb-1.5">Tracking ID</p>
                  <p className="text-[13px] font-mono font-semibold text-text-primary">{selectedOrder.trackingId}</p>
                  {selectedOrder.estimatedDelivery && (
                    <p className="text-[10px] text-text-muted mt-1">Est. delivery: {new Date(selectedOrder.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
