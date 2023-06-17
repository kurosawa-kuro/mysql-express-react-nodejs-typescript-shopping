import request from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createAdminUser,
  loginUserAndGetToken,
} from "../test-utils";
import { db } from "../../database/prisma/prismaClient";

describe("GET /api/orders", () => {
  let token: string;

  beforeAll(async () => {
    await clearDatabase();
    const adminUser = await createAdminUser("admin@test.com", "123456");
    const agent = request.agent(app);
    token = await loginUserAndGetToken(agent, "admin@test.com", "123456");
  });

  afterAll(async () => {
    await clearDatabase();
    await db.$disconnect();
  });

  it("should return 200 and all orders for admin users", async () => {
    // Make GET request to /api/orders endpoint
    const res = await request(app)
      .get("/api/orders")
      .set("Cookie", `jwt=${token}`);

    // Check that the response status was 200
    expect(res.status).toBe(200);

    // Check that the response body is an array
    expect(Array.isArray(res.body)).toBe(true);

    // Check that each item in the array has the expected properties
    res.body.forEach((order: any) => {
      expect(order).toHaveProperty("id");
      expect(order).toHaveProperty("userId");
      expect(order).toHaveProperty("address");
      expect(order).toHaveProperty("city");
      expect(order).toHaveProperty("postalCode");
      expect(order).toHaveProperty("paymentMethod");
      expect(order).toHaveProperty("itemsPrice");
      expect(order).toHaveProperty("shippingPrice");
      expect(order).toHaveProperty("taxPrice");
      expect(order).toHaveProperty("totalPrice");
      expect(order).toHaveProperty("isPaid");
      expect(order).toHaveProperty("paidAt");
      expect(order).toHaveProperty("isDelivered");
      expect(order).toHaveProperty("deliveredAt");
      expect(order).toHaveProperty("createdAt");
    });
  });
});
