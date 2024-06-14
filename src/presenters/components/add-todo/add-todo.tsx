import { useTodosListViewModel } from "@/presenters/pages/todos-list/todos-list-viewmodel";
import styles from "./add-todo.module.css";

type AddTodoProps = {
  onCreateTodo: ReturnType<typeof useTodosListViewModel>["onCreateTodo"];
};

export function AddTodo({ onCreateTodo }: AddTodoProps) {
  return (
    <form onSubmit={onCreateTodo} className={styles.container}>
      <input name="todo-title" className={styles.input} required />
      <button type="submit" className={styles.button}>
        Add
      </button>
    </form>
  );
}
