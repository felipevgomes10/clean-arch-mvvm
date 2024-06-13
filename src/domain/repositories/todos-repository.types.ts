import type { TodoDTO } from "@/adapters/dtos/todo-dto/todo-dto";
import type { Todo } from "@/domain/model/todo/todo.types";

export type TodosRepository = {
  getTodos: () => Promise<TodoDTO[]>;
  getTodo: (id: string) => Promise<TodoDTO | null>;
  addTodo: (todo: Todo) => Promise<TodoDTO>;
  removeTodo: (id: string) => Promise<void>;
  updateTodo: (id: string) => Promise<void>;
};
