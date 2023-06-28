import request from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  loginUserAndGetToken,
  createUser,
  createProduct,
  createProductAndOrder,
} from "../test-utils";
import { Product, User } from "@prisma/client";
import { OrderFull, OrderRequest } from "../../interfaces";

let token: string;
let product: Product;
let user: User;
let order: any;

beforeAll(async () => {
  await clearDatabase();
  // product = await createProduct();
  // create normal user
  user = await createUser("testuser@example.com", "TestUserPassword123");

  const agent = request.agent(app);
  token = await loginUserAndGetToken(
    agent,
    "testuser@example.com",
    "TestUserPassword123"
  );
  order = await createProductAndOrder(
    "testuser@example.com",
    "TestUserPassword123"
  );
  console.log(order);
});

afterAll(async () => {
  await clearDatabase();
});

describe("Order Controller", () => {
  test("GET /api/orders/:id - Should get a order", async () => {
    const orderRequest: OrderRequest = {
      cart: [
        {
          product,
          qty: 1,
        },
      ],
      shipping: {
        address: "123 Test St",
        city: "Test City",
        postalCode: "12345",
      },
      paymentMethod: "Test Payment Method",
      price: {
        itemsPrice: 10,
        taxPrice: 0.1 * 10,
        shippingPrice: 10,
        totalPrice: 1.1 * 10 + 10,
      },
    };

    const response = await request(app)
      .get("/api/orders/" + order.id)
      .set("Cookie", `jwt=${token}`)
      .send(orderRequest);

    console.log("response.body", response.body);

    expect(response.status).toBe(200);
  });
});
