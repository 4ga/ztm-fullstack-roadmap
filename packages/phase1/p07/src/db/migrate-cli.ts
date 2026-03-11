import path from "node:path";
import { openDatabase } from "./connect";
import { runMigrations } from "./migrate";

const dbFile = process.env.DATABASE_URL ?? "data/app.sqlite";
const db = openDatabase(dbFile);

runMigrations(db, path.resolve(process.cwd(), "migrations"));
db.close();
