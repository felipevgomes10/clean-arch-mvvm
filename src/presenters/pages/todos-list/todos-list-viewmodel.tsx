import { todoDTO, type TodoDTO } from "@/adapters/dtos/todo-dto/todo-dto";
import { todo } from "@/domain/model/todo/todo";
import type { Todo } from "@/domain/model/todo/todo.types";
import type {
  UseCase,
  UseCaseWithParams,
} from "@/domain/use-cases/use-case.types";
import { queryClient } from "@/lib/react-query/client";
import { useMutation, useQuery } from "@tanstack/react-query";

type TodosListViewModelDependencies = {
  getTodosUseCase: UseCase<Promise<TodoDTO[]>>;
  createTodoUseCase: UseCaseWithParams<Promise<TodoDTO>, Todo>;
};

export function useTodosListViewModel({
  getTodosUseCase,
  createTodoUseCase,
}: TodosListViewModelDependencies) {
  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodosUseCase.execute,
    select: (todos) => todos.map(todoDTO.fromApi),
  });

  const { mutate: mutateTodo } = useMutation({
    mutationKey: ["create-todos"],
    mutationFn: (todoData: Todo) => createTodoUseCase.execute(todoData),
    onMutate: async (todoData: Todo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const newTodo = todo(todoData);
      queryClient.setQueryData(["todos"], (oldTodos: TodoDTO[]) => [
        ...oldTodos,
        newTodo,
      ]);

      return { newTodo };
    },
    onSuccess: (result, _variables, context) => {
      queryClient.setQueryData(["todos"], (oldTodos: TodoDTO[]) => {
        const updatedTodos = oldTodos.map((oldTodo) => {
          return oldTodo.id === context.newTodo.id
            ? todoDTO.fromApi(result)
            : oldTodo;
        });

        return updatedTodos;
      });
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["todos"], (oldTodos: TodoDTO[]) => {
        const revertedTodos = oldTodos.filter((oldTodo) => {
          return oldTodo.id !== context?.newTodo.id;
        });

        return revertedTodos;
      });
    },
    retry: 3,
  });

  const createTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = event.currentTarget["todo-title"];
    mutateTodo({ title: title.value });
    title.value = "";
  };

  return { todos, createTodo };
}
