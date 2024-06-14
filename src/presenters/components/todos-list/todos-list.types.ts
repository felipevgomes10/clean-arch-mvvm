import { TodoDTOFromApi } from "@/adapters/dtos/todo-dto/todo-dto.types";

export type TodosListProps = {
  todos: TodoDTOFromApi[];
  onDelete: (id: string) => Promise<void> | void;
};
