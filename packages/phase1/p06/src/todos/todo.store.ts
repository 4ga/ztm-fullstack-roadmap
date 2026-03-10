import type { Todo } from "./todo.types";

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

export interface TodoStore {
  create(input: { id: string; title: string }): Todo;
  list(): Todo[];
  getById(id: string): Todo | undefined;
  update(id: string, input: UpdateTodoInput): Todo | undefined;
  remove(id: string): boolean;
}

export const createTodoStore = (): TodoStore => {
  const items = new Map<string, Todo>();

  return {
    create(input) {
      const todo: Todo = {
        id: input.id,
        title: input.title,
        completed: false,
      };
      items.set(todo.id, todo);
      return todo;
    },
    list() {
      return Array.from(items.values());
    },
    getById(id) {
      return items.get(id);
    },
    update(id, input) {
      const existing = items.get(id);
      if (!existing) return undefined;
      const updated: Todo = { ...existing, ...input };
      items.set(id, updated);
      return updated;
    },
    remove(id) {
      return items.delete(id);
    },
  };
};
