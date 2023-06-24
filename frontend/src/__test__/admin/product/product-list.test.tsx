// frontend\src\screens\admin\product\ProductNewScreenLoggedIn.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { App } from "../../../App";
import { LoginScreen } from "../../../screens/auth/LoginScreen";
import { ProductListScreen } from "../../../screens/admin/product/ProductListScreen";
import { product } from "../../mocks";
import { createServer, inputField, TEST_ADMIN_USER } from "../../test-utils";
import { ProductNewScreen } from "../../../screens/admin/product/ProductNewScreen";

const server = createServer();

const LABELS = {
  email: "email",
  password: "password",
  name: "Name",
  price: "Price",
  imageFile: "Image File",
  brand: "Brand",
  countInStock: "Count In Stock",
  category: "Category",
  description: "Description",
};

describe("Admin Product Management", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  // Grouping all Login related tests together
  describe("Product list", () => {
    it("admin can view product list", async () => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/admin/products/" element={<ProductListScreen />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      inputField(LABELS.email, TEST_ADMIN_USER.email);
      inputField(LABELS.password, TEST_ADMIN_USER.password);

      fireEvent.click(screen.getByTestId("login"));

      fireEvent.click(await screen.findByText(`Admin Function`));

      const productsLink = await screen.findByRole("menuitem", {
        name: /Products/i,
      });
      fireEvent.click(productsLink);

      await screen.findByRole("heading", { name: /Products/i });
      expect(await screen.findByText(product.name)).toBeInTheDocument();
    });

    it("admin can move product create", async () => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/admin/products/" element={<ProductListScreen />} />
              <Route
                path="/admin/products/new"
                element={<ProductNewScreen />}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      inputField(LABELS.email, TEST_ADMIN_USER.email);
      inputField(LABELS.password, TEST_ADMIN_USER.password);

      fireEvent.click(screen.getByTestId("login"));

      fireEvent.click(await screen.findByText(`Admin Function`));

      const productsLink = await screen.findByRole("menuitem", {
        name: /Products/i,
      });
      fireEvent.click(productsLink);

      await screen.findByRole("heading", { name: /Products/i });
      fireEvent.click(await screen.findByText(`Create Product`));

      await screen.findByRole("heading", { name: /Create Product/i });
    });
  });
});
