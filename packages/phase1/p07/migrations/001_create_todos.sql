-- migrations/001_create_todos.sql
CREATE TABLE todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL CHECK (completed IN (0, 1)),
  created_at TEXT NOT NULL
);

CREATE INDEX idx_todos_created_at ON todos(created_at);