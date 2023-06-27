import { fireEvent, render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import { ProductScreen } from "../../screens/product/ProductScreen";
import { Product } from "../../../../backend/interfaces";
import { App } from "../../App";
import { CartScreen } from "../../screens/order/CartScreen";
import { ShippingScreen } from "../../screens/order/ShippingScreen";
import { PaymentScreen } from "../../screens/order/PaymentScreen";
import { PlaceOrderScreen } from "../../screens/order/PlaceOrderScreen";
import { OrderScreen } from "../../screens/order/OrderScreen";

const product: Product = {
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
  }),
  rest.post("http://localhost:8080/api/orders", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 1 }));
  }),
  rest.get("http://localhost:8080/api/orders/1", (_req, res, ctx) => {
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
        isPaid: false,
        paidAt: null,
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

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders ProductScreen with product", async () => {
  render(
    <MemoryRouter initialEntries={["/products/1"]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/products/:id" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/place-order" element={<PlaceOrderScreen />} />
          <Route path="/orders/:id" element={<OrderScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText(product.name)).toBeInTheDocument();
  expect(
    await screen.findByText(`Price: $${product.price}`)
  ).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Add To Cart/i));

  expect(await screen.findByText(`Shopping Cart`)).toBeInTheDocument();
  expect(await screen.findByText(product.name)).toBeInTheDocument();
  expect(
    await screen.findByText(`Subtotal: $${product.price}`)
  ).toBeInTheDocument();
  expect(await screen.findByText(`Total (1) items`)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Proceed To Checkout/i));

  expect(
    await screen.findByRole("heading", { name: /Shipping/i })
  ).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText("Enter address"), {
    target: { value: "大通り公園" },
  });
  fireEvent.change(screen.getByPlaceholderText("Enter city"), {
    target: { value: "札幌" },
  });
  fireEvent.change(screen.getByPlaceholderText("Enter postal code"), {
    target: { value: "0600061" },
  });
  fireEvent.click(screen.getByText(/Continue/i));

  expect(
    await screen.findByRole("heading", { name: /Payment Method/i })
  ).toBeInTheDocument();
  expect(screen.getByRole("radio", { name: /PayPal/i })).toBeChecked();
  fireEvent.click(screen.getByText(/Continue/i));

  // Place Order
  expect(
    await screen.findByRole("heading", { name: /Place Order/i })
  ).toBeInTheDocument();

  // Shipping
  expect(
    await screen.findByRole("heading", { name: /Shipping/i })
  ).toBeInTheDocument();
  // Order Summary
  expect(await screen.findByText(`Order Summary`)).toBeInTheDocument();

  //  fire Place Order
  fireEvent.click(screen.getByRole("button", { name: /Place Order/i }));

  // await Test Pay
  expect(await screen.findByText("Order 28")).toBeInTheDocument();
  // await waitFor(() => screen.getByText("Test Pay"));
  // expect(await screen.findByText(`Test Pay`)).toBeInTheDocument();
  // screen.debug();
});
