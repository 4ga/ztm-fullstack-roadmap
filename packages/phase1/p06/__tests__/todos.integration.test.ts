import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app";

const makeApp = () => {
  let nextId = 1;
  const createId = vi.fn(() => `todo-${nextId++}`);
  return createApp({ createId });
};

describe("todos API", () => {
  it("creates a todo", async () => {
    const app = makeApp();

    const response = await request(app)
      .post("/todos")
      .send({ title: "Learn Vitest" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: "todo-1",
      title: "Learn Vitest",
      completed: false,
    });
  });

  it("lists todos and contains the created item", async () => {
    const app = makeApp();

    await request(app).post("/todos").send({ title: "Write tests first" });

    const response = await request(app).get("/todos");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      items: [{ id: "todo-1", title: "Write tests first", completed: false }],
    });
  });

  it("gets a todo by id", async () => {
    const app = makeApp();

    await request(app).post("/todos").send({ title: "Read one todo" });

    const response = await request(app).get("/todos/todo-1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: "todo-1",
      title: "Read one todo",
      completed: false,
    });
  });

  it("patches a todo", async () => {
    const app = makeApp();

    await request(app).post("/todos").send({ title: "Old title" });

    const response = await request(app)
      .patch("/todos/todo-1")
      .send({ title: "New title", completed: true });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: "todo-1",
      title: "New title",
      completed: true,
    });
  });

  it("deletes a todo and then returns 404 on get", async () => {
    const app = makeApp();

    await request(app).post("/todos").send({ title: "Delete me" });

    const deleteResponse = await request(app).delete("/todos/todo-1");
    expect(deleteResponse.status).toBe(204);
    expect(deleteResponse.text).toBe("");

    const getResponse = await request(app).get("/todos/todo-1");
    expect(getResponse.status).toBe(404);
    expect(getResponse.body).toEqual({ error: "Not Found" });
  });

  it("returns 400 for invalid create body", async () => {
    const app = makeApp();

    const response = await request(app).post("/todos").send({ title: "" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Bad Request" });
  });

  it("returns 404 for unknown routes", async () => {
    const app = makeApp();

    const response = await request(app).get("/uknown");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Not Found" });
  });
});
