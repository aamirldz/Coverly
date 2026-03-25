"use client";

// ═══════════════════════════════════════════
// ADMIN REPORTS — Advanced Sales Analytics
// Connected to real order + product data
// Profit margins, customer insights, comparison
// Today / Yesterday / Week / Month / Custom
// CSV export for all sections
// ═══════════════════════════════════════════

import { useState, useMemo } from "react";
import { useAdminStore } from "@/hooks/useAdmin";
import { formatPrice } from "@/lib/utils";
import type { Order, Product } from "@/types";

// ── DATE RANGE TYPES ──
type DateRange = "today" | "yesterday" | "7days" | "30days" | "this_month" | "custom";

const RANGE_LABELS: Record<DateRange, string> = {
  today: "Today",
  yesterday: "Yesterday",
  "7days": "Last 7 Days",
  "30days": "Last 30 Days",
  this_month: "This Month",
  custom: "Custom Range",
};

function getDateRange(range: DateRange, customStart?: string, customEnd?: string): { start: Date; end: Date } {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000 - 1);

  switch (range) {
    case "today":
      return { start: todayStart, end: todayEnd };
    case "yesterday": {
      const ys = new Date(todayStart.getTime() - 86400000);
      return { start: ys, end: new Date(ys.getTime() + 86400000 - 1) };
    }
    case "7days":
      return { start: new Date(todayStart.getTime() - 6 * 86400000), end: todayEnd };
    case "30days":
      return { start: new Date(todayStart.getTime() - 29 * 86400000), end: todayEnd };
    case "this_month":
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: todayEnd };
    case "custom":
      return {
        start: customStart ? new Date(customStart) : todayStart,
        end: customEnd ? new Date(new Date(customEnd).getTime() + 86400000 - 1) : todayEnd,
      };
    default:
      return { start: todayStart, end: todayEnd };
  }
}

// Get the PREVIOUS period for comparison (e.g. if 7 days, compare to the 7 days before that)
function getPreviousPeriod(range: DateRange, customStart?: string, customEnd?: string): { start: Date; end: Date } {
  const { start, end } = getDateRange(range, customStart, customEnd);
  const duration = end.getTime() - start.getTime();
  return {
    start: new Date(start.getTime() - duration - 1),
    end: new Date(start.getTime() - 1),
  };
}

