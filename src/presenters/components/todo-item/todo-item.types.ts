import type { TodoDTOFromApi } from "@/adapters/dtos/todo-dto/todo-dto.types";

export type TodoItemProps = {
  todo: TodoDTOFromApi;
  onDeleteTodo: (id: string) => Promise<void> | void;
  onCompleteTodo: (id: string) => Promise<void> | void;
};
