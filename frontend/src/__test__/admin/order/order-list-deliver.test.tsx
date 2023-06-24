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
  API_BASE_URL,
  createServer,
  inputField,
  printDOM,
  TEST_USER,
} from "../../test-utils";
import { rest } from "msw";

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
    describe("admin can move order list for Deliver", () => {
      it("allows an admin to navigate to the order list, view a specific order and mark it as delivered", async () => {
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

        await screen.findByRole("heading", { name: /Orders/i });
        expect(await screen.findByText("$113.49")).toBeInTheDocument();

        server.use(
          rest.get(`${API_BASE_URL}/orders/28`, (_req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json({
                id: 28,
                userId: 2,
                address: "大通り公園",
                city: "0600061",
                postalCode: "札幌",
                paymentMethod: "PayPal",
                paymentResultId: null,
                paymentResultStatus: null,
                paymentResultUpdateTime: null,
                paymentResultEmail: null,
                price: {
                  itemsPrice: 89.99,
                  taxPrice: 13.5,
                  shippingPrice: 10,
                  totalPrice: 113.49,
                },
                itemsPrice: 89.99,
                taxPrice: 13.5,
                shippingPrice: 10,
                totalPrice: 113.49,
                isPaid: true,
                paidAt: "2023-06-14T21:07:17.666Z",
                isDelivered: false,
                deliveredAt: null,
                createdAt: "2023-06-21T06:39:11.497Z",
                updatedAt: "2023-06-21T06:39:11.497Z",
                user: {
                  id: 2,
                  name: "john",
                  email: "john@email.com",
                  password:
                    "$2a$10$eRfvYeJFQKph.3IVWhT5u.Ae7a74KF8DlWxvSKFrp3VqlVBb0k13m",
                  isAdmin: false,
                  createdAt: "2023-06-14T21:07:17.601Z",
                  updatedAt: "2023-06-14T21:07:17.601Z",
                },
                orderProducts: [
                  {
                    orderId: 28,
                    productId: 1,
                    qty: 1,
                    product: {
                      id: 1,
                      userId: 1,
                      name: "Airpods Wireless Bluetooth Headphones",
                      image: "/images/airpods.jpg",
                      brand: "Apple",
                      category: "Electronics",
                      description:
                        "Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while wor",
                      rating: 4.5,
                      numReviews: 12,
                      price: 89.99,
                      countInStock: 10,
                      createdAt: "2023-06-14T21:07:17.666Z",
                      updatedAt: "2023-06-14T21:07:17.666Z",
                    },
                  },
                ],
              })
            );
          })
        );

        const detailsLink = await screen.findByText("Details");
        fireEvent.click(detailsLink);

        expect(await screen.findByText("Order 28")).toBeInTheDocument();
        printDOM();

        const markAsDeliveredButton = await screen.findByText(
          "Mark As Delivered"
        );
        fireEvent.click(markAsDeliveredButton);

        expect(
          await screen.findByText("Order is delivered")
        ).toBeInTheDocument();
        printDOM();
      });
    });
  });
});
