import request from "supertest";
import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app";

const app = buildApp();

describe("global error handler", () => {
  it("return 500 for a thrown error", async () => {
    const res = await request(app).get("/test/throw");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal Server Error" });

    expect(res.headers["x-request-id"]).toBeTruthy();
  });

  it("returns 404 for an unknown route", async () => {
    const res = await request(app).get("/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not Found" });
  });

  it("returns 400 for a known bad request error", async () => {
    const res = await request(app).get("/test/bad-request");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Bad Request" });
  });
});
