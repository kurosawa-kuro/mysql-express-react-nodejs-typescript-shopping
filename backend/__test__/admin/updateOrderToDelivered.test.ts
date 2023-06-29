// backend\__test__\orderController.test.ts
import request from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createAdminUser,
  loginUserAndGetToken,
  createProduct,
  createUserInDB,
  createProductAndOrder,
} from "../test-utils";
import { db } from "../../database/prisma/prismaClient";
import { User } from "@prisma/client";

describe("Order Controller", () => {
  let token: string;
  let order: any;
  let user: User;

  beforeAll(async () => {
    await clearDatabase();
    user = await createUserInDB("testuser@example.com", "TestUserPassword123");
    order = await createProductAndOrder("testuser@example.com");

    const adminUser = await createAdminUser("admin@test.com", "admin123");
    token = await loginUserAndGetToken(
      request.agent(app),
      adminUser.email,
      "admin123"
    );
  });

  afterAll(async () => {
    await clearDatabase();
  });

  test("updateOrderToDelivered", async () => {
    const updateResponse = await request(app)
      .put(`/api/orders/${order.id}/deliver`)
      .set("Cookie", `jwt=${token}`)
      .send({
        id: order.id,
        isDelivered: true,
        deliveredAt: new Date().toISOString(),
        payer: {
          email_address: "payer@test.com",
        },
      });

    expect(updateResponse.status).toBe(200);

    const updatedOrder = await db.order.findUnique({
      where: { id: order.id },
    });

    expect(updatedOrder?.isDelivered).toBe(true);
    expect(updatedOrder?.deliveredAt).not.toBeNull();
  });
});
