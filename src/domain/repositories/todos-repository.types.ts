import type { TodoDTO } from "@/adapters/dtos/todo-dto/todo-dto";

export type TodosRepository = {
  getTodos: () => Promise<TodoDTO[]>;
  getTodo: (id: string) => Promise<TodoDTO | null>;
  addTodo: (todo: TodoDTO) => Promise<TodoDTO>;
  removeTodo: (id: string) => Promise<void>;
  updateTodo: (id: string) => Promise<void>;
};
