// src/routes/todos-routes.ts
import { Router } from "express";
import { z } from "zod";
import type { TodosRepository } from "../repositories/todos-repository";

type CreateTodosRouterOptions = {
  todosRepository: TodosRepository;
  createTodoId: () => string;
  now: () => string;
};

const createTodoSchema = z.object({
  title: z.string().trim().min(1),
});

const updateTodoSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    (value) => value.title !== undefined || value.completed !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export function createTodosRouter(options: CreateTodosRouterOptions) {
  const router = Router();
  const repo = options.todosRepository;

  router.get("/todos", (_req, res) => {
    res.status(200).json({ todos: repo.list() });
  });

  router.get("/todos/:id", (req, res) => {
    const todo = repo.getById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Not Found" });
    }

    return res.status(200).json({ todo });
  });

  router.post("/todos", (req, res) => {
    const parsed = createTodoSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Bad Request" });
    }

    const todo = repo.create({
      id: options.createTodoId(),
      title: parsed.data.title,
      completed: false,
      createdAt: options.now(),
    });

    return res.status(201).json({ todo });
  });

  router.patch("/todos/:id", (req, res) => {
    const parsed = updateTodoSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Bad Request" });
    }

    const todo = repo.update(req.params.id, parsed.data);

    if (!todo) {
      return res.status(404).json({ error: "Not Found" });
    }

    return res.status(200).json({ todo });
  });

  router.delete("/todos/:id", (req, res) => {
    const deleted = repo.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Not Found" });
    }

    return res.status(204).send();
  });

  return router;
}
