import request, { SuperAgentTest } from "supertest";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { app } from "../../index";
import { db } from "../../database/prisma/prismaClient";

const createAdminUser = async (
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

const loginUserAndGetToken = async (
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

const uploadImageAndGetPath = async (
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

const clearDatabase = async (): Promise<void> => {
  await db.product.deleteMany();
  await db.user.deleteMany();
};

describe("Product creation", () => {
  const agent = request.agent(app);
  let token: string;
  let imagePath: string;

  beforeAll(async () => {
    await clearDatabase();

    const email = `admin@email.com`;
    const password = "123456";

    await createAdminUser(email, password);

    token = await loginUserAndGetToken(agent, email, password);
    imagePath = await uploadImageAndGetPath(
      agent,
      path.join(__dirname, "../../test-files/test-image.jpg"),
      "test-image.jpg"
    );
  });

  it("creates a product", async () => {
    const response = await agent
      .post("/api/products")
      .set("Cookie", `jwt=${token}`)
      .send({
        name: "Test Product",
        price: 100,
        image: imagePath,
        brand: "Test Brand",
        category: "Test Category",
        countInStock: 10,
        numReviews: 0,
        description: "Test Description",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });
});
