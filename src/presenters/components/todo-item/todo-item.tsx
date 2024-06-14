import { Trash } from "@phosphor-icons/react";
import styles from "./todo-item.module.css";
import type { TodoItemProps } from "./todo-item.types";

export function TodoItem({ todo, onDelete }: TodoItemProps) {
  return (
    <li className={styles.todoItem}>
      <span className={styles.todoItemText} title={todo.title}>
        {todo.title}
      </span>
      <button
        className={styles.todoItemButton}
        onClick={() => onDelete(todo.id)}
        data-type="delete"
      >
        <Trash size={16} />
      </button>
    </li>
  );
}
