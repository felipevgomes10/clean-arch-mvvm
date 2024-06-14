import { Check, Trash } from "@phosphor-icons/react";
import styles from "./todo-item.module.css";
import type { TodoItemProps } from "./todo-item.types";

export function TodoItem({
  todo,
  onDeleteTodo,
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
        onClick={() => onDeleteTodo(todo.id)}
        data-type="delete"
      >
        <Trash size={16} />
      </button>
    </li>
  );
}
