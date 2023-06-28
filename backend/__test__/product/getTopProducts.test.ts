// backend\__test__\productController.test.ts

import request from "supertest";
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

    await Promise.all([createProduct(), createProduct(), createProduct()]);
  });

  it("should return top 3 products sorted by rating in descending order", async () => {
    const response = await request(app).get("/api/products/top");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
  });
});
