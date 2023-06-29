// backend\__test__\user\getProfile.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../test-utils";

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
    await createUserInDB("john@email.com", "123456");
    const token = await loginUserAndGetToken(agent, "john@email.com", "123456");

    expect(token).toBeTruthy();

    const profileResponse = await agent
      .get("/api/users/profile")
      .set("Cookie", `jwt=${token}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toHaveProperty("id");
    expect(profileResponse.body.email).toEqual("john@email.com");
  });

  it("rejects unauthenticated access", async () => {
    const profileResponse = await agent.get("/api/users/profile");

    expect(profileResponse.status).toBe(401);
  });
});
