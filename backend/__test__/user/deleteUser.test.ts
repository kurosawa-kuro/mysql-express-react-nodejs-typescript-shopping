// backend\__test__\user\userManagement.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserAndRetrieve,
  loginUserAndGetToken,
  createAdminUserAndRetrieve,
} from "../test-utils";

describe("User management endpoints", () => {
  let agent: SuperAgentTest;
  let adminToken: string;
  let admin: any;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);

    // Create an admin user and log them in
    admin = await createAdminUserAndRetrieve("admin@email.com", "123456");
    adminToken = await loginUserAndGetToken(agent, "admin@email.com", "123456");
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("allows admin to delete a user", async () => {
    // Create a user that the admin will delete
    const user = await createUserAndRetrieve("doe@email.com", "123456");

    const deleteResponse = await agent
      .delete(`/api/users/${user.id}`)
      .set("Cookie", `jwt=${adminToken}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({ message: "User removed" });
  });

  it("prevents deleting an admin user", async () => {
    const deleteResponse = await agent
      .delete(`/api/users/${admin.id}`)
      .set("Cookie", `jwt=${adminToken}`);

    expect(deleteResponse.status).toBe(400);
  });

  it("throws an error when user to be deleted does not exist", async () => {
    const deleteResponse = await agent
      .delete(`/api/users/9999`)
      .set("Cookie", `jwt=${adminToken}`);

    expect(deleteResponse.status).toBe(404);
  });
});
