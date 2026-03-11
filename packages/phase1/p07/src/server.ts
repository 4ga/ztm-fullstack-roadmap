import crypto from "node:crypto";
import path from "node:path";
import { buildApp } from "./app";
import { openDatabase } from "./db/connect";
import { runMigrations } from "./db/migrate";
import { SqliteTodosRepository } from "./repositories/sqlite-todos-repository";

const dbFile = process.env.DATABASE_URL ?? "data/app.sqlite";
const db = openDatabase(dbFile);

runMigrations(db, path.resolve(process.cwd(), "migrations"));

const todosRepository = new SqliteTodosRepository(db);

const app = buildApp({
  todosRepository,
  createTodoId: () => crypto.randomUUID(),
  now: () => new Date().toISOString(),
});

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
