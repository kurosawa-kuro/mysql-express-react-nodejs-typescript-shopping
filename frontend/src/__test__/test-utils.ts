// frontend\src\screens\admin\product\test-utils.ts

import { fireEvent, screen, Matcher } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { order, product } from "./mocks";

export const API_BASE_URL = "http://localhost:8080/api";
export const TEST_USER = {
  name: "admin",
  email: "admin@email.com",
  password: "123456",
  isAdmin: true,
};

export function createServer() {
  let productList = [product];

  return setupServer(
    rest.post(`${API_BASE_URL}/users/login`, async (req, res, ctx) => {
      const requestBody = JSON.parse(await req.text()) as any;
      const response =
        requestBody.email === TEST_USER.email &&
        requestBody.password === TEST_USER.password
          ? res(
              ctx.json({
                id: 1,
                name: TEST_USER.name,
                email: TEST_USER.email,
                isAdmin: TEST_USER.isAdmin,
              })
            )
          : res(
              ctx.status(401),
              ctx.json({ message: "Invalid email or password" })
            );
      return response;
    }),
    rest.get(`${API_BASE_URL}/products/:id`, (_req, res, ctx) =>
      res(ctx.json(product))
    ),
    rest.get(`${API_BASE_URL}/products`, (_req, res, ctx) =>
      res(ctx.json({ page: 1, pages: 2, products: productList }))
    ),
    rest.post(`${API_BASE_URL}/products`, async (req, res, ctx) => {
      const postProduct = (await req.json()) as typeof product;
      productList.push(postProduct);
      return res(ctx.json(postProduct));
    }),
    rest.post(`${API_BASE_URL}/orders`, (_req, res, ctx) =>
      res(ctx.status(200), ctx.json({ id: 1 }))
    ),
    rest.get(`${API_BASE_URL}/orders/1`, (_req, res, ctx) =>
      res(ctx.status(200), ctx.json(order))
    )
  );
}

export const inputField = (label: Matcher, value: any) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });