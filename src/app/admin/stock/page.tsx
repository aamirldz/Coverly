"use client";

// ═══════════════════════════════════════════
// ADMIN STOCK — Inventory management
// Matching main site design: Playfair + Inter + #FA7000
// ═══════════════════════════════════════════

import { useState } from "react";
import { useAdminStore } from "@/hooks/useAdmin";
import { formatPrice } from "@/lib/utils";

export default function AdminStockPage() {
  const { products, updateProductStock, orders } = useAdminStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Sold counts from orders
  const soldCounts: Record<string, number> = {};
  orders.forEach((o) => { o.items.forEach((item) => { soldCounts[item.productId] = (soldCounts[item.productId] || 0) + item.quantity; }); });

  // Filter
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    if (filter === "in_stock") return matchesSearch && p.stockQty > 5;
    if (filter === "low_stock") return matchesSearch && p.stockQty > 0 && p.stockQty <= 5;
    if (filter === "out_of_stock") return matchesSearch && p.stockQty <= 0;
    return matchesSearch;
  });

  const inStock = products.filter((p) => p.stockQty > 5).length;
  const lowStock = products.filter((p) => p.stockQty > 0 && p.stockQty <= 5).length;
  const outOfStock = products.filter((p) => p.stockQty <= 0).length;
  const totalUnits = products.reduce((sum, p) => sum + p.stockQty, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQty), 0);

  const handleStockChange = (productId: string, delta: number, currentStock: number) => {
    updateProductStock(productId, Math.max(0, currentStock + delta));
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-text-primary">Inventory</h2>
        <p className="text-sm text-text-muted mt-0.5">Monitor stock levels and manage restock alerts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-accent/8 rounded-xl flex items-center justify-center text-sm">📦</div>
          </div>
          <p className="text-2xl font-heading font-bold text-text-primary">{totalUnits}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mt-0.5">Total Units</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-accent/8 rounded-xl flex items-center justify-center text-sm">💰</div>
          </div>
          <p className="text-2xl font-heading font-bold text-text-primary">{formatPrice(totalValue)}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mt-0.5">Stock Value</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-success/8 rounded-xl flex items-center justify-center text-sm">✅</div>
          </div>
          <p className="text-2xl font-heading font-bold text-success">{inStock}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mt-0.5">In Stock</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-warning/8 rounded-xl flex items-center justify-center text-sm">⚠️</div>
          </div>
          <p className="text-2xl font-heading font-bold text-warning">{lowStock}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mt-0.5">Low Stock</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-error/8 rounded-xl flex items-center justify-center text-sm">🚫</div>
          </div>
          <p className="text-2xl font-heading font-bold text-error">{outOfStock}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mt-0.5">Out of Stock</p>
        </div>
      </div>

      {/* Alerts */}
      {lowStock > 0 && (
        <div className="bg-warning/5 border border-warning/15 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-warning/10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm">⚠️</div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-text-primary mb-1">Low Stock Alert</p>
              <div className="space-y-1">
                {products.filter((p) => p.stockQty > 0 && p.stockQty <= 5).map((p) => (
                  <p key={p.id} className="text-[11px] text-text-secondary">
                    <span className="font-semibold text-warning">{p.name}</span> — only {p.stockQty} unit(s) remaining
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {outOfStock > 0 && (
        <div className="bg-error/5 border border-error/15 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-error/10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm">🚫</div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-text-primary mb-1">Out of Stock</p>
              <div className="space-y-1">
                {products.filter((p) => p.stockQty <= 0).map((p) => (
                  <p key={p.id} className="text-[11px] text-text-secondary">
                    <span className="font-semibold text-error">{p.name}</span> — needs immediate restock!
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-card flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all placeholder:text-text-muted" placeholder="Search by product name or SKU..." />
        </div>
        <div className="flex gap-1.5">
          {[
            { key: "all", label: "All", count: products.length },
            { key: "in_stock", label: "In Stock", count: inStock },
            { key: "low_stock", label: "Low Stock", count: lowStock },
            { key: "out_of_stock", label: "Out of Stock", count: outOfStock },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 border ${
                filter === f.key ? "bg-accent text-white border-accent shadow-sm" : "bg-gray-50 text-text-muted border-gray-200 hover:border-gray-300"
              }`}
            >
              {f.label}
              <span className={`text-[9px] min-w-[18px] text-center px-1.5 py-px rounded-full ${filter === f.key ? "bg-white/20" : "bg-gray-200/80"}`}>{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Product</th>
                <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-3">SKU</th>
                <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Price</th>
                <th className="text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-3">In Stock</th>
                <th className="text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Sold</th>
                <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Quick Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const sold = soldCounts[p.id] || 0;
                const statusText = p.stockQty <= 0 ? "Out of Stock" : p.stockQty <= 5 ? "Low Stock" : "In Stock";
                const statusClass = p.stockQty <= 0 ? "bg-error/10 text-error" : p.stockQty <= 5 ? "bg-warning/10 text-warning" : "bg-success/10 text-success";

                return (
                  <tr key={p.id} className={`border-t border-gray-50 hover:bg-accent/[0.02] transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {p.images[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-text-muted">📦</div>}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-text-primary truncate max-w-[160px]">{p.name}</p>
                          <p className="text-[10px] text-text-muted">{p.phoneModel}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-[11px] text-text-muted font-mono bg-gray-50 px-2 py-0.5 rounded">{p.sku}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-[13px] font-semibold text-text-primary">{formatPrice(p.price)}</span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className={`text-lg font-bold ${p.stockQty <= 0 ? "text-error" : p.stockQty <= 5 ? "text-warning" : "text-text-primary"}`}>{p.stockQty}</span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className="text-[13px] text-text-secondary">{sold}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusClass}`}>{statusText}</span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleStockChange(p.id, -5, p.stockQty)}
                          disabled={p.stockQty <= 0}
                          className="w-7 h-7 bg-gray-50 border border-gray-200 hover:bg-error/5 hover:border-error/20 text-text-muted hover:text-error rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-bold"
                        >
                          −5
                        </button>
                        <button
                          onClick={() => handleStockChange(p.id, -1, p.stockQty)}
                          disabled={p.stockQty <= 0}
                          className="w-7 h-7 bg-gray-50 border border-gray-200 hover:bg-error/5 hover:border-error/20 text-text-muted hover:text-error rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={p.stockQty}
                          onChange={(e) => updateProductStock(p.id, Math.max(0, Number(e.target.value)))}
                          className="w-14 text-center bg-gray-50 border border-gray-200 rounded-lg py-1 text-[13px] font-semibold focus:border-accent focus:ring-1 focus:ring-accent/10 outline-none text-text-primary"
                        />
                        <button
                          onClick={() => handleStockChange(p.id, 1, p.stockQty)}
                          className="w-7 h-7 bg-gray-50 border border-gray-200 hover:bg-success/5 hover:border-success/20 text-text-muted hover:text-success rounded-lg flex items-center justify-center transition-all text-sm font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleStockChange(p.id, 10, p.stockQty)}
                          className="px-2 py-1 bg-accent/8 border border-accent/15 text-accent text-[10px] font-bold rounded-lg hover:bg-accent/15 transition-all"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-text-muted">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
              </svg>
              <p className="text-sm font-medium">No products found</p>
              <p className="text-[11px] mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
