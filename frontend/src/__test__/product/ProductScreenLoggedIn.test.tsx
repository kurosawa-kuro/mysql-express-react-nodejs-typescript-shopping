// frontend\src\screens\admin\product\ProductNewScreenLoggedIn.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { App } from "../../App";
import { LoginScreen } from "../../screens/auth/LoginScreen";
import { createServer, inputField, printDOM, TEST_USER } from "../test-utils";
import { HomeScreen } from "../../screens/product/HomeScreen";
import { product } from "../mocks";

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

describe("Product Operation", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  // Grouping all Login related tests together
  describe("Login process", () => {
    it("renders login and admin can login", async () => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/" element={<HomeScreen />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      inputField(LABELS.email, TEST_USER.email);
      inputField(LABELS.password, TEST_USER.password);

      fireEvent.click(screen.getByTestId("login"));

      const toastMessage = await screen.findByText("Successfully logged in");

      expect(toastMessage).toBeInTheDocument();

      const toastContainer = toastMessage.parentElement;
      const successIcon = toastContainer?.querySelector("svg");
      expect(successIcon).toBeInTheDocument();

      await screen.findByText(TEST_USER.name, {
        selector: '[data-testid="user-info-name"]',
      });

      //  Latest Products
      expect(await screen.findByText("Latest Products")).toBeInTheDocument();
      expect(await screen.findByText(product.name)).toBeInTheDocument();

      const searchInput = screen.getByPlaceholderText("Search Products...");
      fireEvent.change(searchInput, { target: { value: "Product 1" } });

      const searchButton = screen.getByText("Search");
      fireEvent.click(searchButton);

      printDOM();
    });
  });
});
