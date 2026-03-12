// src/repositories/todos-repository.ts
export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type CreateTodoInput = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type UpdateTodoInput = {
  title?: string;
  completed?: boolean;
};

export interface TodosRepository {
  list(): Todo[];
  getById(id: string): Todo | null;
  create(input: CreateTodoInput): Todo;
  update(id: string, input: UpdateTodoInput): Todo | null;
  delete(id: string): boolean;
}
