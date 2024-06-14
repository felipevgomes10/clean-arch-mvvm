import type { TodoModel } from "@/domain/models/todo-model/todo-model.types";
import type { TodoDTOFromApi, TodoDTOToApi } from "./todo-dto.types";

function fromApi(todo: Required<TodoModel>): TodoDTOFromApi {
  return {
    id: todo.id,
    title: todo.title.toLowerCase(),
    completed: todo.completed,
  };
}

function toApi(todo: Required<TodoModel>): TodoDTOToApi {
  return {
    id: todo.id,
    title: todo.title.toUpperCase(),
    completed: todo.completed,
  };
}

export const todoDTO = { fromApi, toApi };
