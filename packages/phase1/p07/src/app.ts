import crypto from "node:crypto";
import express, { type ErrorRequestHandler } from "express";

import { logger as defaultLogger, type Logger } from "./lib/logger";
import {
  createRequestIdMiddleware,
  type CreateRequestId,
} from "./middleware/requestId";
import { createRequestLoggingMiddleware } from "./middleware/requestLogging";

import type { TodosRepository } from "./repositories/todos-repository"; // <-- adjust path/name
import { createTodosRouter } from "./routes/todos.routes";

type BuildAppOptions = {
  // REQUIRED: app can’t work without persistence layer
  todosRepository: TodosRepository;
  // Deterministic/test-friendly deps
  createTodoId?: () => string;
  now?: () => string;

  // Platform concerns
  logger?: Logger;
  createRequestId?: CreateRequestId;
};

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status =
    typeof err === "object" && err !== null && "status" in err
      ? (err as { status?: number }).status
      : undefined;

  if (err instanceof SyntaxError && status === 400) {
    return res.status(400).json({ error: "Bad Request" });
  }

  return res.status(500).json({ error: "Internal Server Error" });
};

export function buildApp(options: BuildAppOptions) {
  const app = express();

  const logger = options.logger ?? defaultLogger;
  const createRequestId =
    options.createRequestId ?? (() => crypto.randomUUID());

  const createTodoId = options.createTodoId ?? (() => crypto.randomUUID());
  const now = options.now ?? (() => new Date().toISOString());

  app.use(express.json());
  app.use(createRequestIdMiddleware(createRequestId));
  app.use(createRequestLoggingMiddleware(logger));

  app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

  app.use(
    createTodosRouter({
      todosRepository: options.todosRepository,
      createTodoId,
      now,
    }),
  );
  

  app.use((_req, res) => res.status(404).json({ error: "Not Found" }));
  app.use(errorHandler);

  return app;
}
