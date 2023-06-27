import request from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  loginUserAndGetToken,
  createUser,
  createProduct,
} from "../test-utils";
import { Product, User } from "@prisma/client";

let token: string;
let product: Product;
let user: User;

beforeAll(async () => {
  await clearDatabase(); // Clear the database
  user = await createUser("testuser@example.com", "TestUserPassword123");
  product = await createProduct(user.id);

  // Log in and get the token
  const agent = request.agent(app);
  token = await loginUserAndGetToken(
    agent,
    "testuser@example.com",
    "TestUserPassword123"
  );
});

describe("Order Controller", () => {
  test("POST /api/orders/ - Should create a new order", async () => {
    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", `jwt=${token}`)
      .send({
        orderProducts: [
          {
            product,
            qty: 1,
          },
        ],
        address: "123 Test St",
        city: "Test City",
        postalCode: "12345",
        paymentMethod: "Test Payment Method",
        price: {
          itemsPrice: product.price,
          taxPrice: 0.1 * product.price,
          shippingPrice: 10,
          totalPrice: 1.1 * product.price + 10,
        },
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id"); // Check if response has an id (created order)
    expect(response.body.userId).toBe(user.id); // user.id を使用します。
  });
});

describe("Order Controller - User Authentication", () => {
  test("POST /api/orders/ - Should fail if user is not authenticated", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        orderProducts: [
          {
            product,
            qty: 1,
          },
        ],
        address: "123 Test St",
        city: "Test City",
        postalCode: "12345",
        paymentMethod: "Test Payment Method",
        price: {
          itemsPrice: product.price,
          taxPrice: 0.1 * product.price,
          shippingPrice: 10,
          totalPrice: 1.1 * product.price + 10,
        },
      });
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Not authorized, no token");
  });

  test("GET /api/orders/mine - Should fail if user is not authenticated", async () => {
    const response = await request(app).get("/api/orders/mine");

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Not authorized, no token");
  });
});
