// backend\__test__\test-utils.ts

import { SuperAgentTest } from "supertest";
import fs from "fs";
import { db } from "../database/prisma/prismaClient";
import { User, Product } from "@prisma/client";
import path from "path";
import { hashPassword } from "../utils";

/**
 * Database Operations
 */
export const clearDatabase = async (): Promise<void> => {
  await db.orderProduct.deleteMany();
  await db.product.deleteMany();
  await db.order.deleteMany();
  await db.user.deleteMany();
};

export const createProduct = async (userId: number): Promise<Product> => {
  return await db.product.create({
    data: {
      userId,
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
  return await db.user.create({
    data: {
      name: isAdmin ? "Admin" : "Customer",
      email,
      password: hashedPassword,
      isAdmin,
    },
  });
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
