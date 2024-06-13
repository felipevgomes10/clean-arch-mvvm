import type { Todo } from "@/domain/model/todo/todo.types";
import type { UseCase } from "@/domain/use-cases/use-case.types";
import type { GetTodosUseCaseDependencies } from "./get-todos-use-case.types";

export function getTodosUseCase({
  todosRepository,
}: GetTodosUseCaseDependencies): UseCase<Promise<Todo[]>> {
  return { execute: () => todosRepository.getTodos() };
}
