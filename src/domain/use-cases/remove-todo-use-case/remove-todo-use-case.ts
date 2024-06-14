import type { UseCaseWithParams } from "@/domain/use-cases/use-case.types";
import type { RemoveTodoUseCaseDependencies } from "./remove-todo-use-case.types";

export function removeTodoUseCase({
  todosRepository,
}: RemoveTodoUseCaseDependencies): UseCaseWithParams<Promise<void>, string> {
  return { execute: (id) => todosRepository.removeTodo(id) };
}
