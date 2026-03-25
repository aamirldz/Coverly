// ═══════════════════════════════════════════
// LuxeWrap India — TypeScript Type Definitions
// ═══════════════════════════════════════════

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  phoneBrand: string;
  phoneModel: string;
  caseType: string;
  material: string;
  color: string;
  colorHex: string;
  stockQty: number;
  sku: string;
  images: string[];
  videoUrl: string | null;
  badge: "NEW" | "BESTSELLER" | "LOW_STOCK" | "FOR_HER" | null;
  status: "draft" | "published" | "out_of_stock";
  featured: boolean;
  showInTrending: boolean;          // Show in Trending Now carousel
  showInDeviceSelector: boolean;   // Show model in "Choose Your Phone" section
  costPrice: number;
  weight: number;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  mrp: number;
  phoneModel: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: "razorpay" | "cod";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned";
  trackingId: string | null;
  shiprocketOrderId: string | null;
  estimatedDelivery: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  orderId: string;
  rating: number;
  comment: string;
  images: string[];
  verified: boolean;
  approved: boolean;
  createdAt: string;
}

export interface StockLog {
  id: string;
  productId: string;
  changeType: "sale" | "restock" | "return" | "cancel" | "manual_add" | "manual_remove";
  quantity: number;
  previousStock: number;
  newStock: number;
  orderId: string | null;
  note: string | null;
  createdAt: string;
}

export interface PhoneModel {
  brand: string;
  series: string;
  model: string;
  image?: string;
}

// Filter state for product grid
export interface FilterState {
  brand: string | null;
  model: string | null;
  caseType: string | null;
  material: string | null;
  sortBy: "popular" | "newest" | "price-asc" | "price-desc";
}

// Admin dashboard analytics
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  deliveryRate: number;
  codPercentage: number;
  onlinePercentage: number;
  topProducts: { name: string; sold: number; revenue: number }[];
  revenueByDay: { date: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
}

// Hero showcase config for the big circular product rotator on homepage
export interface HeroShowcaseItem {
  productId: string;
  visible: boolean;
  order: number;
}
