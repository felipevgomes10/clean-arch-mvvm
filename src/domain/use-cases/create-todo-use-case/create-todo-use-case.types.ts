import type { TodosRepository } from "@/domain/repositories/todos-repository.types";

export type CreateTodoUseCaseDependencies = {
  todosRepository: TodosRepository;
};
