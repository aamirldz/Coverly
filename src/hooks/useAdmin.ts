"use client";

// ═══════════════════════════════════════════
// ADMIN STORE — Zustand store for admin auth + data
// localStorage persistence for auth token
// Products now delegated to shared useProductStore
// Orders + analytics remain admin-only
// ═══════════════════════════════════════════

import { create } from "zustand";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";
import type { Product, Order, DashboardStats } from "@/types";

// ── ADMIN CREDENTIALS ──
const ADMIN_EMAIL = "admin@luxewrap.in";
const ADMIN_PASSWORD = "luxewrap2026";
const AUTH_KEY = "luxewrap_admin_auth";

// ── MOCK ORDER GENERATOR ──
const CUSTOMER_NAMES = [
  "Rahul Sharma", "Priya Patel", "Arjun Singh", "Sneha Reddy", "Vikram Malhotra",
  "Ananya Gupta", "Karthik Nair", "Meera Joshi", "Rohan Kapoor", "Divya Menon",
  "Suresh Kumar", "Neha Agarwal", "Amit Verma", "Pooja Iyer", "Raj Chauhan",
];

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune",
  "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Kochi", "Indore", "Nagpur",
];

const STATES = [
  "Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "West Bengal",
  "Maharashtra", "Gujarat", "Rajasthan", "Uttar Pradesh", "Punjab", "Kerala",
  "Madhya Pradesh", "Maharashtra",
];

const ORDER_STATUSES: Order["orderStatus"][] = [
  "pending", "confirmed", "shipped", "delivered", "delivered", "delivered",
  "delivered", "delivered", "shipped", "confirmed",
];

