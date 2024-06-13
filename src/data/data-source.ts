import type { DataSource } from "@/domain/data/data-source.types";
import type { Todo } from "@/domain/model/todo/todo.types";

export function dataSource(): DataSource {
  const getTodos = async () => {
    return fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((todos) => todos.slice(0, 10));
  };

  const getTodo = async (id: string) => {
    return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`).then(
      (response) => response.json()
    );
  };

  const addTodo = async (todo: Todo) => {
    return fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((response) => response.json());
  };

  const removeTodo = async (id: string) => {
    return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "DELETE",
    }).then((response) => response.json());
  };

  const updateTodo = async (id: string) => {
    return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: true }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((response) => response.json());
  };

  return {
    getTodos,
    getTodo,
    addTodo,
    removeTodo,
    updateTodo,
  };
}
