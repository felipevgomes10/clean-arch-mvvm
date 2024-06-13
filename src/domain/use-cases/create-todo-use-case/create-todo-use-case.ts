import { todoDTO } from "@/adapters/dtos/todo-dto/todo-dto";
import type { TodoDTOToApi } from "@/adapters/dtos/todo-dto/todo-dto.types";
import { todo } from "@/domain/model/todo/todo";
import type { Todo } from "@/domain/model/todo/todo.types";
import type { UseCaseWithParams } from "@/domain/use-cases/use-case.types";
import type { CreateTodoUseCaseDependencies } from "./create-todo-use-case.types";

export function createTodoUseCase({
  todosRepository,
}: CreateTodoUseCaseDependencies): UseCaseWithParams<
  Promise<TodoDTOToApi>,
  Todo
> {
  return {
    execute: (todoData: Todo) => {
      return todosRepository.addTodo(todoDTO.toApi(todo(todoData)));
    },
  };
}
