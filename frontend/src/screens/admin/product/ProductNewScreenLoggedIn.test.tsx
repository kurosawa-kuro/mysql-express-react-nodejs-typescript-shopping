// frontend\src\screens\admin\product\ProductNewScreenLoggedIn.test.tsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import { rest } from "msw";

import { App } from "../../../App";
import { LoginScreen } from "../../auth/LoginScreen";
import { ProductListScreen } from "./ProductListScreen";
import { product, postProductData } from "./mocks";
import { ProductNewScreen } from "./ProductNewScreen";

import {
  createServer,
  inputField,
  TEST_USER,
  API_BASE_URL,
} from "./test-utils";

jest.mock("../../../services/api", () => ({
  ...jest.requireActual("../../../services/api"),
  uploadProductImageApi: jest.fn(() =>
    Promise.resolve({
      image: "url-to-your-image",
      message: "Image uploaded successfully",
    })
  ),
}));

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

const server = createServer();

describe("Admin Product Management", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe("Login process", () => {
    test("renders login and admin can login", async () => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/login" element={<LoginScreen />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      inputField(LABELS.email, TEST_USER.email);
      inputField(LABELS.password, TEST_USER.password);

      fireEvent.click(screen.getByTestId("login"));

      await screen.findByText("admin", {
        selector: '[data-testid="user-info-name"]',
      });
    });
  });

  describe("Product list", () => {
    test("admin can view product list", async () => {
      render(
        <MemoryRouter initialEntries={["/admin/products"]}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/admin/products/" element={<ProductListScreen />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText(`Admin Function`));

      const productsLink = await screen.findByRole("menuitem", {
        name: /Products/i,
      });
      fireEvent.click(productsLink);

      await screen.findByRole("heading", { name: /Products/i });
      expect(await screen.findByText(product.name)).toBeInTheDocument();
    });
  });

  describe("Create new product", () => {
    const { uploadProductImageApi } = require("../../../services/api");
    const mockUpload = uploadProductImageApi as jest.MockedFunction<
      typeof uploadProductImageApi
    >;

    test("admin can create a new product", async () => {
      render(
        <MemoryRouter initialEntries={["/admin/products/new"]}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route
                path="/admin/products/new"
                element={<ProductNewScreen />}
              />
              <Route path="/admin/products/" element={<ProductListScreen />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      fireEvent.click(await screen.findByRole("button", { name: /Create/i }));

      await screen.findByRole("heading", { name: /Create Product/i });

      const file = new File(["dummy content"], "test.png", {
        type: "image/png",
      });

      // Get the input element for uploading the image
      const input = screen.getByLabelText(LABELS.imageFile) as HTMLInputElement;

      // This line of code will trigger the 'onChange' event of the file input field
      userEvent.upload(input, file);

      // Assert that the mocked upload function is called
      await waitFor(() => expect(mockUpload).toHaveBeenCalledTimes(1));
      expect(
        await screen.findByText("Image uploaded successfully")
      ).toBeInTheDocument();

      inputField(LABELS.name, postProductData.name);
      inputField(LABELS.price, postProductData.price);
      inputField(LABELS.brand, postProductData.brand);
      inputField(LABELS.countInStock, postProductData.countInStock);
      inputField(LABELS.category, postProductData.category);
      inputField(LABELS.description, postProductData.description);

      fireEvent.click(screen.getByText(`Create`));

      await screen.findByRole("heading", { name: /Products/i });
      expect(await screen.findByText(postProductData.name)).toBeInTheDocument();
    });

    test("admin sees error message when creating a new product fails", async () => {
      // API call fails
      server.use(
        rest.post(`${API_BASE_URL}/products`, (_req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ message: "Internal Server Error" })
          );
        })
      );

      render(
        <MemoryRouter initialEntries={["/admin/products/new"]}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route
                path="/admin/products/new"
                element={<ProductNewScreen />}
              />
              <Route path="/admin/products/" element={<ProductListScreen />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      fireEvent.click(await screen.findByRole("button", { name: /Create/i }));

      await screen.findByRole("heading", { name: /Create Product/i });

      const file = new File(["dummy content"], "test.png", {
        type: "image/png",
      });

      // Get the input element for uploading the image
      const input = screen.getByLabelText(LABELS.imageFile) as HTMLInputElement;

      // This line of code will trigger the 'onChange' event of the file input field
      userEvent.upload(input, file);

      // Assert that the mocked upload function is called
      await waitFor(() => expect(mockUpload).toHaveBeenCalledTimes(1));
      expect(
        await screen.findByText("Image uploaded successfully")
      ).toBeInTheDocument();

      inputField(LABELS.name, postProductData.name);
      inputField(LABELS.price, postProductData.price);
      inputField(LABELS.brand, postProductData.brand);
      inputField(LABELS.countInStock, postProductData.countInStock);
      inputField(LABELS.category, postProductData.category);
      inputField(LABELS.description, postProductData.description);

      // Triggering the submission
      fireEvent.click(await screen.findByRole("button", { name: /Create/i }));

      // Check if toast error is displayed
      await waitFor(() => {
        const alerts = screen.getAllByRole("alert");
        expect(
          alerts.some((alert) => alert.textContent === "Internal Server Error")
        ).toBe(true);
      });
    });
  });
});
