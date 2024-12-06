import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "./Storage";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      
      addToCart: (newItem) => {
        set((state) => {
        
          const existingItemIndex = state.items.findIndex(
            (item) => item._id === newItem._id
          );

          let updatedItems;
          if (existingItemIndex > -1) {
         
            updatedItems = state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            
            updatedItems = [...state.items, { ...newItem, quantity: newItem.quantity }];
          }

        
          const totalItems = updatedItems.reduce(
            (total, item) => total + item.quantity,
            0
          );
          const totalPrice = updatedItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      removeFromCart: (itemId) => {
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item._id !== itemId
          );

          
          const totalItems = updatedItems.reduce(
            (total, item) => total + item.quantity,
            0
          );
          const totalPrice = updatedItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item._id === itemId ? { ...item, quantity } : item
          );

          
          const totalItems = updatedItems.reduce(
            (total, item) => total + item.quantity,
            0
          );
          const totalPrice = updatedItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);