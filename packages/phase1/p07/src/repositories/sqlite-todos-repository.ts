// src/repositories/sqlite-todos-repository.ts
import type Database from "better-sqlite3";
import type {
  Todo,
  TodosRepository,
  CreateTodoInput,
  UpdateTodoInput,
} from "./todos-repository";

type TodoRow = {
  id: string;
  title: string;
  completed: number;
  created_at: string;
};

function mapRow(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
    createdAt: row.created_at,
  };
}

export class SqliteTodosRepository implements TodosRepository {
  constructor(private readonly db: Database.Database) {}

  list(): Todo[] {
    const rows = this.db
      .prepare(
        `
        SELECT id, title, completed, created_at
        FROM todos
        ORDER BY created_at ASC, id ASC
        `,
      )
      .all() as TodoRow[];

    return rows.map(mapRow);
  }

  getById(id: string): Todo | null {
    const row = this.db
      .prepare(
        `
        SELECT id, title, completed, created_at
        FROM todos
        WHERE id = ?
        `,
      )
      .get(id) as TodoRow | undefined;

    return row ? mapRow(row) : null;
  }

  create(input: CreateTodoInput): Todo {
    this.db
      .prepare(
        `
        INSERT INTO todos (id, title, completed, created_at)
        VALUES (@id, @title, @completed, @created_at)
        `,
      )
      .run({
        id: input.id,
        title: input.title,
        completed: input.completed ? 1 : 0,
        created_at: input.createdAt,
      });

    return input;
  }

  update(id: string, input: UpdateTodoInput): Todo | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const nextTitle = input.title ?? existing.title;
    const nextCompleted = input.completed ?? existing.completed;

    this.db
      .prepare(
        `
        UPDATE todos
        SET title = ?, completed = ?
        WHERE id = ?
        `,
      )
      .run(nextTitle, nextCompleted ? 1 : 0, id);

    return this.getById(id);
  }

  delete(id: string): boolean {
    const result = this.db
      .prepare(
        `
        DELETE FROM todos
        WHERE id = ?
        `,
      )
      .run(id);

    return result.changes > 0;
  }
}
