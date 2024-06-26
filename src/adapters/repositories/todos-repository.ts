import type { DataSource } from "@/domain/data/data-source.types";
import type { TodosRepository } from "@/domain/repositories/todos-repository.types";
import type { TodoDTOToApi } from "../dtos/todo-dto/todo-dto.types";

type TodosRepositoryDependencies = {
  dataSource: DataSource;
};

export function todosRepository({
  dataSource,
}: TodosRepositoryDependencies): TodosRepository {
  const getTodos = async () => dataSource.getTodos();
  const getTodo = async (id: string) => dataSource.getTodo(id);
  const addTodo = async (todo: TodoDTOToApi) => dataSource.addTodo(todo);
  const removeTodo = async (id: string) => dataSource.removeTodo(id);
  const updateTodo = async (id: string) => dataSource.updateTodo(id);

  return {
    getTodos,
    getTodo,
    addTodo,
    removeTodo,
    updateTodo,
  };
}
