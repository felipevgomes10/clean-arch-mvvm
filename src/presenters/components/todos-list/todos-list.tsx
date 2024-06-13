import type { Todo } from "@/domain/model/todo/todo.types";
import styles from "./todos-list.module.css";

export function TodosList({ todos }: { todos: Todo[] }) {
  return (
    <ul className={styles.list}>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
