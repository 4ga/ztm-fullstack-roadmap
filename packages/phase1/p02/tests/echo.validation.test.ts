import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";

describe("PO2 Validation API", () => {
  it("valid request -> 200", async () => {
    const res = await request(app).post("/echo").send({ message: "hello" });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("application/json");
    expect(res.body).toEqual({ message: "hello" });
  });

  it("invalid request -> 400", async () => {
    const res = await request(app).post("/echo").send({ message: "" }); // min 1 should fail

    expect(res.status).toBe(400);
    expect(res.headers["content-type"]).toContain("application/json");
    expect(res.body).toEqual({ error: "Bad Request" });
  });

  it("unknown route -> 404", async () => {
    const res = await request(app).get("/__nope__");

    expect(res.status).toBe(404);
    expect(res.headers["content-type"]).toContain("application/json");
    expect(res.body).toEqual({ error: "Not Found" });
  });
});
