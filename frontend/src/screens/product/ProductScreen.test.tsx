import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import { ProductScreen } from "../product/ProductScreen";
import { ProductFull } from "../../../../backend/interfaces";
import { App } from "../../App";

const product: ProductFull = {
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
};

const server = setupServer(
  rest.get("http://localhost:8080/api/products/:id", (_req, res, ctx) => {
    return res(ctx.json(product));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders ProductScreen with product", async () => {
  render(
    <MemoryRouter initialEntries={["/products/1"]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/products/:id" element={<ProductScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText(product.name)).toBeInTheDocument();
  expect(
    await screen.findByText(`Price: $${product.price}`)
  ).toBeInTheDocument();
  expect(await screen.findByText(`Add To Cart`)).toBeInTheDocument();

  screen.debug();
});
