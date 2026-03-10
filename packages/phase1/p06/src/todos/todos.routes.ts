import { Router } from "express";
import { z } from "zod";
import { IdGenerator } from "../lib/id";
import { TodoStore } from "./todo.store";

interface CreateTodosRouterDeps {
  store: TodoStore;
  createId: IdGenerator;
}

const createTodoSchema = z.object({ title: z.string().min(1) }).strict();
const updateTodoSchema = z
  .object({
    title: z.string().min(1).optional(),
    completed: z.boolean().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const createTodosRouter = ({
  store,
  createId,
}: CreateTodosRouterDeps) => {
  const router = Router();

  router.post("/", (req, res) => {
    const parsed = createTodoSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Bad Request" });
    }

    const todo = store.create({ id: createId(), title: parsed.data.title });
    return res.status(201).json(todo);
  });

  router.get("/", (_req, res) => {
    return res.status(200).json({ items: store.list() });
  });

  router.get("/:id", (req, res) => {
    const todo = store.getById(req.params.id);

    if (!todo) return res.status(404).json({ error: "Not Found" });

    return res.status(200).json(todo);
  });

  router.patch("/:id", (req, res) => {
    const parsed = updateTodoSchema.safeParse(req.body);

    if (!parsed.success) return res.status(400).json({ error: "Bad Request" });

    const updated = store.update(req.params.id, parsed.data);

    if (!updated) return res.status(404).json({ error: "Not Found" });

    return res.status(200).json(updated);
  });

  router.delete("/:id", (req, res) => {
    const removed = store.remove(req.params.id);

    if (!removed) return res.status(404).json({ error: "Not Found" });

    return res.status(204).send();
  });

  return router;
};
