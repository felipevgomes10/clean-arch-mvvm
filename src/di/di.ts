import { todosRepository } from "@/adapters/repositories/todos-repository";
import { dataSource } from "@/data/data-source";
import { createTodoUseCase } from "@/domain/use-cases/create-todo-use-case/create-todo-use-case";
import { getTodosUseCase } from "@/domain/use-cases/get-todos-use-case/get-todos-use-case";
import { useTodosListViewModel } from "@/presenters/pages/todos-list/todos-list-viewmodel";
import { asFunction, createContainer } from "awilix";

export enum DIIdentifiers {
  TodosRepository = "todosRepository",
  DataSource = "dataSource",
  GetTodosUseCase = "getTodosUseCase",
  CreateTodoUseCase = "createTodoUseCase",
  UseTodosListViewModel = "useTodosListViewModel",
}

type DIIdentifiersMap = {
  [DIIdentifiers.TodosRepository]: ReturnType<typeof todosRepository>;
  [DIIdentifiers.DataSource]: ReturnType<typeof dataSource>;
  [DIIdentifiers.GetTodosUseCase]: ReturnType<typeof getTodosUseCase>;
  [DIIdentifiers.CreateTodoUseCase]: ReturnType<typeof createTodoUseCase>;
  [DIIdentifiers.UseTodosListViewModel]: ReturnType<
    typeof useTodosListViewModel
  >;
};

export const container = createContainer();

container.register({
  [DIIdentifiers.DataSource]: asFunction(dataSource),
  [DIIdentifiers.TodosRepository]: asFunction(todosRepository),
  [DIIdentifiers.GetTodosUseCase]: asFunction(getTodosUseCase),
  [DIIdentifiers.CreateTodoUseCase]: asFunction(createTodoUseCase),
  [DIIdentifiers.UseTodosListViewModel]: asFunction(useTodosListViewModel),
});

export function DI<T extends DIIdentifiers>(
  indentifier: T
): DIIdentifiersMap[T] {
  return container.resolve(indentifier);
}
