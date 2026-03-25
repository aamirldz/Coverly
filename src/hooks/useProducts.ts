"use client";

// ═══════════════════════════════════════════
// SHARED PRODUCT STORE — Single source of truth
// Both admin panel and frontend read from here
// Admin CRUD actions update this store
// Frontend components subscribe to changes
// Persisted in localStorage for real-time sync
// ═══════════════════════════════════════════

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";
import type { Product, Review, HeroShowcaseItem } from "@/types";

interface ProductStore {
  products: Product[];
  initialized: boolean;
  heroShowcase: HeroShowcaseItem[];

  // Initialize with sample data (only on first load)
  initProducts: () => void;

  // Product CRUD
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;

  // Review CRUD
  addReview: (productId: string, review: Review) => void;
  updateReview: (productId: string, reviewId: string, updates: Partial<Review>) => void;
  deleteReview: (productId: string, reviewId: string) => void;
  toggleReviewApproval: (productId: string, reviewId: string) => void;

  // Hero showcase config
  updateHeroShowcase: (config: HeroShowcaseItem[]) => void;

  // Getters
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getPublishedProducts: () => Product[];
  getFeaturedProducts: () => Product[];
  getAllReviews: () => (Review & { productName: string })[];
  getHeroProducts: () => Product[];
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      initialized: false,
      heroShowcase: [],

      initProducts: () => {
        const state = get();
        if (!state.initialized) {
          set({ products: [...SAMPLE_PRODUCTS], initialized: true });
        } else {
          // Migrate: add missing visibility fields to old persisted products
          const needsMigration = state.products.some(
            (p) => (p as any).showInCollection !== undefined || p.showInTrending === undefined || p.showInDeviceSelector === undefined
          );
          if (needsMigration) {
            set({
              products: state.products.map((p) => ({
                ...p,
                showInTrending: p.showInTrending ?? (p as any).showInCollection ?? true,
                showInDeviceSelector: p.showInDeviceSelector ?? true,
              })),
            });
          }
        }
      },

      addProduct: (product) => {
        set((state) => ({ products: [product, ...state.products] }));
      },

      updateProduct: (productId, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));
      },

      updateProductStock: (productId, newStock) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  stockQty: newStock,
                  status: (newStock <= 0 ? "out_of_stock" : p.status === "out_of_stock" ? "published" : p.status) as Product["status"],
                  badge: (newStock > 0 && newStock <= 5 ? "LOW_STOCK" : newStock <= 0 ? null : p.badge) as Product["badge"],
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      // ── Review CRUD ──
      addReview: (productId, review) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? { ...p, reviews: [...(p.reviews || []), review] }
              : p
          ),
        }));
      },

      updateReview: (productId, reviewId, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  reviews: (p.reviews || []).map((r) =>
                    r.id === reviewId ? { ...r, ...updates } : r
                  ),
                }
              : p
          ),
        }));
      },

      deleteReview: (productId, reviewId) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? { ...p, reviews: (p.reviews || []).filter((r) => r.id !== reviewId) }
              : p
          ),
        }));
      },

      toggleReviewApproval: (productId, reviewId) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  reviews: (p.reviews || []).map((r) =>
                    r.id === reviewId ? { ...r, approved: !r.approved } : r
                  ),
                }
              : p
          ),
        }));
      },

      // ── Hero Showcase Config ──
      updateHeroShowcase: (config) => {
        set({ heroShowcase: config });
      },

      getProductBySlug: (slug) => get().products.find((p) => p.slug === slug),
      getProductById: (id) => get().products.find((p) => p.id === id),
      getPublishedProducts: () => get().products.filter((p) => p.status === "published"),
      getFeaturedProducts: () => get().products.filter((p) => p.featured && p.status === "published"),

      getAllReviews: () => {
        const reviews: (Review & { productName: string })[] = [];
        get().products.forEach((p) => {
          (p.reviews || []).forEach((r) => {
            reviews.push({ ...r, productName: p.name });
          });
        });
        return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      // Get hero products based on admin config, fallback to first 3 published
      getHeroProducts: () => {
        const state = get();
        const published = state.products.filter((p) => p.status === "published");

        if (state.heroShowcase.length === 0) {
          // No config yet — default: first 3 published products
          return published.slice(0, 3);
        }

        // Use admin-configured order, filter by visibility
        const visibleItems = state.heroShowcase
          .filter((item) => item.visible)
          .sort((a, b) => a.order - b.order);

        const heroProducts = visibleItems
          .map((item) => published.find((p) => p.id === item.productId))
          .filter(Boolean) as Product[];

        return heroProducts.length > 0 ? heroProducts : published.slice(0, 3);
      },
    }),
    {
      name: "luxewrap-products",
      partialize: (state) => ({
        products: state.products,
        initialized: state.initialized,
        heroShowcase: state.heroShowcase,
      }),
    }
  )
);
