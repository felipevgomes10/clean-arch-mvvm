import type {
  TodoDTOFromApi,
  TodoDTOToApi,
} from "@/adapters/dtos/todo-dto/todo-dto.types";

export type TodosRepository = {
  getTodos: () => Promise<TodoDTOFromApi[]>;
  getTodo: (id: string) => Promise<TodoDTOFromApi | null>;
  addTodo: (todo: TodoDTOToApi) => Promise<TodoDTOFromApi>;
  removeTodo: (id: string) => Promise<void>;
  updateTodo: (id: string) => Promise<void>;
};
