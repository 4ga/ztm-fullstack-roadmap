import crypto from "node:crypto";
import express from "express";
import { logger as defaultLogger, type Logger } from "./lib/logger";
import {
  createRequestIdMiddleware,
  type CreateRequestId,
} from "./middleware/requestId";
import { createRequestLoggingMiddleware } from "./middleware/requestLogging";
import { testRouter } from "./routes/test-routes";
import { notFoundHandler } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";

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
  app.use(testRouter);

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
