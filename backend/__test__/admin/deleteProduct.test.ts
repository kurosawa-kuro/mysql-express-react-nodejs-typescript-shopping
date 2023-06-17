import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createAdminUser,
  loginUserAndGetToken,
} from "../test-utils";
import { db } from "../../database/prisma/prismaClient";

describe("DELETE /api/products/:id", () => {
  let agent: SuperAgentTest;
  let token: string;
  let userId: number;

  beforeEach(async () => {
    // Clear database and setup new agent and user before each test
    await clearDatabase();

    agent = request.agent(app);

    // Create an admin user in the system
    const adminUser = await createAdminUser("admin@email.com", "123456");
    userId = adminUser.id;

    // Login as the admin user and get the token
    token = await loginUserAndGetToken(agent, "admin@email.com", "123456");

    // create a product by prisma
    await db.product.create({
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
  });

  it("deletes a product when admin is logged in", async () => {
    const id = 11;
    const response = await agent
      .delete(`/api/products/${id}`)
      .set("Cookie", `jwt=${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Product removed" });
  });
});
