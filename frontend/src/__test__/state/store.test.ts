// frontend\src\__test__\state\store.test.ts
import { act } from "react-dom/test-utils";
import { renderHook } from "@testing-library/react-hooks";

import { useAuthStore, useCartStore } from "../../state/store";

export const product = {
  id: 1,
  userId: 1,
  name: "Product 1",
  image: "https://example.com/product-1.jpg",
  description: "Description: This is product 1",
  brand: "Brand 1",
  category: "Category 1",
  price: 19.99,
  countInStock: 10,
  rating: 4.5,
  numReviews: 12,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  // afterAll(() => {
  //   console.error.mockRestore();
  // });

  it("should handle setting and clearing user information", () => {
    const { result } = renderHook(() => useAuthStore());

    // Simulate login by setting user information
    act(() => {
      result.current.setUserInformation({
        id: 1,
        name: "Test User",
        email: "test@example.com",
        isAdmin: false,
        token: "testToken",
      });
    });

    const storedUserInformation = JSON.parse(
      localStorage.getItem("userInformation") || ""
    );
    expect(storedUserInformation).toEqual({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      isAdmin: false,
      token: "testToken",
    });
    expect(result.current.userInformation).toEqual({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      isAdmin: false,
      token: "testToken",
    });

    // Simulate logout by clearing user information
    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem("userInformation")).toBeNull();
    expect(result.current.userInformation).toBeNull();
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

    // Simulate adding product to cart
    act(() => {
      result.current.addToCart(testProduct);
    });

    const storedCartItems = JSON.parse(
      localStorage.getItem("cartItems") || "[]"
    );
    expect(storedCartItems).toEqual([testProduct]);
    expect(result.current.cartItems).toEqual([testProduct]);

    // Simulate removing product from cart
    act(() => {
      result.current.removeFromCart(testProduct.product.id);
    });

    expect(localStorage.getItem("cartItems")).toEqual("[]");
    expect(result.current.cartItems).toEqual([]);
  });
});
