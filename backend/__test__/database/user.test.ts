// backend\test\app.test.ts

// import request from "supertest";
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
    console.log({ user });

    const adminUser: User = await db.user.create({
      data: {
        name: "admin",
        email: "admin@email.com",
        password: await hashPassword("123456"),
        isAdmin: true,
      },
    });
    console.log({ adminUser });

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
    console.log({ product });

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
    console.log({ createdOrder });

    const orderProduct = await db.orderProduct.create({
      data: {
        orderId: createdOrder.id,
        productId: product.id,
        qty: 1,
      },
    });
    console.log({ orderProduct });

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
    // console.dir(orderProducts, { depth: null });
  });
});
