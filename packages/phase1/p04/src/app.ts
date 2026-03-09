import crypto from "node:crypto";
import express from "express";
import { logger as defaultLogger, type Logger } from "./lib/logger";
import {
  createRequestIdMiddleware,
  type CreateRequestId,
} from "./middleware/requestId";
import { createRequestLoggingMiddleware } from "./middleware/requestLogging";

type BuildAppOptions = {
  logger?: Logger;
  createRequestId?: CreateRequestId;
};

export function buildApp(options: BuildAppOptions = {}) {
  const app = express();

  const logger = options.logger ?? defaultLogger;
  const createRequestId =
    options.createRequestId ?? (() => crypto.randomUUID());

  app.use(express.json());
  app.use(createRequestIdMiddleware(createRequestId));
  app.use(createRequestLoggingMiddleware(logger));

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  return app;
}
