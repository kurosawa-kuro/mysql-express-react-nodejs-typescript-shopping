// backend\__test__\user\userManagement.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUser,
  loginUserAndGetToken,
  createAdminUser,
} from "../test-utils";

// backend\__test__\user\userManagement.test.ts

// 他のインポートは省略します

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

  it("allows admin to update a user", async () => {
    // Create a user that the admin will update
    const user = await createUser("doe@email.com", "123456");

    const updateResponse = await agent
      .put(`/api/users/${user.id}`)
      .send({ name: "Updated User", email: "updated@email.com", isAdmin: true })
      .set("Cookie", `jwt=${adminToken}`);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toEqual("Updated User");
    expect(updateResponse.body.email).toEqual("updated@email.com");
    expect(updateResponse.body.isAdmin).toBe(true);
  });

  it("throws an error when user to be updated does not exist", async () => {
    const updateResponse = await agent
      .put(`/api/users/9999`)
      .send({ name: "Updated User", email: "updated@email.com", isAdmin: true })
      .set("Cookie", `jwt=${adminToken}`);

    expect(updateResponse.status).toBe(404);
  });
});
