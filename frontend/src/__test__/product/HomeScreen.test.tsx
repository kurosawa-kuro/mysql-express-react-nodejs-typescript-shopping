// frontend\src\screens\product\HomeScreen.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HomeScreen } from "../../screens/product/HomeScreen";
import { ProductList } from "../../../../backend/interfaces";

// これはダミーデータで、適宜変更してください
const productList: ProductList = {
  products: [
    {
      id: 1,
      userId: 1, // userIdが必要
      name: "Product 1",
      image: "https://example.com/product-1.jpg",
      description: "This is product 1",
      brand: "Brand 1",
      category: "Category 1",
      price: 19.99,
      countInStock: 10,
      rating: 4.5,
      numReviews: 12,
      createdAt: new Date(), // createdAtが必要
      updatedAt: new Date(), // updatedAtが必要
    },
    {
      id: 2,
      userId: 1, // userIdが必要
      name: "Product 2",
      image: "https://example.com/product-2.jpg",
      description: "This is product 2",
      brand: "Brand 2",
      category: "Category 2",
      price: 29.99,
      countInStock: 20,
      rating: 4.0,
      numReviews: 8,
      createdAt: new Date(), // createdAtが必要
      updatedAt: new Date(), // updatedAtが必要
    },
    // 他の商品データ...
  ],
  page: 1,
  pages: 5,
};

const { products } = productList;

const server = setupServer(
  rest.get("http://localhost:8080/api/products", (_req, res, ctx) => {
    const keyword = "";
    const pageNumber = 1;

    if (keyword !== "" || pageNumber !== 1) {
    }

    return res(ctx.json(productList));
  }),
  rest.get("http://localhost:8080/api/products/top", (_req, res, ctx) => {
    return res(ctx.json([]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders HomeScreen with product list", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </MemoryRouter>
  );

  for (const product of products) {
    await waitFor(() =>
      expect(screen.getByText(product.name)).toBeInTheDocument()
    );
  }
});