function generateMockOrders(products: Product[]): Order[] {
  const orders: Order[] = [];
  const productList = products.length > 0 ? products : SAMPLE_PRODUCTS;

  for (let i = 0; i < 50; i++) {
    const custIdx = Math.floor(Math.random() * CUSTOMER_NAMES.length);
    const product = productList[Math.floor(Math.random() * productList.length)];
    const qty = Math.floor(Math.random() * 3) + 1;
    const subtotal = product.price * qty;
    const paymentMethod = Math.random() > 0.38 ? "razorpay" : "cod";
    const shippingCost = paymentMethod === "cod" ? 50 : 0;
    const discount = paymentMethod === "razorpay" ? 50 : 0;
    const total = subtotal + shippingCost - discount;
    const status = ORDER_STATUSES[Math.floor(Math.random() * ORDER_STATUSES.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    orders.push({
      id: `order_${String(i + 1).padStart(4, "0")}`,
      orderNumber: `LW-${String(1000 + i).padStart(4, "0")}`,
      customerName: CUSTOMER_NAMES[custIdx],
      customerEmail: `${CUSTOMER_NAMES[custIdx].toLowerCase().replace(" ", ".")}@gmail.com`,
      customerPhone: `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
      addressLine1: `${Math.floor(Math.random() * 500) + 1}, ${["MG Road", "Station Road", "Ring Road", "Park Street", "Lake View"][Math.floor(Math.random() * 5)]}`,
      addressLine2: null,
      city: CITIES[custIdx % CITIES.length],
      state: STATES[custIdx % STATES.length],
      pincode: `${Math.floor(100000 + Math.random() * 900000)}`,
      country: "India",
      items: [
        {
          id: `item_${i}_1`,
          productId: product.id,
          productName: product.name,
          quantity: qty,
          price: product.price,
        },
      ],
      subtotal,
      shippingCost,
      discount,
      total,
      paymentMethod: paymentMethod as "razorpay" | "cod",
      paymentStatus: status === "delivered" ? "paid" : status === "cancelled" ? "failed" : "paid",
      razorpayOrderId: paymentMethod === "razorpay" ? `order_${Math.random().toString(36).slice(2, 12)}` : null,
      razorpayPaymentId: paymentMethod === "razorpay" ? `pay_${Math.random().toString(36).slice(2, 12)}` : null,
      orderStatus: status,
      trackingId: ["shipped", "delivered"].includes(status) ? `SR${Math.floor(10000000 + Math.random() * 90000000)}` : null,
      shiprocketOrderId: ["shipped", "delivered"].includes(status) ? `${Math.floor(100000 + Math.random() * 900000)}` : null,
      estimatedDelivery: new Date(date.getTime() + 5 * 86400000).toISOString(),
      notes: null,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  }

  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function calculateDashboardStats(orders: Order[], products: Product[]): DashboardStats {
  const deliveredOrders = orders.filter((o) => o.orderStatus === "delivered");
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / deliveredOrders.length : 0;
  const deliveryRate = totalOrders > 0 ? (deliveredOrders.length / totalOrders) * 100 : 0;
  const codOrders = orders.filter((o) => o.paymentMethod === "cod").length;
  const codPercentage = totalOrders > 0 ? (codOrders / totalOrders) * 100 : 0;

  const revenueByDay: { date: string; revenue: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayRevenue = deliveredOrders
      .filter((o) => o.createdAt.startsWith(dateStr))
      .reduce((sum, o) => sum + o.total, 0);
    revenueByDay.push({ date: dateStr, revenue: dayRevenue });
  }

  const productSales: Record<string, { name: string; sold: number; revenue: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { name: item.productName, sold: 0, revenue: 0 };
      }
      productSales[item.productId].sold += item.quantity;
      productSales[item.productId].revenue += item.price * item.quantity;
    });
  });
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.orderStatus] = (statusCounts[o.orderStatus] || 0) + 1;
  });
  const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue: Math.round(avgOrderValue),
    deliveryRate: Math.round(deliveryRate),
    codPercentage: Math.round(codPercentage),
    onlinePercentage: Math.round(100 - codPercentage),
    topProducts,
    revenueByDay,
    ordersByStatus,
  };
}

// ── STORE TYPE ──
interface AdminStore {
  isAuthenticated: boolean;
  adminEmail: string | null;
  orders: Order[];
  products: Product[];
  stats: DashboardStats | null;

  login: (email: string, password: string) => boolean;
  logout: () => void;
  checkAuth: () => boolean;
  initData: (products: Product[]) => void;

  updateOrderStatus: (orderId: string, status: Order["orderStatus"]) => void;
  // Product CRUD — these proxy to shared store but also refresh stats
  updateProductStock: (productId: string, newStock: number) => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  refreshProducts: (products: Product[]) => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  isAuthenticated: false,
  adminEmail: null,
  orders: [],
  products: [],
  stats: null,

  login: (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ email, ts: Date.now() }));
      }
      // Products will be synced from shared store via refreshProducts
      set({ isAuthenticated: true, adminEmail: email });
      return true;
    }
    return false;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_KEY);
    }
    set({ isAuthenticated: false, adminEmail: null, orders: [], products: [], stats: null });
  },

  checkAuth: () => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const { email, ts } = JSON.parse(stored);
        if (Date.now() - ts < 24 * 60 * 60 * 1000) {
          if (!get().isAuthenticated) {
            set({ isAuthenticated: true, adminEmail: email });
          }
          return true;
        }
        localStorage.removeItem(AUTH_KEY);
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    return false;
  },

  // Called with products from shared store to generate orders and stats
  initData: (products: Product[]) => {
    if (get().orders.length === 0) {
      const orders = generateMockOrders(products);
      const stats = calculateDashboardStats(orders, products);
      set({ orders, products, stats });
    } else {
      // Just refresh products + stats
      const stats = calculateDashboardStats(get().orders, products);
      set({ products, stats });
    }
  },

  refreshProducts: (products: Product[]) => {
    const stats = calculateDashboardStats(get().orders, products);
    set({ products, stats });
  },

  updateOrderStatus: (orderId, status) => {
    const orders = get().orders.map((o) =>
      o.id === orderId ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o
    );
    const stats = calculateDashboardStats(orders, get().products);
    set({ orders, stats });
  },

  // These are called by admin pages — they update the shared product store
  // AND refresh local stats
  updateProductStock: (productId, newStock) => {
    const products = get().products.map((p) =>
      p.id === productId
        ? {
            ...p,
            stockQty: newStock,
            status: (newStock <= 0 ? "out_of_stock" : p.status === "out_of_stock" ? "published" : p.status) as Product["status"],
            badge: (newStock > 0 && newStock <= 5 ? "LOW_STOCK" : newStock <= 0 ? null : p.badge) as Product["badge"],
          }
        : p
    );
    const stats = calculateDashboardStats(get().orders, products);
    set({ products, stats });
  },

  addProduct: (product) => {
    const products = [product, ...get().products];
    set({ products });
  },

  updateProduct: (productId, updates) => {
    const products = get().products.map((p) =>
      p.id === productId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    set({ products });
  },

  deleteProduct: (productId) => {
    const products = get().products.filter((p) => p.id !== productId);
    const stats = calculateDashboardStats(get().orders, products);
    set({ products, stats });
  },
}));
