import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

// ═══════════════════════════════════════════
// LuxeWrap India — Shopping Cart Store
// Persisted in localStorage so cart survives refresh
// ═══════════════════════════════════════════

const MAX_QUANTITY_PER_ITEM = 10;

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

// ── Helper: compute totals from items array ──
// These are pure functions to avoid Zustand persist issues
export function getCartTotalPrice(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartTotalMRP(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.mrp || item.price) * item.quantity, 0);
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSavings(items: CartItem[]): number {
  return getCartTotalMRP(items) - getCartTotalPrice(items);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (newItem: CartItem) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === newItem.productId
          );

          if (existing) {
            // Cap at max quantity
            if (existing.quantity >= MAX_QUANTITY_PER_ITEM) {
              return state; // Don't exceed max
            }
            return {
              items: state.items.map((item) =>
                item.productId === newItem.productId
                  ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY_PER_ITEM) }
                  : item
              ),
              isOpen: true,
            };
          }

          // Sanitize incoming item: ensure numeric values
          const sanitized: CartItem = {
            productId: newItem.productId,
            name: newItem.name,
            slug: newItem.slug,
            image: newItem.image || "",
            price: Number(newItem.price) || 0,
            mrp: Number(newItem.mrp) || Number(newItem.price) || 0,
            phoneModel: newItem.phoneModel,
            color: newItem.color,
            quantity: 1,
          };

          return {
            items: [...state.items, sanitized],
            isOpen: true,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(quantity, MAX_QUANTITY_PER_ITEM) }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [], isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "luxewrap-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
