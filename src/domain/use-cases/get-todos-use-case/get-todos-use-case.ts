import type { TodoDTOToApi } from "@/adapters/dtos/todo-dto/todo-dto.types";
import type { UseCase } from "@/domain/use-cases/use-case.types";
import type { GetTodosUseCaseDependencies } from "./get-todos-use-case.types";

export function getTodosUseCase({
  todosRepository,
}: GetTodosUseCaseDependencies): UseCase<Promise<TodoDTOToApi[]>> {
  return { execute: () => todosRepository.getTodos() };
}