// ── CSV EXPORT ──
function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── MINI BAR CHART ──
function BarChart({ data, maxVal }: { data: { label: string; value: number }[]; maxVal: number }) {
  return (
    <div className="flex items-end gap-[2px] h-[120px] w-full">
      {data.map((d, i) => {
        const height = maxVal > 0 ? (d.value / maxVal) * 100 : 0;
        const isLast = i === data.length - 1;
        return (
          <div key={i} className="flex-1 flex flex-col items-center group relative">
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-text-primary text-white text-[9px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
              <p className="font-semibold">{formatPrice(d.value)}</p>
              <p className="text-white/60">{d.label}</p>
            </div>
            <div
              className={`w-full rounded-t-sm transition-all cursor-pointer min-h-[2px] ${
                isLast ? "bg-accent" : "bg-accent/25 hover:bg-accent/50"
              }`}
              style={{ height: `${Math.max(height, 2)}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── CHANGE INDICATOR ──
function ChangeIndicator({ current, previous, label }: { current: number; previous: number; label?: string }) {
  if (previous === 0 && current === 0) return <span className="text-[10px] text-text-muted">No data</span>;
  if (previous === 0) return <span className="text-[10px] text-success font-semibold">🆕 New</span>;

  const change = ((current - previous) / previous) * 100;
  const isPositive = change >= 0;

  return (
    <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${isPositive ? "text-success" : "text-error"}`}>
      {isPositive ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
      {label && <span className="text-text-muted font-normal ml-0.5">vs prev</span>}
    </span>
  );
}

// ── CALCULATE ORDER STATS ──
function calculateStats(orders: Order[], allProducts: Product[]) {
  const total = orders.length;
  const delivered = orders.filter((o) => o.orderStatus === "delivered");
  const confirmed = orders.filter((o) => o.orderStatus === "confirmed");
  const shipped = orders.filter((o) => o.orderStatus === "shipped");
  const pending = orders.filter((o) => o.orderStatus === "pending");
  const cancelled = orders.filter((o) => o.orderStatus === "cancelled");
  const returned = orders.filter((o) => o.orderStatus === "returned");

  // Revenue = only delivered orders count as actual revenue
  const revenue = delivered.reduce((s, o) => s + o.total, 0);
  // Pipeline = confirmed + shipped (money expected)
  const pipeline = [...confirmed, ...shipped].reduce((s, o) => s + o.total, 0);
  // All orders value
  const grossValue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = total > 0 ? grossValue / total : 0;

  // Payment methods
  const online = orders.filter((o) => o.paymentMethod === "razorpay").length;
  const cod = total - online;
  const onlineRevenue = orders.filter((o) => o.paymentMethod === "razorpay").reduce((s, o) => s + o.total, 0);
  const codRevenue = orders.filter((o) => o.paymentMethod === "cod").reduce((s, o) => s + o.total, 0);

  // Shipping & discounts
  const totalShipping = orders.reduce((s, o) => s + o.shippingCost, 0);
  const totalDiscount = orders.reduce((s, o) => s + o.discount, 0);

  // Profit calculation using costPrice from products
  const productMap = new Map(allProducts.map((p) => [p.id, p]));
  let totalCost = 0;
  let totalItemsSold = 0;
  delivered.forEach((o) => {
    o.items.forEach((item) => {
      const product = productMap.get(item.productId);
      const costPrice = product?.costPrice || 0;
      totalCost += costPrice * item.quantity;
      totalItemsSold += item.quantity;
    });
  });
  const grossProfit = revenue - totalCost;
  const profitMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  return {
    total, revenue, pipeline, grossValue, avgOrder,
    online, cod, onlineRevenue, codRevenue,
    totalShipping, totalDiscount,
    delivered: delivered.length, confirmed: confirmed.length,
    shipped: shipped.length, pending: pending.length,
    cancelled: cancelled.length, returned: returned.length,
    totalCost, grossProfit, profitMargin, totalItemsSold,
  };
}

export default function AdminReportsPage() {
  const { orders, products } = useAdminStore();
  const [activeRange, setActiveRange] = useState<DateRange>("7days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "customers" | "orders">("overview");

  // ── FILTER ORDERS BY DATE RANGE ──
  const filteredOrders = useMemo(() => {
    const { start, end } = getDateRange(activeRange, customStart, customEnd);
    return orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= start && d <= end;
    });
  }, [orders, activeRange, customStart, customEnd]);

  // Previous period for comparison
  const previousOrders = useMemo(() => {
    const { start, end } = getPreviousPeriod(activeRange, customStart, customEnd);
    return orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= start && d <= end;
    });
  }, [orders, activeRange, customStart, customEnd]);

  // ── STATS ──
  const stats = useMemo(() => calculateStats(filteredOrders, products), [filteredOrders, products]);
  const prevStats = useMemo(() => calculateStats(previousOrders, products), [previousOrders, products]);

  // ── DAILY REVENUE BREAKDOWN ──
  const revenueByDay = useMemo(() => {
    const { start, end } = getDateRange(activeRange, customStart, customEnd);
    const days: { label: string; value: number; orders: number }[] = [];
    const current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().split("T")[0];
      const dayLabel = current.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      const dayOrders = filteredOrders.filter((o) => o.createdAt.startsWith(dateStr));
      const dayRevenue = dayOrders.filter((o) => o.orderStatus === "delivered").reduce((s, o) => s + o.total, 0);
      days.push({ label: dayLabel, value: dayRevenue, orders: dayOrders.length });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [filteredOrders, activeRange, customStart, customEnd]);

  // ── PRODUCT PERFORMANCE ──
  const productPerformance = useMemo(() => {
    const productMap = new Map(products.map((p) => [p.id, p]));
    const perfMap: Record<string, {
      id: string; name: string; sku: string; qtySold: number; revenue: number;
      costPrice: number; profit: number; margin: number; ordersCount: number;
      caseType: string; phoneBrand: string; currentStock: number;
    }> = {};

    filteredOrders.forEach((o) => {
      o.items.forEach((item) => {
        const product = productMap.get(item.productId);
        if (!perfMap[item.productId]) {
          perfMap[item.productId] = {
            id: item.productId,
            name: item.productName,
            sku: product?.sku || "—",
            qtySold: 0, revenue: 0, costPrice: 0, profit: 0, margin: 0,
            ordersCount: 0, caseType: product?.caseType || "—",
            phoneBrand: product?.phoneBrand || "—",
            currentStock: product?.stockQty || 0,
          };
        }
        const cost = (product?.costPrice || 0) * item.quantity;
        const rev = item.price * item.quantity;
        perfMap[item.productId].qtySold += item.quantity;
        perfMap[item.productId].revenue += rev;
        perfMap[item.productId].costPrice += cost;
        perfMap[item.productId].profit += rev - cost;
        perfMap[item.productId].ordersCount += 1;
      });
    });

    return Object.values(perfMap)
      .map((p) => ({ ...p, margin: p.revenue > 0 ? (p.profit / p.revenue) * 100 : 0 }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders, products]);

  // ── CUSTOMER INSIGHTS ──
  const customerInsights = useMemo(() => {
    const custMap: Record<string, {
      name: string; email: string; city: string; state: string;
      ordersCount: number; totalSpent: number; lastOrder: string;
      paymentPreference: string;
    }> = {};

    filteredOrders.forEach((o) => {
      const key = o.customerEmail;
      if (!custMap[key]) {
        custMap[key] = {
          name: o.customerName, email: o.customerEmail, city: o.city,
          state: o.state, ordersCount: 0, totalSpent: 0, lastOrder: o.createdAt,
          paymentPreference: o.paymentMethod,
        };
      }
      custMap[key].ordersCount += 1;
      custMap[key].totalSpent += o.total;
      if (new Date(o.createdAt) > new Date(custMap[key].lastOrder)) {
        custMap[key].lastOrder = o.createdAt;
      }
    });

    const customers = Object.values(custMap).sort((a, b) => b.totalSpent - a.totalSpent);
    const repeatCustomers = customers.filter((c) => c.ordersCount > 1);
    const topCities: Record<string, { count: number; revenue: number }> = {};
    filteredOrders.forEach((o) => {
      if (!topCities[o.city]) topCities[o.city] = { count: 0, revenue: 0 };
      topCities[o.city].count += 1;
      topCities[o.city].revenue += o.total;
    });
    const citiesSorted = Object.entries(topCities)
      .map(([city, d]) => ({ city, ...d }))
      .sort((a, b) => b.revenue - a.revenue);

    return { customers, repeatCustomers, citiesSorted, uniqueCustomers: customers.length };
  }, [filteredOrders]);

  // ── CATEGORY BREAKDOWN ──
  const categoryBreakdown = useMemo(() => {
    const catMap: Record<string, { type: string; qty: number; revenue: number; orders: number }> = {};
    const productMap = new Map(products.map((p) => [p.id, p]));
    filteredOrders.forEach((o) => {
      o.items.forEach((item) => {
        const product = productMap.get(item.productId);
        const type = product?.caseType || "Other";
        if (!catMap[type]) catMap[type] = { type, qty: 0, revenue: 0, orders: 0 };
        catMap[type].qty += item.quantity;
        catMap[type].revenue += item.price * item.quantity;
        catMap[type].orders += 1;
      });
    });
    return Object.values(catMap).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders, products]);

  // ── BRAND BREAKDOWN ──
  const brandBreakdown = useMemo(() => {
    const brandMap: Record<string, { brand: string; qty: number; revenue: number }> = {};
    const productMap = new Map(products.map((p) => [p.id, p]));
    filteredOrders.forEach((o) => {
      o.items.forEach((item) => {
        const product = productMap.get(item.productId);
        const brand = product?.phoneBrand || "Other";
        if (!brandMap[brand]) brandMap[brand] = { brand, qty: 0, revenue: 0 };
        brandMap[brand].qty += item.quantity;
        brandMap[brand].revenue += item.price * item.quantity;
      });
    });
    return Object.values(brandMap).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders, products]);

  // ── INVENTORY VALUE ──
  const inventoryValue = useMemo(() => {
    return products.reduce((s, p) => s + p.price * p.stockQty, 0);
  }, [products]);
  const inventoryCostValue = useMemo(() => {
    return products.reduce((s, p) => s + p.costPrice * p.stockQty, 0);
  }, [products]);

  // ── STATUS BREAKDOWN ──
  const statusBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => { map[o.orderStatus] = (map[o.orderStatus] || 0) + 1; });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  }, [filteredOrders]);

  // ── CSV EXPORTS ──
  const handleExportOrders = () => {
    const headers = ["Order #", "Date", "Customer", "Email", "Phone", "City", "State", "Items", "Subtotal", "Shipping", "Discount", "Total", "Payment", "Status"];
    const rows = filteredOrders.map((o) => [
      o.orderNumber, new Date(o.createdAt).toLocaleDateString("en-IN"),
      o.customerName, o.customerEmail, o.customerPhone, o.city, o.state,
      o.items.map((i) => `${i.productName} x${i.quantity}`).join("; "),
      String(o.subtotal), String(o.shippingCost), String(o.discount), String(o.total),
      o.paymentMethod === "razorpay" ? "Online" : "COD", o.orderStatus,
    ]);
    downloadCSV(`luxewrap_orders_${activeRange}_${new Date().toISOString().split("T")[0]}.csv`, headers, rows);
  };

  const handleExportProducts = () => {
    const headers = ["Product", "SKU", "Category", "Brand", "Qty Sold", "Revenue", "Cost", "Profit", "Margin %", "Stock Left"];
    const rows = productPerformance.map((p) => [
      p.name, p.sku, p.caseType, p.phoneBrand,
      String(p.qtySold), String(p.revenue), String(p.costPrice),
      String(p.profit), p.margin.toFixed(1), String(p.currentStock),
    ]);
    downloadCSV(`luxewrap_products_${activeRange}_${new Date().toISOString().split("T")[0]}.csv`, headers, rows);
  };

  const handleExportCustomers = () => {
    const headers = ["Customer", "Email", "City", "State", "Orders", "Total Spent", "Last Order", "Payment Preference"];
    const rows = customerInsights.customers.map((c) => [
      c.name, c.email, c.city, c.state, String(c.ordersCount),
      String(c.totalSpent), new Date(c.lastOrder).toLocaleDateString("en-IN"),
      c.paymentPreference === "razorpay" ? "Online" : "COD",
    ]);
    downloadCSV(`luxewrap_customers_${activeRange}_${new Date().toISOString().split("T")[0]}.csv`, headers, rows);
  };

  const handleExportSummary = () => {
    const headers = ["Metric", "Value"];
    const rows = [
      ["Period", RANGE_LABELS[activeRange]],
      ["Revenue (Delivered)", String(stats.revenue)],
      ["Pipeline (Confirmed+Shipped)", String(stats.pipeline)],
      ["Gross Value (All)", String(stats.grossValue)],
      ["Cost of Goods", String(stats.totalCost)],
      ["Gross Profit", String(stats.grossProfit)],
      ["Profit Margin %", stats.profitMargin.toFixed(1)],
      ["Total Orders", String(stats.total)],
      ["Items Sold", String(stats.totalItemsSold)],
      ["Avg Order Value", String(Math.round(stats.avgOrder))],
      ["Online Payments", String(stats.online)],
      ["COD Orders", String(stats.cod)],
      ["Online Revenue", String(stats.onlineRevenue)],
      ["COD Revenue", String(stats.codRevenue)],
      ["Total Shipping Charged", String(stats.totalShipping)],
      ["Total Discounts Given", String(stats.totalDiscount)],
      ["Delivered", String(stats.delivered)],
      ["Shipped", String(stats.shipped)],
      ["Confirmed", String(stats.confirmed)],
      ["Pending", String(stats.pending)],
      ["Cancelled", String(stats.cancelled)],
      ["Returned", String(stats.returned)],
      ["Unique Customers", String(customerInsights.uniqueCustomers)],
      ["Repeat Customers", String(customerInsights.repeatCustomers.length)],
      ["Inventory Value (Retail)", String(inventoryValue)],
      ["Inventory Value (Cost)", String(inventoryCostValue)],
    ];
    downloadCSV(`luxewrap_summary_${activeRange}_${new Date().toISOString().split("T")[0]}.csv`, headers, rows);
  };

  const statusColors: Record<string, string> = {
    pending: "bg-warning/10 text-warning",
    confirmed: "bg-blue-50 text-blue-600",
    shipped: "bg-purple-50 text-purple-600",
    delivered: "bg-success/10 text-success",
    cancelled: "bg-error/10 text-error",
    returned: "bg-gray-100 text-gray-500",
  };

  const maxDayRevenue = Math.max(...revenueByDay.map((d) => d.value), 1);

  const TABS = [
    { key: "overview" as const, label: "Overview", icon: "📊" },
    { key: "products" as const, label: "Products", icon: "📦" },
    { key: "customers" as const, label: "Customers", icon: "👥" },
    { key: "orders" as const, label: "Orders", icon: "📋" },
  ];

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-bold text-text-primary">Sales Reports</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time analytics connected to your orders, products & inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportSummary}
            className="flex items-center gap-1.5 bg-accent/8 text-accent text-[11px] font-semibold px-3 py-2 rounded-lg hover:bg-accent/15 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Summary CSV
          </button>
          <button onClick={handleExportOrders}
            className="flex items-center gap-1.5 bg-accent text-white text-[11px] font-semibold px-3 py-2 rounded-lg hover:bg-accent-dark transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export All
          </button>
        </div>
      </div>

      {/* ── DATE RANGE + TABS ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(RANGE_LABELS) as DateRange[]).map((range) => (
            <button key={range} onClick={() => setActiveRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeRange === range ? "bg-accent text-white shadow-sm" : "bg-gray-50 text-text-secondary hover:bg-gray-100"
              }`}>
              {RANGE_LABELS[range]}
            </button>
          ))}
        </div>
        {activeRange === "custom" && (
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-text-muted font-medium">From:</label>
              <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)}
                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:border-accent focus:outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-text-muted font-medium">To:</label>
              <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)}
                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:border-accent focus:outline-none" />
            </div>
          </div>
        )}
        {/* Tabs */}
        <div className="flex gap-1 border-t border-gray-100 pt-3">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.key ? "bg-accent/10 text-accent border border-accent/20" : "text-text-muted hover:text-text-primary hover:bg-gray-50"
              }`}>
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════ OVERVIEW TAB ════════════════════════════════════ */}
      {activeTab === "overview" && (
        <>
          {/* Stat Cards — 2 rows */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Revenue", value: formatPrice(stats.revenue), sub: `${stats.delivered} delivered`, prev: prevStats.revenue, curr: stats.revenue, color: "text-accent", bg: "bg-accent/8" },
              { label: "Pipeline", value: formatPrice(stats.pipeline), sub: `${stats.confirmed + stats.shipped} in transit`, prev: prevStats.pipeline, curr: stats.pipeline, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Gross Profit", value: formatPrice(stats.grossProfit), sub: `${stats.profitMargin.toFixed(1)}% margin`, prev: prevStats.grossProfit, curr: stats.grossProfit, color: "text-success", bg: "bg-success/8" },
              { label: "Avg Order", value: formatPrice(stats.avgOrder), sub: `${stats.totalItemsSold} items sold`, prev: prevStats.avgOrder, curr: stats.avgOrder, color: "text-purple-600", bg: "bg-purple-50" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
                <div className="flex items-start justify-between mb-2">
                  <p className={`text-[10px] font-semibold uppercase tracking-wider ${stat.color}`}>{stat.label}</p>
                  <ChangeIndicator current={stat.curr} previous={stat.prev} />
                </div>
                <p className="text-xl font-heading font-bold text-text-primary">{stat.value}</p>
                <p className="text-[10px] text-text-muted mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Second Row: Quick stats */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Total Orders", value: stats.total, color: "text-text-primary" },
              { label: "Pending", value: stats.pending, color: "text-warning" },
              { label: "Confirmed", value: stats.confirmed, color: "text-blue-600" },
              { label: "Shipped", value: stats.shipped, color: "text-purple-600" },
              { label: "Delivered", value: stats.delivered, color: "text-success" },
              { label: "Cancelled", value: stats.cancelled, color: "text-error" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-card text-center">
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[9px] text-text-muted uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Revenue Chart + Payment & Category */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Revenue Trend */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Revenue Trend</h3>
                  <p className="text-[10px] text-text-muted">{RANGE_LABELS[activeRange]} · Delivered only</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-heading font-bold text-accent">{formatPrice(stats.revenue)}</p>
                  <ChangeIndicator current={stats.revenue} previous={prevStats.revenue} label="period" />
                </div>
              </div>
              {revenueByDay.length > 0 ? (
                <>
                  <BarChart data={revenueByDay} maxVal={maxDayRevenue} />
                  <div className="flex justify-between mt-2">
                    <span className="text-[9px] text-text-muted">{revenueByDay[0]?.label}</span>
                    {revenueByDay.length > 2 && <span className="text-[9px] text-text-muted">{revenueByDay[Math.floor(revenueByDay.length / 2)]?.label}</span>}
                    <span className="text-[9px] text-text-muted font-semibold">{revenueByDay[revenueByDay.length - 1]?.label}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-text-muted text-sm">No data for this period</div>
              )}
            </div>

            {/* Right Column: Payment + Category + Inventory */}
            <div className="space-y-5">
              {/* Payment Split */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
                <h3 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider mb-3">Payment Split</h3>
                <div className="flex gap-3">
                  <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-blue-600">{stats.online}</p>
                    <p className="text-[9px] text-text-muted font-medium">{formatPrice(stats.onlineRevenue)}</p>
                    <p className="text-[8px] text-text-muted uppercase tracking-wider mt-0.5">Online</p>
                  </div>
                  <div className="flex-1 bg-warning/8 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-warning">{stats.cod}</p>
                    <p className="text-[9px] text-text-muted font-medium">{formatPrice(stats.codRevenue)}</p>
                    <p className="text-[8px] text-text-muted uppercase tracking-wider mt-0.5">COD</p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-text-muted">Shipping Charged</span>
                    <span className="font-semibold text-text-primary">{formatPrice(stats.totalShipping)}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-text-muted">Discounts Given</span>
                    <span className="font-semibold text-error">−{formatPrice(stats.totalDiscount)}</span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
                <h3 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider mb-3">By Case Type</h3>
                <div className="space-y-2.5">
                  {categoryBreakdown.map((cat) => {
                    const totalCatRev = categoryBreakdown.reduce((s, c) => s + c.revenue, 0);
                    const pct = totalCatRev > 0 ? Math.round((cat.revenue / totalCatRev) * 100) : 0;
                    return (
                      <div key={cat.type}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] text-text-secondary font-medium">{cat.type}</span>
                          <span className="text-[10px] font-semibold text-text-primary">{formatPrice(cat.revenue)} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="h-full rounded-full bg-accent/50" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inventory Snapshot */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
                <h3 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider mb-3">Inventory Value</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-text-muted">Retail Value</span>
                    <span className="font-bold text-text-primary">{formatPrice(inventoryValue)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-text-muted">Cost Value</span>
                    <span className="font-semibold text-text-secondary">{formatPrice(inventoryCostValue)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] pt-1 border-t border-gray-100">
                    <span className="text-text-muted">Potential Profit</span>
                    <span className="font-bold text-success">{formatPrice(inventoryValue - inventoryCostValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Split */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
            <h3 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider mb-3">Sales by Brand</h3>
            <div className="flex gap-4 flex-wrap">
              {brandBreakdown.map((b) => (
                <div key={b.brand} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 min-w-[160px]">
                  <div>
                    <p className="text-[13px] font-semibold text-text-primary">{b.brand}</p>
                    <p className="text-[10px] text-text-muted">{b.qty} units · {formatPrice(b.revenue)}</p>
                  </div>
                </div>
              ))}
              {brandBreakdown.length === 0 && <p className="text-text-muted text-sm">No sales in this period</p>}
            </div>
          </div>
        </>
      )}

      {/* ════════════════════════════════════ PRODUCTS TAB ════════════════════════════════════ */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="p-5 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Product Performance</h3>
              <p className="text-[10px] text-text-muted mt-0.5">{productPerformance.length} products sold in {RANGE_LABELS[activeRange].toLowerCase()}</p>
            </div>
            <button onClick={handleExportProducts}
              className="flex items-center gap-1.5 bg-accent/8 text-accent text-[10px] font-semibold px-3 py-1.5 rounded-lg hover:bg-accent/15 transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-gray-50 bg-gray-50/50">
                  {["#", "Product", "SKU", "Category", "Qty Sold", "Revenue", "Cost", "Profit", "Margin", "Stock"].map((h) => (
                    <th key={h} className={`text-[10px] font-semibold text-text-muted uppercase tracking-wider px-4 py-2.5 ${["Qty Sold", "Revenue", "Cost", "Profit", "Margin", "Stock"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productPerformance.length === 0 ? (
                  <tr><td colSpan={10} className="text-center text-text-muted text-sm py-8">No product sales in this period</td></tr>
                ) : (
                  productPerformance.map((p, i) => (
                    <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-2.5"><span className={`w-5 h-5 rounded-md inline-flex items-center justify-center text-[9px] font-bold ${i === 0 ? "bg-accent/10 text-accent" : "bg-gray-50 text-text-muted"}`}>{i + 1}</span></td>
                      <td className="px-4 py-2.5"><p className="text-[12px] font-medium text-text-primary whitespace-nowrap">{p.name}</p><p className="text-[9px] text-text-muted">{p.phoneBrand}</p></td>
                      <td className="px-4 py-2.5 text-[11px] text-text-muted">{p.sku}</td>
                      <td className="px-4 py-2.5"><span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-text-secondary">{p.caseType}</span></td>
                      <td className="px-4 py-2.5 text-right text-[12px] font-semibold">{p.qtySold}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] font-semibold text-accent">{formatPrice(p.revenue)}</td>
                      <td className="px-4 py-2.5 text-right text-[11px] text-text-muted">{formatPrice(p.costPrice)}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] font-semibold text-success">{formatPrice(p.profit)}</td>
                      <td className="px-4 py-2.5 text-right"><span className={`text-[10px] font-bold ${p.margin >= 60 ? "text-success" : p.margin >= 40 ? "text-warning" : "text-error"}`}>{p.margin.toFixed(1)}%</span></td>
                      <td className="px-4 py-2.5 text-right"><span className={`text-[11px] font-semibold ${p.currentStock <= 5 ? "text-error" : "text-text-primary"}`}>{p.currentStock}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════ CUSTOMERS TAB ════════════════════════════════════ */}
      {activeTab === "customers" && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 mb-1">Unique Customers</p>
              <p className="text-2xl font-heading font-bold text-text-primary">{customerInsights.uniqueCustomers}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-600 mb-1">Repeat Customers</p>
              <p className="text-2xl font-heading font-bold text-text-primary">{customerInsights.repeatCustomers.length}</p>
              <p className="text-[10px] text-text-muted">{customerInsights.uniqueCustomers > 0 ? ((customerInsights.repeatCustomers.length / customerInsights.uniqueCustomers) * 100).toFixed(0) : 0}% repeat rate</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-1">Avg Spend / Customer</p>
              <p className="text-2xl font-heading font-bold text-text-primary">{formatPrice(customerInsights.uniqueCustomers > 0 ? stats.grossValue / customerInsights.uniqueCustomers : 0)}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-success mb-1">Top City</p>
              <p className="text-2xl font-heading font-bold text-text-primary">{customerInsights.citiesSorted[0]?.city || "—"}</p>
              <p className="text-[10px] text-text-muted">{customerInsights.citiesSorted[0]?.count || 0} orders</p>
            </div>
          </div>

          {/* Two columns: Top Cities + Customer Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Top Cities */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
              <h3 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider mb-3">Top Cities</h3>
              <div className="space-y-2.5">
                {customerInsights.citiesSorted.slice(0, 8).map((city, i) => (
                  <div key={city.city} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold ${i === 0 ? "bg-accent/10 text-accent" : "bg-gray-50 text-text-muted"}`}>{i + 1}</span>
                      <span className="text-[12px] text-text-secondary">{city.city}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-semibold text-text-primary">{city.count} orders</p>
                      <p className="text-[9px] text-text-muted">{formatPrice(city.revenue)}</p>
                    </div>
                  </div>
                ))}
                {customerInsights.citiesSorted.length === 0 && <p className="text-text-muted text-sm">No data</p>}
              </div>
            </div>

            {/* Customer Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              <div className="p-5 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">All Customers</h3>
                <button onClick={handleExportCustomers}
                  className="flex items-center gap-1.5 bg-accent/8 text-accent text-[10px] font-semibold px-3 py-1.5 rounded-lg hover:bg-accent/15">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-t border-gray-50 bg-gray-50/50">
                      {["Customer", "City", "Orders", "Total Spent", "Payment", "Last Order"].map((h) => (
                        <th key={h} className={`text-[10px] font-semibold text-text-muted uppercase tracking-wider px-5 py-2.5 ${["Orders", "Total Spent"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customerInsights.customers.slice(0, 20).map((c) => (
                      <tr key={c.email} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-2.5"><p className="text-[12px] font-medium text-text-primary">{c.name}</p><p className="text-[9px] text-text-muted">{c.email}</p></td>
                        <td className="px-5 py-2.5 text-[11px] text-text-secondary">{c.city}, {c.state}</td>
                        <td className="px-5 py-2.5 text-right text-[12px] font-semibold">{c.ordersCount}</td>
                        <td className="px-5 py-2.5 text-right text-[12px] font-semibold text-accent">{formatPrice(c.totalSpent)}</td>
                        <td className="px-5 py-2.5"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.paymentPreference === "razorpay" ? "bg-blue-50 text-blue-600" : "bg-warning/10 text-warning"}`}>{c.paymentPreference === "razorpay" ? "Online" : "COD"}</span></td>
                        <td className="px-5 py-2.5 text-[11px] text-text-muted">{new Date(c.lastOrder).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ════════════════════════════════════ ORDERS TAB ════════════════════════════════════ */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="p-5 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Order Details</h3>
              <p className="text-[10px] text-text-muted mt-0.5">{filteredOrders.length} orders in {RANGE_LABELS[activeRange].toLowerCase()}</p>
            </div>
            <button onClick={handleExportOrders}
              className="flex items-center gap-1.5 bg-accent/8 text-accent text-[10px] font-semibold px-3 py-1.5 rounded-lg hover:bg-accent/15 transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-gray-50 bg-gray-50/50">
                  {["Order", "Date", "Customer", "City", "Items", "Total", "Payment", "Status"].map((h) => (
                    <th key={h} className={`text-[10px] font-semibold text-text-muted uppercase tracking-wider px-5 py-2.5 ${h === "Total" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr><td colSpan={8} className="text-center text-text-muted text-sm py-12">No orders found for this period</td></tr>
                ) : (
                  filteredOrders.slice(0, 50).map((order) => (
                    <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-2.5"><p className="text-[12px] font-semibold text-text-primary">{order.orderNumber}</p></td>
                      <td className="px-5 py-2.5 text-[11px] text-text-secondary">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="px-5 py-2.5"><p className="text-[12px] text-text-secondary">{order.customerName}</p><p className="text-[9px] text-text-muted">{order.customerPhone}</p></td>
                      <td className="px-5 py-2.5 text-[11px] text-text-muted">{order.city}</td>
                      <td className="px-5 py-2.5"><div className="space-y-0.5">{order.items.map((item, idx) => (<p key={idx} className="text-[10px] text-text-secondary">{item.productName} ×{item.quantity}</p>))}</div></td>
                      <td className="px-5 py-2.5 text-right"><p className="text-[12px] font-semibold text-text-primary">{formatPrice(order.total)}</p><p className="text-[9px] text-text-muted">Ship: {formatPrice(order.shippingCost)}</p></td>
                      <td className="px-5 py-2.5"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${order.paymentMethod === "razorpay" ? "bg-blue-50 text-blue-600" : "bg-warning/10 text-warning"}`}>{order.paymentMethod === "razorpay" ? "Online" : "COD"}</span></td>
                      <td className="px-5 py-2.5"><span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[order.orderStatus] || "bg-gray-100 text-text-muted"}`}>{order.orderStatus}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {filteredOrders.length > 50 && (
              <div className="text-center py-3 border-t border-gray-50">
                <p className="text-[10px] text-text-muted">Showing 50 of {filteredOrders.length} · Export CSV for all</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
