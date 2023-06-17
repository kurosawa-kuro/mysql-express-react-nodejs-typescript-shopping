import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createAdminUser,
  loginUserAndGetToken,
  createProduct, // import createProduct function
} from "../test-utils";
import { Product } from "@prisma/client";

describe("DELETE /api/products/:id", () => {
  let agent: SuperAgentTest;
  let token: string;
  let userId: number;
  let product: Product; // declare product in this scope

  beforeEach(async () => {
    // Clear database and setup new agent and user before each test
    await clearDatabase();

    agent = request.agent(app);

    // Create an admin user in the system
    const adminUser = await createAdminUser("admin@email.com", "123456");
    userId = adminUser.id;

    // Login as the admin user and get the token
    token = await loginUserAndGetToken(agent, "admin@email.com", "123456");

    product = await createProduct(userId); // use createProduct function
  });

  it("deletes a product when admin is logged in", async () => {
    const id = product.id;
    const response = await agent
      .delete(`/api/products/${id}`)
      .set("Cookie", `jwt=${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Product removed" });
  });
});
