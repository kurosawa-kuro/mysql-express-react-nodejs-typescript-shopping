// 必要なライブラリのインポート
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";
// import { CartProduct } from "../../../../backend/interfaces";
import { ProductScreen } from "./ProductScreen";
import { useAuthStore, useCartStore } from "../../state/store";
import { App } from "../../App";

jest.mock("zustand");

const server = setupServer(
  rest.get("/api/products/1", (_req, res, ctx) => {
    return res(
      ctx.json({
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
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterEach(() => {
  jest.clearAllMocks();
});
afterAll(() => server.close());

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
}));

jest.mock("../../state/store", () => {
  const actualModule = jest.requireActual("../../state/store");

  return {
    __esModule: true,
    ...actualModule,
    useCartStore: jest.fn(),
    useAuthStore: jest.fn(),
  };
});

describe("ProductScreen", () => {
  it('should add item to cart when "Add to Cart" button is clicked', async () => {
    const mockUseAuthStore = useAuthStore as jest.MockedFunction<
      typeof useAuthStore
    >;
    mockUseAuthStore.mockImplementation(() => ({
      userInformation: null, // replace null with the mock data that fits your needs
      logout: jest.fn(),
      // add other functions or data that useAuthStore provides
    }));

    const mockAddToCart = jest.fn();

    (
      useCartStore as jest.MockedFunction<typeof useCartStore>
    ).mockImplementation(() => ({
      cartItems: [],
      shippingAddress: { address: "", city: "", postalCode: "" },
      paymentMethod: "",
      addToCart: mockAddToCart,
      removeFromCart: jest.fn(),
      saveOrderShipping: jest.fn(),
      savePaymentMethod: jest.fn(),
      clearCartItems: jest.fn(),
    }));

    render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/products/:id" element={<ProductScreen />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText("Product 1")).toBeInTheDocument();
    screen.debug();
    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    userEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith({
      product: { id: "1" },
      qty: 1,
    });
  });
});
