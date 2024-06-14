import { todoDTO } from "@/adapters/dtos/todo-dto/todo-dto";
import type { TodoDTOToApi } from "@/adapters/dtos/todo-dto/todo-dto.types";
import { todo } from "@/domain/models/todo-model/todo-model";
import type { TodoModel } from "@/domain/models/todo-model/todo-model.types";
import type { UseCaseWithParams } from "@/domain/use-cases/use-case.types";
import type { CreateTodoUseCaseDependencies } from "./create-todo-use-case.types";

export function createTodoUseCase({
  todosRepository,
}: CreateTodoUseCaseDependencies): UseCaseWithParams<
  Promise<TodoDTOToApi>,
  TodoModel
> {
  return {
    execute: (todoData) => {
      const newTodo = todo(todoData);
      return todosRepository.addTodo(todoDTO.toApi(newTodo));
    },
  };
}
