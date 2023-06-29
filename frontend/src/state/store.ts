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
  cartItems: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart") || "[]")
    : [],
  shipping: localStorage.getItem("shipping")
    ? JSON.parse(localStorage.getItem("shipping") || "{}")
    : {},
  paymentMethod: localStorage.getItem("paymentMethod")
    ? JSON.parse(localStorage.getItem("paymentMethod") || '"PayPal"')
    : "PayPal",
  createCartItem: (cart: Cart) => {
    set((state) => {
      const existItem = state.cartItems.find(
        (cartItem) => cartItem.product.id === cart.product.id
      );
      let newCartItems;
      if (existItem) {
        newCartItems = state.cartItems.map((cartItem) =>
          cartItem.product.id === existItem.product.id ? cart : cartItem
        );
      } else {
        newCartItems = [...state.cartItems, cart];
      }

      localStorage.setItem("cart", JSON.stringify(newCartItems));

      return {
        ...state,
        cartItems: newCartItems,
      };
    });
  },
  deleteCartItem: (id: number) => {
    set((state) => {
      const newCartItems = state.cartItems.filter((x) => x.product.id !== id);
      localStorage.setItem("cart", JSON.stringify(newCartItems));
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
      localStorage.setItem("cart", JSON.stringify([]));
      return {
        ...state,
        cartItems: [],
      };
    });
  },
}));
