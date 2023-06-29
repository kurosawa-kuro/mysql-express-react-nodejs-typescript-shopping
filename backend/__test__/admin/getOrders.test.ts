import request from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createAdminUser,
  loginUserAndGetToken,
  createProductAndOrder,
  createUserInDB,
} from "../test-utils";
import { db } from "../../database/prisma/prismaClient";
import { OrderInfo } from "../../interfaces";
import { OrderProduct } from "@prisma/client";

describe("GET /api/orders", () => {
  let token: string;
  const adminEmail = `admin@test.com`;

  beforeAll(async () => {
    await clearDatabase();
    await createUserInDB(`user@test.com`, "123456");
    await createAdminUser(adminEmail, "123456");
    const agent = request.agent(app);
    token = await loginUserAndGetToken(agent, adminEmail, "123456");

    await createProductAndOrder(`user@test.com`);
  });

  afterAll(async () => {
    await clearDatabase();
    await db.$disconnect();
  });

  it("should return 200 and all orders for admin users", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Cookie", `jwt=${token}`);

    expect(res.status).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);

    res.body.forEach((order: OrderInfo) => {
      expect(order).toHaveProperty("id");
      expect(order).toHaveProperty("user.id");
      expect(order).toHaveProperty("shipping.address");
      expect(order).toHaveProperty("shipping.city");
      expect(order).toHaveProperty("shipping.postalCode");
      expect(order).toHaveProperty("paymentMethod");
      expect(order).toHaveProperty("price.itemsPrice");
      expect(order).toHaveProperty("price.shippingPrice");
      expect(order).toHaveProperty("price.taxPrice");
      expect(order).toHaveProperty("price.totalPrice");
      expect(order).toHaveProperty("status.isPaid");
      expect(order).toHaveProperty("status.paidAt");
      expect(order).toHaveProperty("status.isDelivered");
      expect(order).toHaveProperty("status.deliveredAt");
      expect(order).toHaveProperty("createdAt");
      expect(order).toHaveProperty("orderProducts");
      order.orderProducts.forEach((orderProduct: OrderProduct) => {
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
