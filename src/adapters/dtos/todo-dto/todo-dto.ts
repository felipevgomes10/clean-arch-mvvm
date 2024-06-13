import type { Todo } from "@/domain/model/todo/todo.types";
import type { TodoDTOFromApi, TodoDTOToApi } from "./todo-dto.types";

function fromApi(todo: Required<Todo>): TodoDTOFromApi {
  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
  };
}

function toApi(todo: Required<Todo>): TodoDTOToApi {
  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
  };
}

export const todoDTO = { fromApi, toApi };
