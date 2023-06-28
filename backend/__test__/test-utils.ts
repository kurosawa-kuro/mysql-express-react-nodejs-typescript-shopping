// backend\__test__\test-utils.ts

import { SuperAgentTest } from "supertest";
import fs from "fs";
import { db } from "../database/prisma/prismaClient";
import { User, Product, Order } from "@prisma/client";
import path from "path";
import { hashPassword } from "../utils";
import { OrderRequest } from "../interfaces";
import { createOrder } from "../models/orderModel";

/**
 * Database Operations
 */
export const clearDatabase = async (): Promise<void> => {
  await db.orderProduct.deleteMany();
  await db.product.deleteMany();
  await db.order.deleteMany();
  await db.user.deleteMany();
};

export const createProduct = async (): Promise<Product> => {
  try {
    // Adminが居るかを確認する
    const isAdmin = await db.user.findFirst({
      where: {
        isAdmin: true,
      },
    });
    // Adminがなければ作る
    let admin;
    if (!isAdmin) {
      admin = await createUserWithRole("admine@mail.com", "adminpw", true);
    } else {
      admin = isAdmin;
    }

    const product = await db.product.create({
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

    return product;
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

export const createUser = (email: string, password: string) =>
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
  const orderRequest: OrderRequest = {
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
    const createdOrder = await createOrder(Number(user.id), orderData, cart);
    return createdOrder;
  }
}
