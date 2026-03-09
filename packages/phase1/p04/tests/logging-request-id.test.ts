import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { buildApp } from "../src/app";

describe("P04 Logging + Request-ID", () => {
  it("reuses client-provided x-request-id and includes it in the response + logs", async () => {
    const logger = {
      info: vi.fn(),
      error: vi.fn(),
    };

    const app = buildApp({
      logger,
      createRequestId: () => "generated-test-id",
    });

    const response = await request(app)
      .get("/health")
      .set("x-request-id", "test-id");

    expect(response.status).toBe(200);
    expect(response.headers["x-request-id"]).toBe("test-id");

    expect(logger.info).toHaveBeenCalledTimes(1);

    const logArg = logger.info.mock.calls[0][0];

    expect(logArg).toMatchObject({
      requestId: "test-id",
      method: "GET",
      path: "/health",
      status: 200,
    });

    expect(logArg).toHaveProperty("durationMs");
    expect(typeof logArg.durationMs).toBe("number");
  });

  it("generates a request id when header is missing and returns it in the response + logs", async () => {
    const logger = {
      info: vi.fn(),
      error: vi.fn(),
    };

    const app = buildApp({
      logger,
      createRequestId: () => "fixed-generated-id",
    });

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.headers["x-request-id"]).toBe("fixed-generated-id");

    expect(logger.info).toHaveBeenCalledTimes(1);

    const logArg = logger.info.mock.calls[0][0];

    expect(logArg).toMatchObject({
      requestId: "fixed-generated-id",
      method: "GET",
      path: "/health",
      status: 200,
    });

    expect(logArg).toHaveProperty("durationMs");
  });

  it("returns 404 JSON for unknown routes and still logs with request id", async () => {
    const logger = {
      info: vi.fn(),
      error: vi.fn(),
    };

    const app = buildApp({
      logger,
      createRequestId: () => "generated-test-id",
    });

    const response = await request(app)
      .get("/does-not-exist")
      .set("x-request-id", "test-id");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Not Found" });
    expect(response.headers["x-request-id"]).toBe("test-id");

    expect(logger.info).toHaveBeenCalledTimes(1);

    const logArg = logger.info.mock.calls[0][0];

    expect(logArg).toMatchObject({
      requestId: "test-id",
      method: "GET",
      path: "/does-not-exist",
      status: 404,
    });

    expect(logArg).toHaveProperty("durationMs");
  });

  it("logs req.path without query params", async () => {
    const logger = {
      info: vi.fn(),
      error: vi.fn(),
    };

    const app = buildApp({
      logger,
      createRequestId: () => "fixed-id",
    });

    const response = await request(app).get("/health?token=secret-value");

    expect(response.status).toBe(200);

    const logArg = logger.info.mock.calls[0][0];

    expect(logArg).toMatchObject({
      requestId: "fixed-id",
      method: "GET",
      path: "/health",
      status: 200,
    });

    expect(logArg.path).not.toContain("token=");
  });
});
