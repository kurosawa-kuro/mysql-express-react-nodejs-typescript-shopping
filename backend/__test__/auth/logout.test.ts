// backend\__test__\auth\logout.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import { clearDatabase, createUser, loginUserAndGetToken } from "../test-utils";

describe("POST /api/users/logout", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("logs out a user", async () => {
    // Create a user and log them in
    await createUser("john@email.com", "123456");
    const token = await loginUserAndGetToken(agent, "john@email.com", "123456");

    // Check that the JWT cookie has been set
    expect(token).toBeTruthy();

    const logoutResponse = await agent.post("/api/users/logout");

    expect(logoutResponse.status).toBe(200);

    // Check that the JWT cookie has been cleared
    expect(logoutResponse.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringMatching(/^jwt=;/)])
    );
  });
});
