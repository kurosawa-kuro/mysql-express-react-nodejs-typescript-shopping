// backend\__test__\test-utils.ts

import { SuperAgentTest } from "supertest";
import fs from "fs";
import { db } from "../database/prisma/prismaClient";
import { User, Product, Order } from "@prisma/client";
import path from "path";
import { hashPassword } from "../utils";
import { OrderData } from "../interfaces";
import { createOrderInDB } from "../models/orderModel";

/**
 * Database Operations
 */
export const clearDatabase = async (): Promise<void> => {
  await db.orderProduct.deleteMany();
  await db.product.deleteMany();
  await db.order.deleteMany();
  await db.user.deleteMany();
};

export const ensureAdminExists = async (): Promise<User> => {
  const isAdmin = await db.user.findFirst({ where: { isAdmin: true } });
  if (isAdmin) {
    return isAdmin;
  }
  return await createUserWithRole("admine@mail.com", "adminpw", true);
};

export const createProduct = async (): Promise<Product> => {
  try {
    const admin = await ensureAdminExists();
    return await db.product.create({
      data: {
        userId: admin.id,
        name: "Test Product",
        price: 100,
        image: "sample path",
        brand: "Test Brand",
        category: "Test Category",
        countInStock: 10,
        numReviews: 0,
        description: "Test Description",
      },
    });
  } catch (error) {
    throw new Error(`An error occurred while creating the product: ${error}`);
  }
};
/**
 * User Operations
 */
const createUserWithRole = async (
  email: string,
  password: string,
  isAdmin: boolean
): Promise<User> => {
  const hashedPassword = await hashPassword(password);
  try {
    const user = await db.user.create({
      data: {
        name: isAdmin ? "Admin" : "Customer",
        email,
        password: hashedPassword,
        isAdmin,
      },
    });

    if (!user) {
      throw new Error(`Failed to create user with email ${email}`);
    }

    return user;
  } catch (error) {
    throw new Error(`An error occurred while creating the user: ${error}`);
  }
};

export const createUserInDB = (email: string, password: string) =>
  createUserWithRole(email, password, false);
export const createAdminUser = (email: string, password: string) =>
  createUserWithRole(email, password, true);

/**
 * Other Operations
 */
export const loginUserAndGetToken = async (
  agent: SuperAgentTest,
  email: string,
  password: string
): Promise<string> => {
  const loginResponse = await agent
    .post("/api/users/login")
    .send({ email, password });

  if (loginResponse.status !== 200) {
    throw new Error("Login failed during test setup");
  }

  const match = loginResponse.headers["set-cookie"][0].match(/jwt=([^;]+)/);
  if (!match) {
    throw new Error("Failed to extract token from cookie");
  }

  return match[1];
};

export const uploadImageAndGetPath = async (
  agent: SuperAgentTest,
  filePath: string
): Promise<string> => {
  const file = fs.createReadStream(filePath);
  const fileName = path.basename(filePath);
  const response = await agent
    .post("/api/upload")
    .attach("image", file, fileName);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    message: "Image uploaded successfully",
    image: expect.stringContaining("/frontend\\public\\images\\image-"),
  });

  return response.body.image;
};

export async function createProductAndOrder(userEmail: string) {
  const user = await db.user.findFirst({
    where: {
      email: userEmail,
    },
  });

  const product: Product = await createProduct();
  if (!user) {
    throw new Error(`No user found with email`);
  }
  const orderRequest: OrderData = {
    userId: Number(user.id),
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
      itemsPrice: product.price,
      taxPrice: 0.1 * product.price,
      shippingPrice: 10,
      totalPrice: 1.1 * product.price + 10,
    },
  };
  const { cart, ...orderData } = orderRequest;
  if (user) {
    const createdOrder = await createOrderInDB(orderRequest);
    return createdOrder;
  }
}
