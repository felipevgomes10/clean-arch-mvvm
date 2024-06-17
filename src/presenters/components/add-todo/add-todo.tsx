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
