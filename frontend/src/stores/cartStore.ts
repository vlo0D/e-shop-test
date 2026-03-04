import { create } from 'zustand';
import type { Item, CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (item: Item, quantity?: number) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item: Item, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((ci) => ci.item.id === item.id);
      if (existing) {
        return {
          items: state.items.map((ci) =>
            ci.item.id === item.id
              ? { ...ci, quantity: ci.quantity + quantity }
              : ci
          ),
        };
      }
      return { items: [...state.items, { item, quantity }] };
    });
  },

  removeItem: (itemId: number) => {
    set((state) => ({
      items: state.items.filter((ci) => ci.item.id !== itemId),
    }));
  },

  updateQuantity: (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((ci) =>
        ci.item.id === itemId ? { ...ci, quantity } : ci
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce(
      (sum, ci) => sum + ci.item.price * ci.quantity,
      0
    );
  },

  getItemCount: () => {
    return get().items.reduce((sum, ci) => sum + ci.quantity, 0);
  },
}));
