"use client";

// ═══════════════════════════════════════════
// ADMIN DASHBOARD — Premium analytics dashboard
// Matching main site: Playfair headings, Inter body, accent orange
// ═══════════════════════════════════════════

import { useAdminStore } from "@/hooks/useAdmin";
import { formatPrice } from "@/lib/utils";

// ── REVENUE BAR CHART ──
function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  const maxVal = Math.max(...data.map((d) => d.revenue), 1);
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <div>
      {/* Chart header with total */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-2xl font-heading font-bold text-text-primary">{formatPrice(totalRevenue)}</p>
          <p className="text-[11px] text-text-muted">30-day total</p>
        </div>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-[3px] h-[160px] w-full mt-4">
        {data.map((d, i) => {
          const height = maxVal > 0 ? (d.revenue / maxVal) * 100 : 0;
          const isToday = i === data.length - 1;
          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-text-primary text-white text-[9px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
                <p className="font-semibold">{formatPrice(d.revenue)}</p>
                <p className="text-white/60">{new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
              </div>
              <div
                className={`w-full rounded-t-sm transition-all cursor-pointer min-h-[2px] ${
                  isToday ? "bg-accent" : "bg-accent/30 hover:bg-accent/60"
                }`}
                style={{ height: `${Math.max(height, 2)}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* X axis labels */}
      <div className="flex justify-between mt-2">
        <span className="text-[9px] text-text-muted">
          {new Date(data[0]?.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </span>
        <span className="text-[9px] text-text-muted">
          {new Date(data[Math.floor(data.length / 2)]?.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </span>
        <span className="text-[9px] text-text-muted font-semibold">Today</span>
      </div>
    </div>
  );
}

// ── STATUS DONUT ──
function StatusDonut({ data }: { data: { status: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const colors: Record<string, string> = {
    delivered: "#22C55E",
    shipped: "#A855F7",
    confirmed: "#3B82F6",
    pending: "#F59E0B",
    cancelled: "#EF4444",
    returned: "#6B7280",
  };

  let cumulativePercent = 0;
  const segments = data.map((d) => {
    const percent = total > 0 ? (d.count / total) * 100 : 0;
    const start = cumulativePercent;
    cumulativePercent += percent;
    return { ...d, percent, start, color: colors[d.status] || "#E5E7EB" };
  });

  const gradientStops = segments
    .map((s) => `${s.color} ${s.start}% ${s.start + s.percent}%`)
    .join(", ");

  return (
    <div className="flex items-center gap-6">
      <div
        className="w-24 h-24 rounded-full flex-shrink-0 relative"
        style={{ background: `conic-gradient(${gradientStops})` }}
      >
        <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-bold text-text-primary">{total}</p>
            <p className="text-[8px] text-text-muted uppercase tracking-wider">Orders</p>
          </div>
        </div>
      </div>
      <div className="space-y-1.5 flex-1">
        {segments.map((s) => (
          <div key={s.status} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="text-[11px] text-text-secondary capitalize">{s.status}</span>
            </div>
            <span className="text-[11px] font-semibold text-text-primary">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { stats, orders, products } = useAdminStore();

  if (!stats) return null;

  const recentOrders = orders.slice(0, 6);
  const lowStockProducts = products.filter((p) => p.stockQty > 0 && p.stockQty <= 5);
  const outOfStockProducts = products.filter((p) => p.stockQty <= 0);

  const statusBadgeClass: Record<string, string> = {
    pending: "bg-warning/10 text-warning",
    confirmed: "bg-blue-50 text-blue-600",
    shipped: "bg-purple-50 text-purple-600",
    delivered: "bg-success/10 text-success",
    cancelled: "bg-error/10 text-error",
    returned: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-text-primary">Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"} 👋</h2>
        <p className="text-sm text-text-muted mt-1">Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: "₹", bgColor: "bg-accent/8", iconColor: "text-accent", change: "+12.5%", changeColor: "text-success" },
          { label: "Total Orders", value: String(stats.totalOrders), icon: "📦", bgColor: "bg-blue-50", iconColor: "text-blue-600", change: "+8.2%", changeColor: "text-success" },
          { label: "Avg Order Value", value: formatPrice(stats.avgOrderValue), icon: "📊", bgColor: "bg-purple-50", iconColor: "text-purple-600", change: "+3.1%", changeColor: "text-success" },
          { label: "Delivery Rate", value: `${stats.deliveryRate}%`, icon: "🚚", bgColor: "bg-success/8", iconColor: "text-success", change: "On Track", changeColor: "text-success" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 ${stat.bgColor} rounded-xl flex items-center justify-center text-lg`}>
                {stat.icon}
              </div>
              <span className={`text-[11px] font-semibold ${stat.changeColor} bg-success/8 px-2 py-0.5 rounded-full`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-heading font-bold text-text-primary">{stat.value}</p>
            <p className="text-[11px] text-text-muted mt-1 uppercase tracking-wider font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── ALERTS ── */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="bg-warning/5 border border-warning/20 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-warning/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary mb-1">Inventory Alerts</p>
              <p className="text-xs text-text-secondary">
                {lowStockProducts.length > 0 && <span className="text-warning font-medium">{lowStockProducts.length} product(s) running low</span>}
                {lowStockProducts.length > 0 && outOfStockProducts.length > 0 && " · "}
                {outOfStockProducts.length > 0 && <span className="text-error font-medium">{outOfStockProducts.length} product(s) out of stock</span>}
              </p>
            </div>
            <a href="/admin/stock" className="ml-auto text-xs text-accent font-semibold hover:underline whitespace-nowrap">
              View Stock →
            </a>
          </div>
        </div>
      )}

      {/* ── CHARTS ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Revenue Trend</h3>
            <span className="text-[10px] text-text-muted bg-gray-50 px-2.5 py-1 rounded-full">Last 30 Days</span>
          </div>
          <RevenueChart data={stats.revenueByDay} />
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-5">Order Status</h3>
          <StatusDonut data={stats.ordersByStatus} />

          {/* Payment Split */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-3">Payment Method</h4>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-accent h-full rounded-full transition-all" style={{ width: `${stats.onlinePercentage}%` }} />
              </div>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-accent font-semibold">Online {stats.onlinePercentage}%</span>
              <span className="text-text-muted">COD {stats.codPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: TOP PRODUCTS + RECENT ORDERS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Top Products</h3>
          </div>
          <div className="space-y-4">
            {stats.topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                  i === 0 ? "bg-accent/10 text-accent" : "bg-gray-50 text-text-muted"
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-primary truncate">{p.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-text-muted">{p.sold} sold</span>
                    <span className="text-[10px] font-semibold text-accent">{formatPrice(p.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="p-6 pb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Recent Orders</h3>
            <a href="/admin/orders" className="text-[11px] text-accent hover:underline font-semibold">View All →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-gray-50 bg-gray-50/50">
                  <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-2.5">Order</th>
                  <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-2.5">Customer</th>
                  <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-2.5">Total</th>
                  <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-2.5">Payment</th>
                  <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-6 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <p className="text-[13px] font-semibold text-text-primary">{order.orderNumber}</p>
                      <p className="text-[10px] text-text-muted">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                    </td>
                    <td className="px-6 py-3">
                      <p className="text-[13px] text-text-secondary">{order.customerName}</p>
                    </td>
                    <td className="px-6 py-3">
                      <p className="text-[13px] font-semibold text-text-primary">{formatPrice(order.total)}</p>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        order.paymentMethod === "razorpay" ? "bg-blue-50 text-blue-600" : "bg-warning/10 text-warning"
                      }`}>
                        {order.paymentMethod === "razorpay" ? "Online" : "COD"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusBadgeClass[order.orderStatus] || "bg-gray-100 text-text-muted"}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
