import request from "supertest";
import path from "path";
import fs from "fs";
import { app } from "../index";

describe("POST /api/upload", () => {
  it("uploads an image file", async () => {
    const filePath = path.join(__dirname, "../test-files/test-image.jpg");
    const file = fs.createReadStream(filePath);

    const response = await request(app)
      .post("/api/upload")
      .attach("image", file, "test-image.jpg");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Image uploaded successfully",
      image: expect.stringContaining("/frontend\\public\\images\\image-"),
    });
  });
});
