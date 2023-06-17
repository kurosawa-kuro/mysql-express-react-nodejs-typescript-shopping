import request from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createAdminUser,
  createUser,
  loginUserAndGetToken,
} from "../test-utils";
import { db } from "../../database/prisma/prismaClient";
import { Order } from "@prisma/client";
import { CartProduct, OrderFull } from "../../interfaces";
// import { Order } from "../../interfaces";

describe("GET /api/orders", () => {
  let token: string;

  beforeAll(async () => {
    await clearDatabase();
    const user = await createUser("user@test.com", "123456");
    const adminUser = await createAdminUser("admin@test.com", "123456");
    const agent = request.agent(app);
    token = await loginUserAndGetToken(agent, "admin@test.com", "123456");

    // create order by admin user by prisma client
    const createdOrder: Order = await db.order.create({
      data: {
        userId: Number(user.id),
        address: "123 Test St",
        city: "Test City",
        postalCode: "12345",
        paymentMethod: "test paymentMethod",
        itemsPrice: 100,
        taxPrice: 100,
        shippingPrice: 100,
        totalPrice: 100,
      },
    });
    // console.log({ createdOrder });

    // create a product in the database
    const product = await db.product.create({
      data: {
        userId: Number(user.id),
        name: "Test Product",
        image: "sample path",
        brand: "Test Brand",
        category: "Test Category",
        description: "Test Description",
        rating: 0,
        numReviews: 0,
        price: 100,
        countInStock: 10,
      },
    });

    await db.orderProduct.create({
      data: {
        orderId: createdOrder.id,
        productId: product.id,
        qty: 1,
      },
    });

    // select from orderProduct by prisma client
    const orderProducts = await db.orderProduct.findMany({
      where: {
        orderId: createdOrder.id,
      },
      include: {
        product: true,
      },
    });
    console.dir(orderProducts, { depth: null });
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
    // console.log("res.body", res.body);

    // Check that the response body is an array
    expect(Array.isArray(res.body)).toBe(true);

    // Check that each item in the array has the expected properties
    res.body.forEach((order: OrderFull) => {
      console.dir(order, { depth: null });
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
