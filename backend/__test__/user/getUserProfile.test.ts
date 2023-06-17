// backend\__test__\user\getProfile.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import { clearDatabase, createUser, loginUserAndGetToken } from "../test-utils";

describe("GET /api/users/profile", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("gets a user profile", async () => {
    // Create a user and log them in
    await createUser("john@email.com", "123456");
    const token = await loginUserAndGetToken(agent, "john@email.com", "123456");

    // Check that the JWT cookie has been set
    expect(token).toBeTruthy();

    const profileResponse = await agent
      .get("/api/users/profile")
      .set("Cookie", `jwt=${token}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toHaveProperty("id");
    expect(profileResponse.body.email).toEqual("john@email.com");
  });

  it("rejects unauthenticated access", async () => {
    // Try to get a user profile without being logged in
    const profileResponse = await agent.get("/api/users/profile");

    expect(profileResponse.status).toBe(401);
  });
});
