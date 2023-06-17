// backend\test\app.test.ts

// import request from "supertest";
import { User } from "@prisma/client";
import { db } from "../.././database/prisma/prismaClient";
import { clearDatabase } from ".././test-utils";
import { hashPassword } from "../.././utils";

describe("Database Connection", () => {
  beforeAll(async () => {
    await clearDatabase(); // Clear the database
  });

  afterEach(async () => {
    await clearDatabase(); // Clear the database
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should connect to the database", async () => {
    await expect(db.$connect()).resolves.toBe(undefined);

    const user: User = await db.user.create({
      data: {
        name: "Test User",
        email: " ",
        password: await hashPassword("TestUserPassword123"),
        isAdmin: false,
      },
    });
    console.log({ user });
  });
});
