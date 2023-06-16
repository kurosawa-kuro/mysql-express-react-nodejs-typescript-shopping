import request, { SuperAgentTest } from "supertest";
import path from "path";
import fs from "fs";
import { app } from "../../index";

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

describe("Product creation", () => {
  const agent = request.agent(app);
  let token: string;
  let imagePath: string;

  beforeAll(async () => {
    token = await loginUserAndGetToken(agent, "admin@email.com", "123456");
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
