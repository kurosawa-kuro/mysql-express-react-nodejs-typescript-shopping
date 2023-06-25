// frontend\src\screens\admin\product\test-utils.ts

import { fireEvent, screen, Matcher } from "@testing-library/react";
import { prettyDOM } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { order, product } from "./mocks";

export const printDOM = (length: number = 50000) =>
  console.log(prettyDOM(document.body, length));

export const API_BASE_URL = "http://localhost:8080/api";
export const TEST_USER = {
  name: "john",
  email: "john@email.com",
  password: "123456",
  isAdmin: false,
};
export const TEST_ADMIN_USER = {
  name: "admin",
  email: "admin@email.com",
  password: "123456",
  isAdmin: true,
};

let productList = [product];
export const products = { page: 1, pages: 2, products: productList };

export function createServer() {
  let orderList = [order];
  return setupServer(
    rest.post(`${API_BASE_URL}/users/login`, async (req, res, ctx) => {
      const requestBody = JSON.parse(await req.text()) as any;
      let response;
      if (
        requestBody.email === TEST_ADMIN_USER.email &&
        requestBody.password === TEST_ADMIN_USER.password
      ) {
        response = res(
          ctx.json({
            id: 1,
            name: TEST_ADMIN_USER.name,
            email: TEST_ADMIN_USER.email,
            isAdmin: TEST_ADMIN_USER.isAdmin,
          })
        );
      } else if (
        requestBody.email === "john@email.com" &&
        requestBody.password === "123456"
      ) {
        response = res(
          ctx.json({
            id: 1,
            name: "john",
            email: "john@email.com",
            isAdmin: false,
          })
        );
      } else {
        response = res(
          ctx.status(401),
          ctx.json({ message: "Invalid email or password" })
        );
      }

      return response;
    }),
    rest.get("http://localhost:8080/api/products/top", (_req, res, ctx) => {
      return res(ctx.json([product]));
    }),
    rest.get(`${API_BASE_URL}/products/:id`, (_req, res, ctx) =>
      res(ctx.json(product))
    ),
    rest.get(`${API_BASE_URL}/products`, (_req, res, ctx) =>
      res(ctx.json(products))
    ),
    rest.post(`${API_BASE_URL}/products`, async (req, res, ctx) => {
      const postProduct = (await req.json()) as typeof product;
      productList.push(postProduct);
      return res(ctx.json(postProduct));
    }),
    rest.delete(`${API_BASE_URL}/products/:id`, (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ message: "Product removed" }));
    }),

    rest.get(`${API_BASE_URL}/orders`, (_req, res, ctx) =>
      res(ctx.json(orderList))
    ),
    rest.post(`${API_BASE_URL}/orders`, (_req, res, ctx) =>
      res(ctx.status(200), ctx.json({ id: 1 }))
    ),
    rest.get(`${API_BASE_URL}/orders/:id`, (_req, res, ctx) =>
      res(ctx.status(200), ctx.json(order))
    ),
    rest.put(`${API_BASE_URL}/orders/:id/pay`, (req, res, ctx) => {
      const id = Number(req.params.id);
      const orderIndex = orderList.findIndex((order) => order.id === id);

      if (orderIndex === -1) {
        return res(ctx.status(404), ctx.json({ message: "Order not found" }));
      }

      orderList[orderIndex] = {
        ...orderList[orderIndex],
        isPaid: true,
        // paidAt: new Date(),
      };
      return res(ctx.status(200), ctx.json(orderList[orderIndex]));
    }),
    rest.put(`${API_BASE_URL}/orders/:id/deliver`, (req, res, ctx) => {
      const id = Number(req.params.id);
      const orderIndex = orderList.findIndex((order) => order.id === id);

      if (orderIndex === -1) {
        return res(ctx.status(404), ctx.json({ message: "Order not found" }));
      }

      orderList[orderIndex] = {
        ...orderList[orderIndex],
        isDelivered: true,
        // paidAt: new Date(),
      };
      return res(ctx.status(200), ctx.json(orderList[orderIndex]));
    })
  );
}

export const inputField = (label: Matcher, value: any) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
