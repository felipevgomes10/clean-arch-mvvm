import { useTodosListViewModel } from "@/presenters/pages/todos-list/todos-list-viewmodel";
import styles from "./add-todo.module.css";

type AddTodoProps = {
  createTodo: ReturnType<typeof useTodosListViewModel>["createTodo"];
};

export function AddTodo({ createTodo }: AddTodoProps) {
  return (
    <form onSubmit={createTodo} className={styles.container}>
      <input name="todo-title" className={styles.input} required />
      <button type="submit" className={styles.button}>
        Add
      </button>
    </form>
  );
}
