// backend/__test__/productRoutes.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  loginUserAndGetToken,
  createAdminUser,
  createProduct,
} from "../test-utils";

describe("GET /api/products", () => {
  beforeAll(clearDatabase);

  test("should return a list of products", async () => {
    const admin = await createAdminUser("admin@test.com", "password");
    const token = await loginUserAndGetToken(
      request.agent(app),
      "admin@test.com",
      "password"
    );

    await createProduct();

    const response = await request(app)
      .get("/api/products")
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.products).toHaveLength(1);
    expect(response.body.products[0]).toHaveProperty("name", "Test Product");
    expect(response.body.products[0]).toHaveProperty("price", 100);
    expect(response.body.products[0]).toHaveProperty("brand", "Test Brand");
  });
});
