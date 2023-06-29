// frontend\src\screens\admin\product\test-utils.ts

import {
  fireEvent,
  screen,
  Matcher,
  renderHook,
  prettyDOM,
  act,
} from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";

import { order, product } from "./mocks";
import { useAuthStore } from "../state/store";
import { UserInfo } from "../../../backend/interfaces";

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

function authenticate(email: string, password: string, user: typeof TEST_USER) {
  return email === user.email && password === user.password;
}

let productList = [product];
export const products = { page: 1, pages: 2, products: productList };

export function createServer() {
  let orderList = [order];
  return setupServer(
    rest.post(`${API_BASE_URL}/users/register`, async (_req, res, ctx) => {
      return res(ctx.json({ id: 1, ...TEST_USER }));
    }),
    rest.post(`${API_BASE_URL}/users/login`, async (req, res, ctx) => {
      const requestBody = JSON.parse(await req.text()) as any;
      if (
        authenticate(requestBody.email, requestBody.password, TEST_ADMIN_USER)
      ) {
        return res(ctx.json({ id: 1, ...TEST_ADMIN_USER }));
      }

      if (authenticate(requestBody.email, requestBody.password, TEST_USER)) {
        return res(ctx.json({ id: 1, ...TEST_USER }));
      }

      return res(
        ctx.status(401),
        ctx.json({ message: "Invalid email or password" })
      );
    }),
    rest.get(`${API_BASE_URL}/products/top`, (_req, res, ctx) => {
      return res(ctx.json([product]));
    }),
    // rest.get(`${API_BASE_URL}/products/:id`, (_req, res, ctx) =>
    //   res(ctx.json(product))
    // ),
    rest.post(`${API_BASE_URL}/products`, async (req, res, ctx) => {
      const postProduct = (await req.json()) as typeof product;
      productList.push(postProduct);
      return res(ctx.json(postProduct));
    }),
    rest.get(`${API_BASE_URL}/products`, (_req, res, ctx) =>
      res(ctx.json(products))
    ),
    rest.delete(`${API_BASE_URL}/products/:id`, (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ message: "Product removed" }));
    }),
    rest.post(`${API_BASE_URL}/orders`, (_req, res, ctx) =>
      res(ctx.status(200), ctx.json({ id: 1 }))
    ),
    rest.get(`${API_BASE_URL}/orders`, (_req, res, ctx) =>
      res(ctx.json(orderList))
    ),
    rest.get(`${API_BASE_URL}/orders/:id`, (_req, res, ctx) =>
      res(ctx.status(200), ctx.json(order))
    ),
    rest.put(`${API_BASE_URL}/orders/:id/pay`, (req, res, ctx) => {
      const id = Number(req.params.id);
      const orderIndex = orderList.findIndex((order) => order.id === id);

      orderList[orderIndex] = {
        ...orderList[orderIndex],
        status: {
          ...orderList[orderIndex].status,
          isPaid: true,
          paidAt: new Date(),
        },
      };

      return res(ctx.status(200), ctx.json(orderList[orderIndex]));
    }),
    rest.put(`${API_BASE_URL}/orders/:id/deliver`, (req, res, ctx) => {
      const id = Number(req.params.id);
      const orderIndex = orderList.findIndex((order) => order.id === id);

      orderList[orderIndex] = {
        ...orderList[orderIndex],
        status: {
          ...orderList[orderIndex].status,
          isDelivered: true,
          deliveredAt: new Date(),
        },
      };
      return res(ctx.status(200), ctx.json(orderList[orderIndex]));
    })
  );
}

export const inputField = (label: Matcher, value: any) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

export async function simulateLogin(isAdmin: boolean = false) {
  let userInfo: UserInfo = isAdmin
    ? { ...TEST_ADMIN_USER, id: 1, token: "aaaaaaaa" }
    : { ...TEST_USER, id: 1, token: "aaaaaaaa" };

  const { result } = renderHook(() => useAuthStore());

  act(() => {
    result.current.setUserInfo(userInfo);
  });

  if (userInfo.name) {
    await screen.findByText(userInfo.name, {
      selector: '[data-testid="user-info-name"]',
    });
  }
}
