// External Imports
import express from "express";
import request from "supertest";
import { notFound, errorHandler } from "../middleware/errorMiddleware";

describe("Error Middlewares", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/test", (req, res) => {
      res.json({ message: "Test route" });
    });
    app.use(notFound);
    app.use(errorHandler);
  });

  it("should return 404 error for not found route", async () => {
    const res = await request(app).get("/non-existing-route");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "Not Found - /non-existing-route",
      stack: expect.any(String),
    });
  });
});
