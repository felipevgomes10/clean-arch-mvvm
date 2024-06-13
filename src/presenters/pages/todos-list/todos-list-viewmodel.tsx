import type { Todo } from "@/domain/model/todo/todo.types";
import type {
  UseCase,
  UseCaseWithParams,
} from "@/domain/use-cases/use-case.types";
import { queryClient } from "@/lib/react-query/client";
import { useMutation, useQuery } from "@tanstack/react-query";

type TodosListViewModelDependencies = {
  getTodosUseCase: UseCase<Promise<Todo[]>>;
  createTodoUseCase: UseCaseWithParams<Promise<void>, Todo>;
};

export function useTodosListViewModel({
  getTodosUseCase,
  createTodoUseCase,
}: TodosListViewModelDependencies) {
  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodosUseCase.execute,
  });

  const { mutate: mutateTodo } = useMutation({
    mutationKey: ["create-todos"],
    mutationFn: (todoData: Todo) => createTodoUseCase.execute(todoData),
    onMutate: async (todoData: Todo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      queryClient.setQueryData<Todo[]>(["todos"], (oldTodos = []) => [
        ...oldTodos,
        todoData,
      ]);

      return { todoData };
    },
    onSuccess: (result, _variables, context) => {
      queryClient.setQueryData(["todos"], (oldTodos: Todo[]) => {
        const updatedTodos = oldTodos.map((todo) => {
          return todo.id === context.todoData.id ? result : todo;
        });

        return updatedTodos;
      });
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["todos"], (oldTodos: Todo[]) => {
        const revertedTodos = oldTodos.filter((oldTodos) => {
          return oldTodos.id !== context?.todoData.id;
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
