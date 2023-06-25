// frontend\src\services\__tests__\api.test.js
import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  getProductFullsApi,
  loginUserApi,
  registerUserApi,
} from "../../services/api";

interface ReqBody {
  email?: string;
  password?: string;
  name?: string;
}

const API_BASE_URL = "http://localhost:8080/api";
const product = {
  id: 1,
  name: "Test Product",
  image: "url-to-your-image",
  brand: "Test Brand",
  category: "Test Category",
  description: "Test Description",
  price: 100,
  countInStock: 10,
};

const user = {
  name: "John Doe",
  email: "john@email.com",
  password: "123456",
};

const server = setupServer(
  rest.get(`${API_BASE_URL}/products/:id`, (_req, res, ctx) => {
    return res(ctx.json(product));
  }),
  rest.post(`${API_BASE_URL}/users/login`, (req, res, ctx) => {
    const requestBody = req.body as ReqBody;
    if (
      requestBody.email === user.email &&
      requestBody.password === user.password
    ) {
      return res(ctx.json(user));
    } else {
      return res(
        ctx.status(401),
        ctx.json({ message: "Invalid email or password" })
      );
    }
  }),
  rest.post(`${API_BASE_URL}/users/register`, (req, res, ctx) => {
    const requestBody = req.body as ReqBody;
    if (
      requestBody.email === user.email &&
      requestBody.password === user.password &&
      requestBody.name === user.name
    ) {
      return res(ctx.json(user));
    } else {
      return res(ctx.status(400), ctx.json({ message: "Registration failed" }));
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("getProductFullsApi returns product data", async () => {
  const data = await getProductFullsApi(product.id);

  expect(data).toEqual(product);
});

test("loginUserApi logs in a user", async () => {
  const data = await loginUserApi({
    email: user.email,
    password: user.password,
  });

  expect(data).toEqual(user);
});

test("registerUserApi registers a user", async () => {
  const data = await registerUserApi({
    name: user.name,
    email: user.email,
    password: user.password,
  });

  expect(data).toEqual(user);
});
