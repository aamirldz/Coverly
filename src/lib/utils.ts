// ═══════════════════════════════════════════
// LuxeWrap India — Utility Functions
// ═══════════════════════════════════════════

/**
 * Format price in Indian Rupee format
 * e.g., 1499 → "₹1,499"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Calculate discount percentage
 * e.g., price=1499, mrp=2999 → "50% off"
 */
export function calculateDiscount(price: number, mrp: number): number {
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/**
 * Generate slug from product name
 * e.g., "Carbon Fiber Ultra Case" → "carbon-fiber-ultra-case"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Generate SKU
 * e.g., index 1 → "LW-001"
 */
export function generateSKU(index: number): string {
  return `LW-${String(index).padStart(3, "0")}`;
}

/**
 * Generate order number
 * e.g., count 1 → "LW-0001"
 */
export function generateOrderNumber(count: number): string {
  return `LW-${String(count).padStart(4, "0")}`;
}

/**
 * Get badge CSS class
 */
export function getBadgeClass(badge: string | null): string {
  switch (badge) {
    case "NEW": return "badge-new";
    case "BESTSELLER": return "badge-bestseller";
    case "FOR_HER": return "badge-forher";
    case "LOW_STOCK": return "badge-lowstock";
    default: return "";
  }
}

/**
 * Get badge display text
 */
export function getBadgeText(badge: string | null): string {
  switch (badge) {
    case "NEW": return "NEW";
    case "BESTSELLER": return "BESTSELLER";
    case "FOR_HER": return "FOR HER 💖";
    case "LOW_STOCK": return "LOW STOCK";
    default: return "";
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Get average rating from reviews
 */
export function getAverageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

/**
 * Phone models data structure
 */
export const PHONE_MODELS = {
  Apple: {
    "iPhone 17": ["iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max"],
    "iPhone 16": ["iPhone 16", "iPhone 16 Pro", "iPhone 16 Pro Max"],
    "iPhone 15": ["iPhone 15", "iPhone 15 Pro", "iPhone 15 Pro Max"],
  },
  Samsung: {
    "S-Series": ["Galaxy S26 Ultra", "Galaxy S25 Ultra", "Galaxy S24 Ultra"],
    "Z Fold": ["Galaxy Z Fold 6", "Galaxy Z Fold 5"],
  },
} as const;

/**
 * Case type options
 */
export const CASE_TYPES = [
  "MagSafe",
  "Carbon Fiber",
  "Aramid Fiber",
  "Cute",
] as const;

/**
 * Material options
 */
export const MATERIALS = [
  "carbon_fiber",
  "aramid",
  "silicone",
  "leather",
  "polycarbonate",
] as const;

/**
 * Indian states for checkout
 */
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
] as const;
