import { IProduct } from "@/types/Product";
import { useState } from "react";

interface CartItem extends IProduct {
  qty: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: IProduct) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => (item._id || item.id) === (product._id || product.id));
      if (existingItem) {
        return prev.map((item) => ((item._id || item.id) === (product._id || product.id) ? { ...item, qty: item.qty + 1 } : item));
      } else {
        return [...prev, { ...product, qty: 1 }];
      }
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) => 
    prev.map((item) => {
        if ((item._id || item.id) === productId) {
            return { ...item, qty: Math.max(0, item.qty + delta) };
        }
        return item;
    }).filter(item => item.qty > 0)
    )
  }

  const clearCart = () => {
    const totalPrice = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

    return {
        cart,
        addToCart,
        updateQty,
        clearCart,
        totalPrice,
        totalQty
    }
  }
};
