import type { TodoDTOFromApi } from "@/adapters/dtos/todo-dto/todo-dto.types";

export type TodoItemProps = {
  todo: TodoDTOFromApi;
  onDelete: (id: string) => Promise<void> | void;
};
