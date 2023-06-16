// frontend\src\state\store.ts

import { create } from "zustand";
import {
  UserAuth,
  CartState,
  CartActions,
  CartProduct,
  OrderShipping,
} from "../../../backend/interfaces";

export const useAuthStore = create<UserAuth>((set) => {
  const storedUserInformation = localStorage.getItem("userInformation");

  return {
    userInformation: storedUserInformation
      ? JSON.parse(storedUserInformation)
      : null,
    setUserInformation: (userInformation) => {
      localStorage.setItem("userInformation", JSON.stringify(userInformation));
      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime.toString());
      console.log({ userInformation });

      set({ userInformation });
    },
    logout: () => {
      localStorage.removeItem("userInformation");
      localStorage.removeItem("expirationTime");

      set({ userInformation: null });
    },
  };
});

export type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>((set) => ({
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems") || "[]")
    : [],
  shippingAddress: localStorage.getItem("shippingAddress")
    ? JSON.parse(localStorage.getItem("shippingAddress") || "{}")
    : {},
  paymentMethod: localStorage.getItem("paymentMethod")
    ? JSON.parse(localStorage.getItem("paymentMethod") || '"PayPal"')
    : "PayPal",
  addToCart: (item: CartProduct) => {
    console.log({ item });
    set((state) => {
      const existItem = state.cartItems.find(
        (x) => x.product.id === item.product.id
      );
      let newCartItems;
      if (existItem) {
        newCartItems = state.cartItems.map((x) =>
          x.product.id === existItem.product.id ? item : x
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
  removeFromCart: (id: number) => {
    set((state) => {
      const newCartItems = state.cartItems.filter((x) => x.product.id !== id);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      return {
        ...state,
        cartItems: newCartItems,
      };
    });
  },
  saveOrderShipping: (address: OrderShipping) => {
    set((state) => {
      localStorage.setItem("shippingAddress", JSON.stringify(address));
      return {
        ...state,
        shippingAddress: address,
      };
    });
  },
  savePaymentMethod: (method: string) => {
    set((state) => {
      localStorage.setItem("paymentMethod", JSON.stringify(method));
      return {
        ...state,
        paymentMethod: method,
      };
    });
  },
  clearCartItems: () => {
    set((state) => {
      localStorage.setItem("cartItems", JSON.stringify([]));
      return {
        ...state,
        cartItems: [],
      };
    });
  },
}));
