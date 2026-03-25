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
import type { Product } from "@/types";

interface ProductStore {
  products: Product[];
  initialized: boolean;

  // Initialize with sample data (only on first load)
  initProducts: () => void;

  // CRUD operations
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;

  // Getters
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getPublishedProducts: () => Product[];
  getFeaturedProducts: () => Product[];
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      initialized: false,

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

      getProductBySlug: (slug) => get().products.find((p) => p.slug === slug),
      getProductById: (id) => get().products.find((p) => p.id === id),
      getPublishedProducts: () => get().products.filter((p) => p.status === "published"),
      getFeaturedProducts: () => get().products.filter((p) => p.featured && p.status === "published"),
    }),
    {
      name: "luxewrap-products",
      partialize: (state) => ({ products: state.products, initialized: state.initialized }),
    }
  )
);
