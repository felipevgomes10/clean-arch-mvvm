import { todoDTO } from "@/adapters/dtos/todo-dto/todo-dto";
import type {
  TodoDTOFromApi,
  TodoDTOToApi,
} from "@/adapters/dtos/todo-dto/todo-dto.types";
import { todo } from "@/domain/models/todo-model/todo-model";
import type { TodoModel } from "@/domain/models/todo-model/todo-model.types";
import type {
  UseCase,
  UseCaseWithParams,
} from "@/domain/use-cases/use-case.types";
import { queryClient } from "@/lib/react-query/client";
import { useMutation, useQuery } from "@tanstack/react-query";

type TodosListViewModelDependencies = {
  getTodosUseCase: UseCase<Promise<TodoDTOToApi[]>>;
  addTodoUseCase: UseCaseWithParams<Promise<TodoDTOToApi>, TodoModel>;
  removeTodoUseCase: UseCaseWithParams<Promise<void>, string>;
  completeTodoUseCase: UseCaseWithParams<Promise<void>, string>;
};

export function useTodosListViewModel({
  getTodosUseCase,
  addTodoUseCase,
  removeTodoUseCase,
  completeTodoUseCase,
}: TodosListViewModelDependencies) {
  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodosUseCase.execute,
    select: (todos) => todos.map(todoDTO.fromApi),
  });

  const { mutate: mutateTodo } = useMutation({
    mutationKey: ["add-todo"],
    mutationFn: (todoData: TodoModel) => addTodoUseCase.execute(todoData),
    onMutate: async (todoData: TodoModel) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const newTodo = todo(todoData);
      queryClient.setQueryData(["todos"], (oldTodos: TodoDTOFromApi[]) => [
        ...oldTodos,
        newTodo,
      ]);

      return { newTodo };
    },
    onSuccess: (result, _variables, context) => {
      queryClient.setQueryData(["todos"], (oldTodos: TodoDTOFromApi[]) => {
        const updatedTodos = oldTodos.map((oldTodo) => {
          return oldTodo.id === context.newTodo.id
            ? todoDTO.fromApi(result)
            : oldTodo;
        });

        return updatedTodos;
      });
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["todos"], (oldTodos: TodoDTOFromApi[]) => {
        const revertedTodos = oldTodos.filter((oldTodo) => {
          return oldTodo.id !== context?.newTodo.id;
        });

        return revertedTodos;
      });
    },
    retry: 3,
  });

  const onAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = event.currentTarget["todo-title"];
    mutateTodo({ title: title.value });
    title.value = "";
  };

  const { mutate: deleteTodo } = useMutation({
    mutationKey: ["delete-todo"],
    mutationFn: (id: string) => removeTodoUseCase.execute(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const queryData = queryClient.getQueryData<TodoDTOFromApi[]>(["todos"]);
      const deletedTodo = queryData?.find((todo) => todo.id === id);

      queryClient.setQueryData(["todos"], (oldTodos: TodoDTOFromApi[]) => {
        const updatedTodos = oldTodos.filter((todo) => todo.id !== id);

        return updatedTodos;
      });

      return { deletedTodo };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["todos"], (oldTodos: TodoDTOFromApi[]) => {
        const deletedTodo = context?.deletedTodo || {};
        const revertedTodos = [...oldTodos, deletedTodo];

        return revertedTodos;
      });
    },
    retry: 3,
  });

  const onRemoveTodo = (id: string) => {
    deleteTodo(id);
  };

  const { mutate: completeTodo } = useMutation({
    mutationKey: ["complete-todo"],
    mutationFn: (id: string) => completeTodoUseCase.execute(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      queryClient.setQueryData(["todos"], (oldTodos: TodoDTOFromApi[]) => {
        const updatedTodos = oldTodos.map((todo) => {
          return todo.id === id ? { ...todo, completed: true } : todo;
        });

        return updatedTodos;
      });

      return { id };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["todos"], (oldTodos: TodoDTOFromApi[]) => {
        const revertedTodos = oldTodos.map((todo) => {
          return todo.id === context?.id ? { ...todo, completed: false } : todo;
        });

        return revertedTodos;
      });
    },
    retry: 3,
  });

  const onCompleteTodo = (id: string) => {
    completeTodo(id);
  };

  return {
    todos,
    onAddTodo,
    onRemoveTodo,
    onCompleteTodo,
  };
}
