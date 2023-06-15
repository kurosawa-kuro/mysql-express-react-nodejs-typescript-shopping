import { create } from "zustand";
import {
  UserAuthStore,
  CartStoreState,
  CartStoreActions,
  ProductInCart,
  ShippingAddress,
} from "../../../backend/interfaces";

export const useAuthStore = create<UserAuthStore>((set) => {
  const storedUserInfo = localStorage.getItem("userInfo");

  return {
    userInfo: storedUserInfo ? JSON.parse(storedUserInfo) : null,
    setUserInfo: (userInfo) => {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime.toString());
      console.log({ userInfo });

      set({ userInfo });
    },
    logout: () => {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");

      set({ userInfo: null });
    },
  };
});

export type CartStore = CartStoreState & CartStoreActions;

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
  addToCart: (item: ProductInCart) => {
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
  saveShippingAddress: (address: ShippingAddress) => {
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
