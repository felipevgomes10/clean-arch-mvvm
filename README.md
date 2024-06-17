## Summary

1. [Clean Architecture (CA)](#ca)
2. [MVVM](#mvvm)
3. [CA and MVVM](#ca-and-mvvm)
4. [Folder structure](#folder-structure)
5. [Breaking down a ViewModel](#breaking-down-a-viewmodel)

### Clean Architecture (CA) 
<div id="ca">

Clean Architecture, by Robert C. Martin, aims to create flexible and testable software systems independent of external factors like frameworks and databases. It emphasizes principles like framework independence, testability, and UI/database independence.

Benefits include improved maintainability, flexibility, and testability.

The architecture organizes software into concentric layers, with business rules at the core, followed by use cases, interface adapters, and finally frameworks and drivers. This ensures business rules remain isolated and independent.

### MVVM
<div id="mvvm">

MVVM (Model-View-ViewModel) is a software design pattern that separates the user interface (View) from the business logic (Model) using an intermediate layer (ViewModel).

* **Model:** Holds the application's data and business logic.
* **View:** Defines the user interface's structure and layout.
* **ViewModel:** Exposes data from the Model to the View and handles user interactions.

MVVM improves code maintainability, reusability, and testability.

### CA and MVVM
<div id="ca-and-mvvm">

Clean Architecture and MVVM can be combined for well-structured apps. Clean Architecture layers include Entities (core rules), Use Cases (user interactions), Gateways (external communication), Adapters (data adaptation), and Presentation (UI, where MVVM fits).

In the Presentation layer, MVVM consists of the View (UI), ViewModel (presentation logic), and Model (displayed data). The View triggers events in the ViewModel, which executes use cases and updates the Model. The Model then notifies the View, which updates the UI.

Benefits include separation of concerns, code reusability, framework independence, and testability. However, this approach can increase complexity and requires understanding both patterns.

Overall, combining Clean Architecture and MVVM is a powerful way to build robust and maintainable apps, but should be considered based on project complexity and team experience.

### Folder structure
<div id="folder-structure">

```ts
// src

adapters
  | -- dtos
  | -- repositories
data
di
domain
  | -- data
  | -- models
  | -- repositories
  | -- use-cases
lib
  | -- api
  | -- react-query
presenters
  | -- components
  | -- pages
```

#### Adapters

This folder holds the implementation of the `repositories` and the `dtos`. So it's reponsible for connecting the application with the outside world, in this case as we're dealing with client-side code the outside world is any API the application calls. Also, it implements data transformation functions.

* **repositories**: This folder implements the layer that encapsulates the functions that `connect the application with the data source`. Note that a repository doesn't call the APIs directly, rather it uses only interfaces/types instead of implementations.

```ts
// todo-repository.ts

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
```

* **dtos**: This is the `data-transformation layer` and is responsible for parsing the data that comes from the API and the data the application sends to the API.

```ts
import type { TodoModel } from "@/domain/models/todo-model/todo-model.types";
import type { TodoDTOFromApi, TodoDTOToApi } from "./todo-dto.types";

function fromApi(todo: Required<TodoModel>): TodoDTOFromApi {
  return {
    id: todo.id,
    title: todo.title.toLowerCase(),
    completed: todo.completed,
  };
}

function toApi(todo: Required<TodModel>): TodoDTOToApi {
  return {
    id: todo.id,
    title: todo.title.toUpperCase(),
    completed: todo.completed,
  };
}

export const todoDTO = { fromApi, toApi };
```

#### Data

That's the `application\'s data layer` and in this case encapsulates the API calls.

```ts
// data-source.ts

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
```

#### Lib

Generally, the `lib` folder (short for "library") contains reusable code that is independent of any specific domain of the application. Think of it as a toolbox with helper functions, classes, and modules that can be used in different parts of your project.
In this case the lib folder was initially used to create the base setup for `axios` and `react-query`.

```ts
// api.ts

import axios from "axios";

export const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});
```

```ts
// client.ts

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
```

#### Domain

The domain is the layer responsible for holding the application's `models (entities)`, `use-cases` and `contracts` for the the data source and repositories.

* **models**: The models folder encapsulates the application's `entities and their business rules`.

```ts
// todo-model.ts

import { z } from "zod";
import type { TodoModel } from "./todo-model.types";

export const todoSchema = z
  .object({
    id: z.string().optional(),
    title: z
      .string()
      .min(3, { message: "Todo should have a min length of 3 characters." })
      .max(20, { message: "Todo should have a max length of 20 characters." }),
    completed: z.boolean().optional(),
  })
  .transform(({ id, title, completed }) => ({
    id: id || crypto.randomUUID(),
    title,
    completed: completed || false,
  }));

export function todo({
  id,
  title,
  completed,
}: TodoModel): z.output<typeof todoSchema> {
  const todo = todoSchema.parse({
    id,
    title,
    completed,
  });

  return todo;
}
```

* **repositories**: The repositories that live inside the domain folder are the `contracts` (interfaces/types) that are used throughout the application to apply the [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle) from SOLID. To sum up, `the application should never depend on concrete implementations`, rather it should depend on contracts instead.

```ts
// todo-repository.types.ts

import type { TodoDTOToApi } from "@/adapters/dtos/todo-dto/todo-dto.types";

export type TodosRepository = {
  getTodos: () => Promise<TodoDTOToApi[]>;
  getTodo: (id: string) => Promise<TodoDTOToApi | null>;
  addTodo: (todo: TodoDTOToApi) => Promise<TodoDTOToApi>;
  removeTodo: (id: string) => Promise<void>;
  updateTodo: (id: string) => Promise<void>;
};

```

* **data**: The data folder inside domain `holds the contracts for the actual implementation of the data source`. This again is just being done so it's possible to apply the [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle) from SOLID.

```ts
// data-source.types.ts

import type { TodoDTOToApi } from "@/adapters/dtos/todo-dto/todo-dto.types";

export type DataSource = {
  getTodos: () => Promise<TodoDTOToApi[]>;
  getTodo: (id: string) => Promise<TodoDTOToApi | null>;
  addTodo: (todo: TodoDTOToApi) => Promise<TodoDTOToApi>;
  removeTodo: (id: string) => Promise<void>;
  updateTodo: (id: string) => Promise<void>;
};

```

* **use-cases**: The use-cases folder are the basically the actions the final user can perform when using the application. A use-case is responsible for interacting with the available repositories, models and transforming data to the format the API expects.

```ts
// add-todo-use-case.ts

import { todoDTO } from "@/adapters/dtos/todo-dto/todo-dto";
import type { TodoDTOToApi } from "@/adapters/dtos/todo-dto/todo-dto.types";
import { todo } from "@/domain/models/todo-model/todo-model";
import type { TodoModel } from "@/domain/models/todo-model/todo-model.types";
import type { UseCaseWithParams } from "@/domain/use-cases/use-case.types";
import type { AddTodoUseCaseDependencies } from "./add-todo-use-case.types";

export function addTodoUseCase({
  todosRepository,
}: AddTodoUseCaseDependencies): UseCaseWithParams<
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
```

```ts
// get-todos-use-case.ts

import type { TodoDTOToApi } from "@/adapters/dtos/todo-dto/todo-dto.types";
import type { UseCase } from "@/domain/use-cases/use-case.types";
import type { GetTodosUseCaseDependencies } from "./get-todos-use-case.types";

export function getTodosUseCase({
  todosRepository,
}: GetTodosUseCaseDependencies): UseCase<Promise<TodoDTOToApi[]>> {
  return { execute: () => todosRepository.getTodos() };
}
```

#### Presenters

The presenters folder is the `presentation layer` of the application and it's here that most of the `MVVM principles` are applied.

* **components**: The components folders should only contain dumb components that work in every context their called as long as their props are provided and passed down correctly.

```tsx
// add-todo.tsx

import { useTodosListViewModel } from "@/presenters/pages/todos-list/todos-list-viewmodel";
import styles from "./add-todo.module.css";

type AddTodoProps = {
  onAddTodo: ReturnType<typeof useTodosListViewModel>["onAddTodo"];
};

export function AddTodo({ onAddTodo }: AddTodoProps) {
  return (
    <form onSubmit={onAddTodo} className={styles.container}>
      <input name="todo-title" className={styles.input} required />
      <button type="submit" className={styles.button}>
        Add
      </button>
    </form>
  );
}

```

```tsx
// todo-item.tsx

import { Check, Trash } from "@phosphor-icons/react";
import styles from "./todo-item.module.css";
import type { TodoItemProps } from "./todo-item.types";

export function TodoItem({
  todo,
  onRemoveTodo,
  onCompleteTodo,
}: TodoItemProps) {
  return (
    <li className={styles.todoItem}>
      <span
        className={styles.todoItemText}
        title={todo.title}
        data-completed={todo.completed ? "true" : "false"}
      >
        {todo.title}
      </span>
      <button
        className={styles.todoItemButton}
        onClick={() => onCompleteTodo(todo.id)}
        disabled={todo.completed}
        data-type="complete"
      >
        <Check size={16} />
      </button>
      <button
        className={styles.todoItemButton}
        onClick={() => onRemoveTodo(todo.id)}
        data-type="delete"
      >
        <Trash size={16} />
      </button>
    </li>
  );
}
```

* **pages**: The pages folder is responsible for the `View` and `ViewModel` layers of the `MVVM` design pattern.

The `View` is basically a react component and should have little to no logic at all inside it. It connects to the `ViewModel` using `dependency injection (DI)`, so that it's decoupled from the actual implementation of the `ViewModel`. 

```tsx
// todos-list-view.tsx

import { DI, DIIdentifiers } from "@/di/di";
import { AddTodo } from "@/presenters/components/add-todo/add-todo";
import { Loading } from "@/presenters/components/loading/loading";
import { TodosList } from "@/presenters/components/todos-list/todos-list";
import styles from "./todos-list-view.module.css";

export function TodosListView() {
  const { todos, onAddTodo, onRemoveTodo, onCompleteTodo } = DI(
    DIIdentifiers.UseTodosListViewModel
  );

  if (!todos) return <Loading />;

  return (
    <div className={styles.todosListView}>
      <TodosList
        todos={todos}
        onRemoveTodo={onRemoveTodo}
        onCompleteTodo={onCompleteTodo}
      />
      <AddTodo onAddTodo={onAddTodo} />
    </div>
  );
}
```

The `ViewModel` on the other hand is the layer that `calls the use-cases`, `handles presentation logic`, `data transformation` (parses the data from the API to be used in the `View`) and `user-related events`

```ts
// todos-list-viewmodel.ts

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
    mutationKey: ["create-todos"],
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
```

#### DI

This di folder is responsible for making dealing with dependencies easier. It `injects all the dependencies a function needs` if this fuction is called using the DI helper.

```ts
// di.ts

import { todosRepository } from "@/adapters/repositories/todos-repository";
import { dataSource } from "@/data/data-source";
import { addTodoUseCase } from "@/domain/use-cases/add-todo-use-case/add-todo-use-case";
import { completeTodoUseCase } from "@/domain/use-cases/complete-todo-use-case/complete-todo-use-case";
import { getTodosUseCase } from "@/domain/use-cases/get-todos-use-case/get-todos-use-case";
import { removeTodoUseCase } from "@/domain/use-cases/remove-todo-use-case/remove-todo-use-case";
import { useTodosListViewModel } from "@/presenters/pages/todos-list/todos-list-viewmodel";
import { asFunction, createContainer } from "awilix";

export enum DIIdentifiers {
  TodosRepository = "todosRepository",
  DataSource = "dataSource",
  GetTodosUseCase = "getTodosUseCase",
  AddTodoUseCase = "addTodoUseCase",
  RemoveTodoUseCase = "removeTodoUseCase",
  CompleteTodoUseCase = "completeTodoUseCase",
  UseTodosListViewModel = "useTodosListViewModel",
}

type DIIdentifiersMap = {
  [DIIdentifiers.TodosRepository]: ReturnType<typeof todosRepository>;
  [DIIdentifiers.DataSource]: ReturnType<typeof dataSource>;
  [DIIdentifiers.GetTodosUseCase]: ReturnType<typeof getTodosUseCase>;
  [DIIdentifiers.AddTodoUseCase]: ReturnType<typeof addTodoUseCase>;
  [DIIdentifiers.RemoveTodoUseCase]: ReturnType<typeof removeTodoUseCase>;
  [DIIdentifiers.CompleteTodoUseCase]: ReturnType<typeof completeTodoUseCase>;
  [DIIdentifiers.UseTodosListViewModel]: ReturnType<
    typeof useTodosListViewModel
  >;
};

export const container = createContainer();

container.register({
  [DIIdentifiers.DataSource]: asFunction(dataSource),
  [DIIdentifiers.TodosRepository]: asFunction(todosRepository),
  [DIIdentifiers.GetTodosUseCase]: asFunction(getTodosUseCase),
  [DIIdentifiers.AddTodoUseCase]: asFunction(addTodoUseCase),
  [DIIdentifiers.RemoveTodoUseCase]: asFunction(removeTodoUseCase),
  [DIIdentifiers.CompleteTodoUseCase]: asFunction(completeTodoUseCase),
  [DIIdentifiers.UseTodosListViewModel]: asFunction(useTodosListViewModel),
});

export function DI<T extends DIIdentifiers>(
  indentifier: T
): DIIdentifiersMap[T] {
  return container.resolve(indentifier);
}
```

```tsx
// example using the DI helper

import { DI, DIIdentifiers } from "@/di/di";

export function Component() {
  const { todos } = DI(DIIdentifiers.UseTodosListViewModel);
  console.log(todos)

  return null
}
```

### Breaking down a ViewModel
<div id="breaking-down-a-viewmodel">

Take the following example:

```ts
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
```

The code above implements a react hook that receives the use-cases it needs as parameters, in case these parameters are being injected by the DI helper.

The following code is making a `query (get request)` using the `getTodosUseCase.execute` function. By following this pattern the `request can be decoupled` from the `react-query` library. Also it's important to note that the data that's being return from the API it's not being used directly in the code, it's being transformed by react-query `select callback` using the `todoDTO.fromApi` function, instead.

```ts
const { data: todos } = useQuery({
  queryKey: ["todos"],
  queryFn: getTodosUseCase.execute,
  select: (todos) => todos.map(todoDTO.fromApi),
});
```

Another part of the `ViewModel` implementation is the `mutation (post request)` that's being made to create a new item. Note that the mutation is also using a use-case, in this case `addTodoUseCase.execute` and again `the request is being decoupled` from the `react-query library`.

One thing the pay attention to in this case is that this code is using something called `optimistic UI update`. This is a strategy that `updates the UI before the request to the API succeeds (hence the optimictic)`, and when the request actually finishes and returns the new data the UI is updated again with the actual data from the API. The `onMutate` callback can be used to implement this logic as it runs before that request has finished (check the implementation in the example below). To replace the optimistic data for the actual data from the API the `onSuccess` callback comes into play as it runs only after the request has finished and succeeded. Plus, if the request fails for some reason the `onError` callback can be used to delete the optimistic data from the query data.

After all the steps mentioned above the only thing left to do is to `use the mutation during a user event`, which in this case is a submit form event used to add a new todo the list.

```ts
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
```

The rest of the implementation inside this `ViewModel` is similar to the ones explained above.

