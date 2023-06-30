// Built-in & External packages
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Components
import { App } from "../../../App";
import { LoginScreen } from "../../../screens/auth/LoginScreen";
import { OrderListScreen } from "../../../screens/admin/order/OrderListScreen";
import { OrderScreen } from "../../../screens/order/OrderScreen";

// Utils & Constants
import {
  createServer,
  inputField,
  // printDOM,
  TEST_ADMIN_USER,
} from "../../test-utils";

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

  describe("Order list", () => {
    describe("admin can move order list", () => {
      it("allows an admin to navigate to the order list, view a specific order and mark it as paid", async () => {
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
        inputField(LABELS.email, TEST_ADMIN_USER.email);
        inputField(LABELS.password, TEST_ADMIN_USER.password);
        fireEvent.click(screen.getByTestId("login"));
        fireEvent.click(await screen.findByText(`Admin Function`));
        const OrdersLink = await screen.findByRole("menuitem", {
          name: /Orders/i,
        });
        fireEvent.click(OrdersLink);
        await screen.findByRole("heading", { name: /Orders/i });
        expect(await screen.findByText("$113.49")).toBeInTheDocument();
        const detailsLink = await screen.findByText("Details");

        fireEvent.click(detailsLink);
        expect(await screen.findByText("Order 28")).toBeInTheDocument();

        const testPayButton = await screen.findByText("Pay");
        fireEvent.click(testPayButton);
        expect(await screen.findByText("Order is paid")).toBeInTheDocument();
      });
    });
  });
});
