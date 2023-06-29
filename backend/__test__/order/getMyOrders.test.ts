import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createProductAndOrder,
  createUserInDB,
  loginUserAndGetToken,
} from "../test-utils";

describe("GET /api/orders/mine", () => {
  let agent: SuperAgentTest;
  let token: string;
  let order: any;

  beforeEach(async () => {
    agent = request.agent(app);

    await clearDatabase();

    const email = "testuser@example.com";
    const password = "testpassword";
    await createUserInDB(email, password);

    token = await loginUserAndGetToken(agent, email, password);
    order = await createProductAndOrder("testuser@example.com");
    await createProductAndOrder("testuser@example.com");
  });

  it("should return the user's orders", async () => {
    const response = await agent
      .get("/api/orders/mine")
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});
