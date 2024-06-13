export type TodoDTO = {
  id: string;
  title: string;
  completed: boolean;
};

function fromApi(todo: TodoDTO): TodoDTO {
  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
  };
}

function toApi(todo: TodoDTO): TodoDTO {
  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
  };
}

export const todoDTO = { fromApi, toApi };
