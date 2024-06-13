import type { Todo } from "@/domain/model/todo/todo.types";

export type TodosRepository = {
  getTodos: () => Promise<Todo[]>;
  getTodo: (id: string) => Promise<Todo | null>;
  addTodo: (todo: Todo) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  updateTodo: (id: string) => Promise<void>;
};
