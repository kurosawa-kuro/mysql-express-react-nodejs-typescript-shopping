// backend\__test__\user\userManagement.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUser,
  loginUserAndGetToken,
  createAdminUser,
} from "../test-utils";
import { db } from "../../database/prisma/prismaClient";

describe("User management endpoints", () => {
  let agent: SuperAgentTest;
  let adminToken: string;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);

    // Create an admin user and log them in
    const admin = await createAdminUser("admin@email.com", "123456");
    adminToken = await loginUserAndGetToken(agent, "admin@email.com", "123456");
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("allows admin to delete a user", async () => {
    // Create a user that the admin will delete
    await createUser("doe@email.com", "123456");

    // Get the user that was just created
    const user = await db.user.findUnique({
      where: { email: "doe@email.com" },
    });

    const deleteResponse = await agent
      .delete(`/api/users/${user?.id}`)
      .set("Cookie", `jwt=${adminToken}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({ message: "User removed" });
  });

  it("prevents deleting an admin user", async () => {
    // Get the admin user that was just created
    const adminUser = await db.user.findUnique({
      where: { email: "admin@email.com" },
    });

    const deleteResponse = await agent
      .delete(`/api/users/${adminUser?.id}`)
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
