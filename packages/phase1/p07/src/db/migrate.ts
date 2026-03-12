// src/db/migrate.ts
import fs from "node:fs";
import path from "node:path";
import type Database from "better-sqlite3";

type MigrationRow = {
  filename: string;
};

const alphaCompare = (a: string, b: string) => a.localeCompare(b);

export function runMigrations(db: Database.Database, migrationsDir: string) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => /^\d+.*\.sql$/.test(file))
    .sort(alphaCompare);

  const appliedRows = db
    .prepare("SELECT filename FROM schema_migrations")
    .all() as MigrationRow[];

  const applied = new Set(appliedRows.map((row) => row.filename));

  const insertApplied = db.prepare(`
    INSERT INTO schema_migrations (filename, applied_at)
    VALUES (?, ?)
  `);

  const applyAll = db.transaction(() => {
    for (const file of files) {
      if (applied.has(file)) continue;

      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      db.exec(sql);
      insertApplied.run(file, new Date().toISOString());
    }
  });

  applyAll();
}
