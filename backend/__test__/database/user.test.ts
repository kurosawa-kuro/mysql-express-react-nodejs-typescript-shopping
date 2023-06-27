// backend\__test__\database\user.test.ts

import { Order, Product, User } from "@prisma/client";
import { db } from "../.././database/prisma/prismaClient";
import { clearDatabase } from ".././test-utils";
import { hashPassword } from "../.././utils";

describe("Database ", () => {
  beforeAll(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should connect to the database", async () => {
    await expect(db.$connect()).resolves.toBe(undefined);

    const user: User = await db.user.create({
      data: {
        name: "john",
        email: "john@email.com",
        password: await hashPassword("123456"),
        isAdmin: false,
      },
    });

    expect(user).toHaveProperty("name", "john");
    expect(user).toHaveProperty("email", "john@email.com");
    expect(user).toHaveProperty("isAdmin", false);

    const adminUser: User = await db.user.create({
      data: {
        name: "admin",
        email: "admin@email.com",
        password: await hashPassword("123456"),
        isAdmin: true,
      },
    });

    expect(adminUser).toHaveProperty("name", "admin");
    expect(adminUser).toHaveProperty("email", "admin@email.com");
    expect(adminUser).toHaveProperty("isAdmin", true);

    const product: Product = await db.product.create({
      data: {
        name: "Airpods Wireless Bluetooth Headphones",
        price: 100,
        user: { connect: { id: adminUser.id } },
        image: "/images/airpods.jpg",
        brand: "Apple",
        category: "Electronics",
        countInStock: 100, // Change to variable
        numReviews: 100, // Change to variable
        description: "aaaa", // Add variable
      },
    });

    expect(product).toHaveProperty(
      "name",
      "Airpods Wireless Bluetooth Headphones"
    );
    expect(product).toHaveProperty("price", 100);
    expect(product).toHaveProperty("userId", adminUser.id);

    const createdOrder: Order = await db.order.create({
      data: {
        userId: user.id,
        address: "123 Main Street",
        city: "Boston",
        postalCode: "12345",
        paymentMethod: "paymentMethod",
        itemsPrice: 100,
        taxPrice: 100,
        shippingPrice: 100,
        totalPrice: 100,
      },
    });

    expect(createdOrder).toHaveProperty("userId", user.id);
    expect(createdOrder).toHaveProperty("address", "123 Main Street");

    const orderProduct = await db.orderProduct.create({
      data: {
        orderId: createdOrder.id,
        productId: product.id,
        qty: 1,
      },
    });

    expect(orderProduct).toHaveProperty("orderId", createdOrder.id);
    expect(orderProduct).toHaveProperty("productId", product.id);
    expect(orderProduct).toHaveProperty("qty", 1);

    const orderProducts = await db.orderProduct.findMany({
      where: { orderId: createdOrder.id },
      include: {
        product: true,
        order: {
          include: {
            user: true,
          },
        },
      },
    });

    expect(orderProducts).toBeDefined();
    expect(orderProducts).toBeInstanceOf(Array);
    expect(orderProducts.length).toBeGreaterThan(0);
    orderProducts.forEach((orderProduct) => {
      expect(orderProduct).toHaveProperty("product");
      expect(orderProduct).toHaveProperty("order");
      expect(orderProduct.order).toHaveProperty("user");
    });
  });
});
