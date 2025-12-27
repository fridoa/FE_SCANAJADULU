import { IProduct } from "@/types/Product";
import { create } from "zustand";

interface CartItem extends IProduct {
  qty: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: IProduct) => void;
  updateQty: (itemId: string, delta: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalQty: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => (item._id || item.id) === (product._id || product.id));
      if (existing) {
        return {
          cart: state.cart.map((item) => ((item._id || item.id) === (product._id || product.id) ? { ...item, qty: item.qty + 1 } : item)),
        };
      }
      return { cart: [...state.cart, { ...product, qty: 1 }] };
    }),

  updateQty: (itemId, delta) =>
    set((state) => ({
      cart: state.cart
        .map((item) => {
          if ((item._id || item.id) === itemId) {
            return { ...item, qty: Math.max(0, item.qty + delta) };
          }
          return item;
        })
        .filter((item) => item.qty > 0),
    })),

  clearCart: () => set({ cart: [] }),

  getTotalPrice: () => get().cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0),
  getTotalQty: () => get().cart.reduce((sum, item) => sum + item.qty, 0),
}));
