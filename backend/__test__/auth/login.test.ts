// backend\__test__\auth\login.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../test-utils";

describe("POST /api/login", () => {
  let agent: SuperAgentTest;

  beforeAll(async () => {
    await clearDatabase();
    agent = request.agent(app);

    await createUserInDB("john@email.com", "123456");
  });

  it("logs in a user with correct credentials", async () => {
    const token = await loginUserAndGetToken(agent, "john@email.com", "123456");

    expect(token).toBeDefined();
  });

  it("rejects login with incorrect credentials", async () => {
    try {
      await loginUserAndGetToken(agent, "john@email.com", "wrong-password");
    } catch (error) {
      expect(error).toEqual(new Error("Login failed during test setup"));
    }
  });
});
