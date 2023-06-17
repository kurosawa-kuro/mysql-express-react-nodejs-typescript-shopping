// backend\__test__\productController.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  loginUserAndGetToken,
  createAdminUser,
  createProduct,
} from "../test-utils";

describe("GET /api/products/top", () => {
  beforeAll(async () => {
    await clearDatabase();
    const admin = await createAdminUser("admin@test.com", "test1234");
    const token = await loginUserAndGetToken(
      request.agent(app),
      "admin@test.com",
      "test1234"
    );

    await Promise.all([
      createProduct(admin.id), // creates a product with rating 5
      createProduct(admin.id), // creates a product with rating 4
      createProduct(admin.id), // creates a product with rating 3
    ]);
  });

  it("should return top 3 products sorted by rating in descending order", async () => {
    const response = await request(app).get("/api/products/top");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
  });
});
