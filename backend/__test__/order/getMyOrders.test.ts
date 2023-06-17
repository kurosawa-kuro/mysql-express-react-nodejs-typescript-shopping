import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import { clearDatabase, createUser, loginUserAndGetToken } from "../test-utils";

describe("GET /api/orders/mine", () => {
  let agent: SuperAgentTest;
  let token: string;

  beforeEach(async () => {
    // Initialize the supertest agent
    agent = request.agent(app);

    // Clear the database
    await clearDatabase();

    // Create a user
    const email = "testuser@example.com";
    const password = "testpassword";
    await createUser(email, password);

    // Login as the user and get the token
    token = await loginUserAndGetToken(agent, email, password);
  });

  it("should return the user's orders", async () => {
    const response = await agent
      .get("/api/orders/mine")
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(200);
    // 他の適切なアサーションをここに追加します
  });
});
