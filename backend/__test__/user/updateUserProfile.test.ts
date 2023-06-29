// backend\__test__\user\updateUserProfile.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../test-utils";

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
    await createUserInDB("john@email.com", "123456");
    const token = await loginUserAndGetToken(agent, "john@email.com", "123456");

    expect(token).toBeTruthy();

    const updateResponse = await agent
      .put("/api/users/profile")
      .set("Cookie", `jwt=${token}`)
      .send({ name: "john updated", email: "johnupdated@email.com" });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty("id");
    expect(updateResponse.body.email).toEqual("johnupdated@email.com");
    expect(updateResponse.body.name).toEqual("john updated");
  });

  it("rejects unauthenticated access", async () => {
    const updateResponse = await agent.put("/api/users/profile");

    expect(updateResponse.status).toBe(401);
  });

  it("updates a user profile even if email is missing", async () => {
    await createUserInDB("john@email.com", "123456");
    const token = await loginUserAndGetToken(agent, "john@email.com", "123456");

    expect(token).toBeTruthy();

    const updateResponse = await agent
      .put("/api/users/profile")
      .set("Cookie", `jwt=${token}`)
      .send({ name: "john updated" });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toEqual("john updated");
  });
});
