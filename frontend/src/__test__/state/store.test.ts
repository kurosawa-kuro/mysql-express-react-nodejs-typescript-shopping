// frontend\src\__test__\state\store.test.ts
import { act } from "react-dom/test-utils";
import { renderHook } from "@testing-library/react";

import { useAuthStore, useCartStore } from "../../state/store";
import { product } from "../mocks";

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should handle setting and clearing user information", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUserInfo({
        id: 1,
        name: "Test User",
        email: "test@example.com",
        isAdmin: false,
        token: "testToken",
      });
    });

    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "");
    expect(storedUserInfo).toEqual({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      isAdmin: false,
      token: "testToken",
    });
    expect(result.current.userInfo).toEqual({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      isAdmin: false,
      token: "testToken",
    });

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem("userInfo")).toBeNull();
    expect(result.current.userInfo).toBeNull();
  });
});

describe("useCartStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should handle adding and removing from cart", () => {
    const { result } = renderHook(() => useCartStore());
    const testProduct = {
      product: product,
      qty: 1,
    };

    act(() => {
      result.current.createCartItem(testProduct);
    });

    let storedCartItems = JSON.parse(localStorage.getItem("cart") || "[]");

    storedCartItems = storedCartItems.map((item: any) => {
      item.product.createdAt = new Date(item.product.createdAt);
      item.product.updatedAt = new Date(item.product.updatedAt);
      return item;
    });

    expect(storedCartItems).toEqual([testProduct]);
    expect(result.current.cartItems).toEqual([testProduct]);

    act(() => {
      result.current.deleteCartItem(testProduct.product.id);
    });

    expect(localStorage.getItem("cart")).toEqual("[]");
    expect(result.current.cartItems).toEqual([]);
  });
});
