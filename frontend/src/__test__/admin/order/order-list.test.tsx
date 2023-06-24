// frontend\src\screens\admin\product\ProductNewScreenLoggedIn.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { App } from "../../../App";
import { LoginScreen } from "../../../screens/auth/LoginScreen";
import {
  createServer,
  inputField,
  printDOM,
  TEST_USER,
} from "../../test-utils";
import { OrderListScreen } from "../../../screens/admin/order/OrderListScreen";
import { OrderScreen } from "../../../screens/order/OrderScreen";

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
  describe("Order list", () => {
    it("admin can move order list", async () => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/admin/orders/" element={<OrderListScreen />} />
              <Route path="/orders/:id" element={<OrderScreen />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      inputField(LABELS.email, TEST_USER.email);
      inputField(LABELS.password, TEST_USER.password);

      fireEvent.click(screen.getByTestId("login"));

      fireEvent.click(await screen.findByText(`Admin Function`));

      const OrdersLink = await screen.findByRole("menuitem", {
        name: /Orders/i,
      });
      fireEvent.click(OrdersLink);

      // await waitFor(() => screen.findByRole("heading", { name: /Order /i }));
      await screen.findByRole("heading", { name: /Orders/i });
      expect(await screen.findByText("$113.49")).toBeInTheDocument();

      const detailsLink = await screen.findByText("Details");
      fireEvent.click(detailsLink);

      expect(await screen.findByText("Order 28")).toBeInTheDocument();

      const testPayButton = await screen.findByText("Test Pay");
      fireEvent.click(testPayButton);

      // Mark As Delivered
      expect(await screen.findByText("Order is paid")).toBeInTheDocument();
      printDOM();
    });
  });
});
