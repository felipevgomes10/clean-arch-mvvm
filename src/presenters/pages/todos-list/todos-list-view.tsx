import { DI, DIIdentifiers } from "@/di/di";
import { AddTodo } from "@/presenters/components/add-todo/add-todo";
import { Loading } from "@/presenters/components/loading/loading";
import { TodosList } from "@/presenters/components/todos-list/todos-list";
import styles from "./todos-list-view.module.css";

export function TodosListView() {
  const { todos, createTodo } = DI(DIIdentifiers.UseTodosListViewModel);

  if (!todos) return <Loading />;

  return (
    <div className={styles.todosListView}>
      <TodosList todos={todos} />
      <AddTodo createTodo={createTodo} />
    </div>
  );
}
