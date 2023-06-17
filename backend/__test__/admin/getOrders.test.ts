import request from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createAdminUser,
  loginUserAndGetToken,
  createProductAndOrder,
} from "../test-utils";
import { db } from "../../database/prisma/prismaClient";
import { CartProduct, OrderFull } from "../../interfaces";

describe("GET /api/orders", () => {
  let token: string;
  const adminEmail = `admin@test.com`;

  beforeAll(async () => {
    await clearDatabase();
    await createAdminUser(adminEmail, "123456");
    const agent = request.agent(app);
    token = await loginUserAndGetToken(agent, adminEmail, "123456"); // Use the same email

    // Create product and order with a unique email
    await createProductAndOrder(`user@test.com`, "123456");
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
    res.body.forEach((order: OrderFull) => {
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
      expect(order).toHaveProperty("orderProducts");
      order.orderProducts.forEach((orderProduct: CartProduct) => {
        expect(orderProduct).toHaveProperty("orderId");
        expect(orderProduct).toHaveProperty("productId");
        expect(orderProduct).toHaveProperty("qty");
        expect(orderProduct).toHaveProperty("product.id");
        expect(orderProduct).toHaveProperty("product.name");
        expect(orderProduct).toHaveProperty("product.image");
        expect(orderProduct).toHaveProperty("product.brand");
      });
    });
  });
});
