// backend\__test__\user\updateUserProfile.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import { clearDatabase, createUser, loginUserAndGetToken } from "../test-utils";

describe("PUT /api/users/profile", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("updates a user profile", async () => {
    // Create a user and log them in
    await createUser("john@email.com", "123456");
    const token = await loginUserAndGetToken(agent, "john@email.com", "123456");

    // Check that the JWT cookie has been set
    expect(token).toBeTruthy();

    // Now, we update the user profile
    const updateResponse = await agent
      .put("/api/users/profile")
      .set("Cookie", `jwt=${token}`) // Set the Authorization header to the token
      .send({ name: "john updated", email: "johnupdated@email.com" });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty("id");
    expect(updateResponse.body.email).toEqual("johnupdated@email.com");
    expect(updateResponse.body.name).toEqual("john updated");
  });

  it("rejects unauthenticated access", async () => {
    // Try to update a user profile without being logged in
    const updateResponse = await agent.put("/api/users/profile");

    expect(updateResponse.status).toBe(401);
  });

  it("updates a user profile even if email is missing", async () => {
    // Create a user and log them in
    await createUser("john@email.com", "123456");
    const token = await loginUserAndGetToken(agent, "john@email.com", "123456");

    // Check that the JWT cookie has been set
    expect(token).toBeTruthy();

    // Try to update a user profile with missing user data
    const updateResponse = await agent
      .put("/api/users/profile")
      .set("Cookie", `jwt=${token}`) // Set the Authorization header to the token
      .send({ name: "john updated" }); // email is missing

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toEqual("john updated");
  });
});
