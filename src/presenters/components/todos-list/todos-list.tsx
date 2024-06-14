import { TodoItem } from "../todo-item/todo-item";
import styles from "./todos-list.module.css";
import type { TodosListProps } from "./todos-list.types";

export function TodosList({ todos, onDeleteTodo }: TodosListProps) {
  return (
    <ul className={styles.list}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onDeleteTodo={onDeleteTodo} />
      ))}
    </ul>
  );
}
