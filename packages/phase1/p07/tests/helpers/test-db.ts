import Database from "better-sqlite3";
import path from "node:path";
import { runMigrations } from "../../src/db/migrate";

export function createTestDb() {
  const db = new Database(":memory:");
  runMigrations(db, path.resolve(process.cwd(), "migrations"));
  return db;
}

export function createDeterministicIdGenerator() {
  let count = 0;
  return () => `todo-${++count}`;
}

export function fixedNow() {
  return "2026-03-11T00:00:00.000Z";
}
