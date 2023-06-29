// frontend\src\state\store.ts

import { create } from "zustand";
import {
  UserAuth,
  CartState,
  CartActions,
  Cart,
  Shipping,
} from "../../../backend/interfaces";

export const useAuthStore = create<UserAuth>((set) => {
  const storedUserInfo = localStorage.getItem("userInfo");

  return {
    userInfo: storedUserInfo ? JSON.parse(storedUserInfo) : null,
    setUserInfo: (userInfo) => {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime.toString());

      set({ userInfo });
    },
    logout: () => {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");

      set({ userInfo: null });
    },
  };
});

export type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>((set) => ({
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems") || "[]")
    : [],
  shipping: localStorage.getItem("shipping")
    ? JSON.parse(localStorage.getItem("shipping") || "{}")
    : {},
  paymentMethod: localStorage.getItem("paymentMethod")
    ? JSON.parse(localStorage.getItem("paymentMethod") || '"PayPal"')
    : "PayPal",
  createCartItem: (item: Cart) => {
    set((state) => {
      const existItem = state.cartItems.find(
        (x) => x.product.id === item.product.id
      );
      let newCartItems;
      if (existItem) {
        newCartItems = state.cartItems.map((cartItem) =>
          cartItem.product.id === existItem.product.id ? item : cartItem
        );
      } else {
        newCartItems = [...state.cartItems, item];
      }

      localStorage.setItem("cartItems", JSON.stringify(newCartItems));

      return {
        ...state,
        cartItems: newCartItems,
      };
    });
  },
  deleteCartItem: (id: number) => {
    set((state) => {
      const newCartItems = state.cartItems.filter((x) => x.product.id !== id);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      return {
        ...state,
        cartItems: newCartItems,
      };
    });
  },
  createShipping: (address: Shipping) => {
    set((state) => {
      localStorage.setItem("shipping", JSON.stringify(address));
      return {
        ...state,
        shipping: address,
      };
    });
  },
  createPaymentMethod: (method: string) => {
    set((state) => {
      localStorage.setItem("paymentMethod", JSON.stringify(method));
      return {
        ...state,
        paymentMethod: method,
      };
    });
  },
  deleteCartItems: () => {
    set((state) => {
      localStorage.setItem("cartItems", JSON.stringify([]));
      return {
        ...state,
        cartItems: [],
      };
    });
  },
}));
