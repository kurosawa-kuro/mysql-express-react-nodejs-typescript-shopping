import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import { clearDatabase, createUser, loginUserAndGetToken } from "../test-utils";

describe("GET /api/orders/mine", () => {
  let agent: SuperAgentTest;
  let token: string;

  beforeEach(async () => {
    agent = request.agent(app);

    await clearDatabase();

    const email = "testuser@example.com";
    const password = "testpassword";
    await createUser(email, password);

    token = await loginUserAndGetToken(agent, email, password);
  });

  it("should return the user's orders", async () => {
    const response = await agent
      .get("/api/orders/mine")
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(200);
    // Todo - check the response body
  });
});
