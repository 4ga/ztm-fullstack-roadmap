// tests/todos.integration.test.ts
import request from "supertest";
import { beforeEach, afterEach, describe, expect, it } from "vitest";
import type Database from "better-sqlite3";

import { buildApp } from "../src/app";
import { SqliteTodosRepository } from "../src/repositories/sqlite-todos-repository";
import {
  createTestDb,
  createDeterministicIdGenerator,
  fixedNow,
} from "./helpers/test-db";

describe("todos api (sqlite)", () => {
  let db: Database.Database;
  let app: ReturnType<typeof buildApp>;

  beforeEach(() => {
    db = createTestDb();

    const repo = new SqliteTodosRepository(db);

    app = buildApp({
      todosRepository: repo,
      createTodoId: createDeterministicIdGenerator(),
      now: fixedNow,
    });
  });

  afterEach(() => {
    db.close();
  });

  it("create todo persists and is reflected by get/list", async () => {
    const createRes = await request(app)
      .post("/todos")
      .send({ title: "Learn SQLite" });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toEqual({
      todo: {
        id: "todo-1",
        title: "Learn SQLite",
        completed: false,
        createdAt: "2026-03-10T00:00:00.000Z",
      },
    });

    const getRes = await request(app).get("/todos/todo-1");
    expect(getRes.status).toBe(200);
    expect(getRes.body).toEqual(createRes.body);

    const listRes = await request(app).get("/todos");
    expect(listRes.status).toBe(200);
    expect(listRes.body).toEqual({
      todos: [
        {
          id: "todo-1",
          title: "Learn SQLite",
          completed: false,
          createdAt: "2026-03-10T00:00:00.000Z",
        },
      ],
    });
  });

  it("patch persists and fetch reflects it", async () => {
    await request(app).post("/todos").send({ title: "Before" });

    const patchRes = await request(app)
      .patch("/todos/todo-1")
      .send({ title: "After", completed: true });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body).toEqual({
      todo: {
        id: "todo-1",
        title: "After",
        completed: true,
        createdAt: "2026-03-10T00:00:00.000Z",
      },
    });

    const getRes = await request(app).get("/todos/todo-1");
    expect(getRes.status).toBe(200);
    expect(getRes.body).toEqual(patchRes.body);
  });

  it("delete persists and subsequent get is 404", async () => {
    await request(app).post("/todos").send({ title: "Delete me" });

    const deleteRes = await request(app).delete("/todos/todo-1");
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get("/todos/todo-1");
    expect(getRes.status).toBe(404);
    expect(getRes.body).toEqual({ error: "Not Found" });
  });

  it("invalid body returns 400", async () => {
    const res = await request(app).post("/todos").send({ title: "" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Bad Request" });
  });
});
