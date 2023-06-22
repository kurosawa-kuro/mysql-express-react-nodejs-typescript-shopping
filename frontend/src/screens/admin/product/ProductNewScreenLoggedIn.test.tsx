import {
  Matcher,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Routes, Route, MemoryRouter } from "react-router-dom";

import { App } from "../../../App";
import { LoginScreen } from "../../auth/LoginScreen";
import { ProductListScreen } from "./ProductListScreen";
import { product, product2, order } from "./mocks";
import { ProductNewScreen } from "./ProductNewScreen";

const API_BASE_URL = "http://localhost:8080/api";
const TEST_USER = {
  name: "admin",
  email: "admin@email.com",
  password: "123456",
  isAdmin: true,
};

function createServer() {
  let productList = [product];

  return setupServer(
    rest.post(`${API_BASE_URL}/users/login`, async (req, res, ctx) => {
      const requestBody = JSON.parse(await req.text()) as any;
      if (
        requestBody.email === TEST_USER.email &&
        requestBody.password === TEST_USER.password
      ) {
        return res(
          ctx.json({
            id: 1,
            name: TEST_USER.name,
            email: TEST_USER.email,
            isAdmin: TEST_USER.isAdmin,
          })
        );
      } else {
        return res(
          ctx.status(401),
          ctx.json({ message: "Invalid email or password" })
        );
      }
    }),
    rest.get(`${API_BASE_URL}/products/:id`, (_req, res, ctx) => {
      return res(ctx.json(product));
    }),
    rest.get(`${API_BASE_URL}/products`, (_req, res, ctx) => {
      return res(ctx.json({ page: 1, pages: 2, products: productList }));
    }),
    rest.post(`${API_BASE_URL}/products`, (_req, res, ctx) => {
      productList.push(product2); // Add the new product to the list
      return res(ctx.json(product2));
    }),
    rest.post(`${API_BASE_URL}/orders`, (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ id: 1 }));
    }),
    rest.get(`${API_BASE_URL}/orders/1`, (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(order));
    })
  );
}

function inputField(label: Matcher, value: any) {
  fireEvent.change(screen.getByLabelText(label), {
    target: { value },
  });
}

const server = createServer();

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

  inputField("email", TEST_USER.email);
  inputField("password", TEST_USER.password);

  fireEvent.click(screen.getByTestId("login"));

  await waitFor(async () => {
    expect(screen.getByTestId("user-info-name")).toHaveTextContent("admin");
  });

  const adminButton = await screen.findByText(`Admin Function`);
  expect(adminButton).toBeInTheDocument();

  fireEvent.click(adminButton);

  const productsLink = await screen.findByRole("menuitem", {
    name: /Products/i,
  });
  expect(productsLink).toBeInTheDocument();

  fireEvent.click(productsLink);

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

  inputField("Name", "Name");
  inputField("Price", 100);
  inputField("Image", "Image path");
  inputField("Brand", "Brand 1");
  inputField("Count In Stock", 10);
  inputField("Category", "Category 1");
  inputField("Description", "Description Description Description");

  const createButton = await screen.findByText(`Create`);
  expect(createButton).toBeInTheDocument();

  fireEvent.click(createButton);

  await waitFor(async () => {
    const productsHeading = await screen.findByRole("heading", {
      name: /Products/i,
    });
    expect(productsHeading).toBeInTheDocument();
  });
  expect(await screen.findByText(product2.name)).toBeInTheDocument();
  // screen.debug();
});
