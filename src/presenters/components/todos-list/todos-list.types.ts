import { TodoDTOFromApi } from "@/adapters/dtos/todo-dto/todo-dto.types";

export type TodosListProps = {
  todos: TodoDTOFromApi[];
  onDeleteTodo: (id: string) => Promise<void> | void;
  onCompleteTodo: (id: string) => Promise<void> | void;
};
