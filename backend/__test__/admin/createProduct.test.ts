import request from "supertest";
import path from "path";
import { app } from "../../index";
import {
  createAdminUser,
  loginUserAndGetToken,
  uploadImageAndGetPath,
  clearDatabase,
} from "../test-utils";

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
      path.join(__dirname, "../../test-files/test-image.jpg")
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
