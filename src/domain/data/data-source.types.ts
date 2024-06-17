import type { TodoDTOToApi } from "@/adapters/dtos/todo-dto/todo-dto.types";

export type DataSource = {
  getTodos: () => Promise<TodoDTOToApi[]>;
  getTodo: (id: string) => Promise<TodoDTOToApi | null>;
  addTodo: (todo: TodoDTOToApi) => Promise<TodoDTOToApi>;
  removeTodo: (id: string) => Promise<void>;
  updateTodo: (id: string) => Promise<void>;
};
