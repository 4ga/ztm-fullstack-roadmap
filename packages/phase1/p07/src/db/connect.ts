// src/db/connect.ts
import Database from "better-sqlite3";

export function openDatabase(filename: string) {
  return new Database(filename);
}
