// backend\__test__\test-utils.ts

import { SuperAgentTest } from "supertest";
import bcrypt from "bcryptjs";
import fs from "fs";
import { db } from "../database/prisma/prismaClient";
import { User, Product } from "@prisma/client";
import path from "path";
import { hashPassword } from "../utils";

export const clearDatabase = async (): Promise<void> => {
  await db.product.deleteMany();
  await db.user.deleteMany();
};

export const createUser = async (
  email: string,
  password: string
): Promise<void> => {
  const hashedPassword = await hashPassword(password);
  await db.user.create({
    data: {
      name: "Customer",
      email,
      password: hashedPassword,
      isAdmin: false,
    },
  });
};

export const createAdminUser = async (
  email: string,
  password: string
): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await db.user.create({
    data: {
      name: "Admin",
      email,
      password: hashedPassword,
      isAdmin: true,
    },
  });
};

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
  const fileName = path.basename(filePath); // Extract the file name from the path
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

export const createProduct = async (userId: number): Promise<Product> => {
  return await db.product.create({
    data: {
      userId, // add the userId to the data
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
