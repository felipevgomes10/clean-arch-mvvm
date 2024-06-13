import type { TodoDTOToApi } from "@/adapters/dtos/todo-dto/todo-dto.types";
import type { DataSource } from "@/domain/data/data-source.types";
import { api } from "@/lib/api/api";

export function dataSource(): DataSource {
  const getTodos = async () => {
    const { data } = await api("/todos");
    return data.slice(0, 10);
  };

  const getTodo = async (id: string) => {
    const { data } = await api(`/todos/${id}`);
    return data;
  };

  const addTodo = async (todo: TodoDTOToApi) => {
    const { data } = await api.post("/todos", todo);
    return data;
  };

  const removeTodo = async (id: string) => {
    api.delete(`/todos/${id}`);
  };

  const updateTodo = async (id: string) => {
    api.put(`/todos/${id}`, { completed: true });
  };

  return {
    getTodos,
    getTodo,
    addTodo,
    removeTodo,
    updateTodo,
  };
}
