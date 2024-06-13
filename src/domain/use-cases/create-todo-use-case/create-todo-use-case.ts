import { todo } from "@/domain/model/todo/todo";
import type { Todo } from "@/domain/model/todo/todo.types";
import type { UseCaseWithParams } from "@/domain/use-cases/use-case.types";
import type { CreateTodoUseCaseDependencies } from "./create-todo-use-case.types";

export function createTodoUseCase({
  todosRepository,
}: CreateTodoUseCaseDependencies): UseCaseWithParams<Promise<void>, Todo> {
  return {
    execute: (todoData: Todo) => todosRepository.addTodo(todo(todoData)),
  };
}
