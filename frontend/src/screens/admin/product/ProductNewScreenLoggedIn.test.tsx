import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Routes, Route, MemoryRouter } from "react-router-dom";
// import { prettyDOM } from "@testing-library/dom";

import { App } from "../../../App";
import { LoginScreen } from "../../auth/LoginScreen";
import { ProductListScreen } from "./ProductListScreen";
import { product, order } from "./mocks";
import { ProductNewScreen } from "./ProductNewScreen";

const mockLoginHandler = rest.post(
  "http://localhost:8080/api/users/login",
  async (req, res, ctx) => {
    const requestBody = JSON.parse(await req.text()) as any;
    if (
      requestBody.email === "admin@email.com" &&
      requestBody.password === "123456"
    ) {
      return res(
        ctx.json({
          id: 1,
          name: "admin",
          email: "admin@email.com",
          isAdmin: true,
        })
      );
    } else {
      return res(
        ctx.status(401),
        ctx.json({ message: "Invalid email or password" })
      );
    }
  }
);

const mockProductHandler = rest.get(
  "http://localhost:8080/api/products/:id",
  (_req, res, ctx) => {
    return res(ctx.json(product));
  }
);

const mockProductsHandler = rest.get(
  "http://localhost:8080/api/products",
  (_req, res, ctx) => {
    return res(ctx.json({ page: 1, pages: 2, products: [product] }));
  }
);

const mockOrderHandler = rest.post(
  "http://localhost:8080/api/orders",
  (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 1 }));
  }
);

const mockGetOrderHandler = rest.get(
  "http://localhost:8080/api/orders/1",
  (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(order));
  }
);

const server = setupServer(
  mockLoginHandler,
  mockProductHandler,
  mockProductsHandler,
  mockOrderHandler,
  mockGetOrderHandler
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders ProductScreen with product", async () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/admin/products/" element={<ProductListScreen />} />
          <Route path="/admin/products/new" element={<ProductNewScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText("email"), {
    target: { value: "admin@email.com" },
  });

  fireEvent.change(screen.getByLabelText("password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByTestId("login"));

  await waitFor(async () => {
    expect(screen.getByTestId("user-info-name")).toHaveTextContent("admin");
  });

  const adminButton = await screen.findByText(`Admin Function`);
  expect(adminButton).toBeInTheDocument();

  // Ensure that adminButton click event is fully processed before proceeding
  fireEvent.click(adminButton);

  const productsLink = await screen.findByRole("menuitem", {
    name: /Products/i,
  });
  expect(productsLink).toBeInTheDocument();

  // Ensure that productsLink click event is fully processed before proceeding
  fireEvent.click(productsLink);

  // Wait for the productsData to be updated
  await waitFor(async () => {
    const productsHeading = await screen.findByRole("heading", {
      name: /Products/i,
    });
    expect(productsHeading).toBeInTheDocument();
  });
  expect(await screen.findByText(product.name)).toBeInTheDocument();

  const createProductButton = await screen.findByRole("button", {
    name: /Create Product/i,
  });
  fireEvent.click(createProductButton);

  // const productList = screen.getByTestId("product-list");
  // console.log(prettyDOM(productList));

  //  header Create Product
  await waitFor(async () => {
    const createProductHeading = await screen.findByRole("heading", {
      name: /Create Product/i,
    });
    expect(createProductHeading).toBeInTheDocument();
  });
  screen.debug();
});
