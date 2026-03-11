// src/db/connect.ts
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

export function openDatabase(filename: string) {
  const dir = path.dirname(filename);

  if (dir !== "." && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return new Database(filename);
}
