// backend\__test__\test-utils.ts

import { SuperAgentTest } from "supertest";
import bcrypt from "bcryptjs";
import fs from "fs";
import { db } from "../database/prisma/prismaClient";

export const clearDatabase = async (): Promise<void> => {
  await db.product.deleteMany();
  await db.user.deleteMany();
};

export const createUser = async (
  email: string,
  password: string
): Promise<void> => {
  const hashedPassword = await bcrypt.hash(password, 10);
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
): Promise<void> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.create({
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
  filePath: string,
  fileName: string
): Promise<string> => {
  const file = fs.createReadStream(filePath);
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
