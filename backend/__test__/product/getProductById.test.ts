import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createProduct,
  createAdminUser,
  loginUserAndGetToken,
} from "../test-utils";

let agent: SuperAgentTest;
let product: any;

async function setup() {
  await clearDatabase();
  agent = request.agent(app);

  const adminUser = await createAdminUser("admin@test.com", "password123");
  await loginUserAndGetToken(agent, "admin@test.com", "password123");

  product = await createProduct();
}

describe("GET /api/products/:id", () => {
  beforeEach(setup);

  it("should return a product by id", async () => {
    const response = await agent.get(`/api/products/${product.id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test Product");
    expect(response.body.price).toBe(100);
    expect(response.body.brand).toBe("Test Brand");
    expect(response.body.category).toBe("Test Category");
    expect(response.body.countInStock).toBe(10);
    expect(response.body.numReviews).toBe(0);
    expect(response.body.description).toBe("Test Description");
  });

  it("should return 404 for non-existing product id", async () => {
    const response = await agent.get("/api/products/9999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Resource not found");
  });
});
