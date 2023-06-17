// backend\__test__\user\getUserById.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUser,
  loginUserAndGetToken,
  createAdminUser,
} from "../test-utils";

describe("User management endpoints", () => {
  let agent: SuperAgentTest;
  let adminToken: string;
  let admin: any;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);

    // Create an admin user and log them in
    admin = await createAdminUser("admin@email.com", "123456");
    adminToken = await loginUserAndGetToken(agent, "admin@email.com", "123456");
  });

  afterEach(async () => {
    await clearDatabase();
  });

  // 他のテストケースは省略します

  it("allows admin to retrieve a user by ID", async () => {
    // Create a user that the admin will retrieve
    const user = await createUser("doe@email.com", "123456");

    const getResponse = await agent
      .get(`/api/users/${user.id}`)
      .set("Cookie", `jwt=${adminToken}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.email).toEqual(user.email);
  });

  it("throws an error when user to be retrieved does not exist", async () => {
    const getResponse = await agent
      .get(`/api/users/9999`)
      .set("Cookie", `jwt=${adminToken}`);

    expect(getResponse.status).toBe(404);
  });
});
