// backend\__test__\orderController.test.ts
import request from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createAdminUser,
  loginUserAndGetToken,
  createProduct,
} from "../test-utils";
import { db } from "../../database/prisma/prismaClient";

describe("Order Controller", () => {
  let token: string;
  let product: any;

  beforeAll(async () => {
    await clearDatabase();
    const adminUser = await createAdminUser("admin@test.com", "admin123");
    token = await loginUserAndGetToken(
      request.agent(app),
      adminUser.email,
      "admin123"
    );
    product = await createProduct(adminUser.id);
  });

  afterAll(async () => {
    await clearDatabase();
  });

  test("updateOrderToPaid", async () => {
    // Create a new order
    const orderResponse = await request(app)
      .post("/api/orders")
      .set("Cookie", `jwt=${token}`)
      .send({
        orderProducts: [
          {
            product: product,
            qty: 1,
          },
        ],
        address: "Test Address",
        city: "Test City",
        postalCode: "Test PostalCode",
        paymentMethod: "Test PaymentMethod",
        price: {
          itemsPrice: product.price,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: product.price,
        },
      });

    expect(orderResponse.status).toBe(201);

    // Update order to delivered
    const updateResponse = await request(app)
      .put(`/api/orders/${orderResponse.body.id}/deliver`)
      .set("Cookie", `jwt=${token}`)
      .send({
        id: orderResponse.body.id,
        isDelivered: true,
        deliveredAt: new Date().toISOString(),
        payer: {
          email_address: "payer@test.com",
        },
      });

    expect(updateResponse.status).toBe(200);

    // Confirm order is marked as paid
    const updatedOrder = await db.order.findUnique({
      where: { id: orderResponse.body.id },
    });

    expect(updatedOrder?.isDelivered).toBe(true);
    expect(updatedOrder?.deliveredAt).not.toBeNull();
  });
});
