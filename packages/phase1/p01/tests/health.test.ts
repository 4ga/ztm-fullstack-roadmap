import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../src/app";

describe("P01 Healthcheck API", () => {
  it("GET /health return 200 {status: ok}", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
  });

  it("unknown routes return 404 {error: Not Found}", async () => {
    const res = await request(app).get("/unknown");
    expect(res.status).toBe(404);
  });
});
