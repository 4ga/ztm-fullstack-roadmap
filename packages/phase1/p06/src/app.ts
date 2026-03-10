import express, { type ErrorRequestHandler } from "express";
import type { IdGenerator } from "./lib/id";
import { createTodoStore } from "./todos/todo.store";
import { createTodosRouter } from "./todos/todos.routes";

export interface CreateAppDeps {
  createId: IdGenerator;
}

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

export const createApp = ({ createId }: CreateAppDeps) => {
  const app = express();
  const store = createTodoStore();

  app.use(express.json());

  app.use("/todos", createTodosRouter({ store, createId }));

  app.use((_req, res) => {
    return res.status(404).json({ error: "Not Found" });
  });

  app.use(errorHandler);

  return app;
};
