import request from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  loginUserAndGetToken,
  createUserInDB,
  createProduct,
  createProductAndOrder,
} from "../test-utils";
import { Product, User } from "@prisma/client";
import { OrderInfo, OrderData } from "../../interfaces";

let token: string;
let user: User;
let order: any;

beforeAll(async () => {
  await clearDatabase();
  // create normal user
  user = await createUserInDB("testuser@example.com", "TestUserPassword123");

  const agent = request.agent(app);
  token = await loginUserAndGetToken(
    agent,
    "testuser@example.com",
    "TestUserPassword123"
  );
  order = await createProductAndOrder("testuser@example.com");
});

afterAll(async () => {
  await clearDatabase();
});

describe("Order Controller", () => {
  test("GET /api/orders/:id - Should get a order", async () => {
    const response = await request(app)
      .get("/api/orders/" + order.id)
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("orderProducts");
    expect(response.body).toHaveProperty("user");
    expect(response.body.status.isPaid).toBe(false);
  });
});
