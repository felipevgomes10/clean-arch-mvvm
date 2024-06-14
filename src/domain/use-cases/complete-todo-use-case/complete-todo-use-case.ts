import type { UseCaseWithParams } from "@/domain/use-cases/use-case.types";
import type { CompleteTodoUseCaseDependencies } from "./complete-todo-use-case.types";

export function completeTodoUseCase({
  todosRepository,
}: CompleteTodoUseCaseDependencies): UseCaseWithParams<Promise<void>, string> {
  return { execute: (id) => todosRepository.updateTodo(id) };
}
