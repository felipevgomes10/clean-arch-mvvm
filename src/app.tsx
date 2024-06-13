import { QueryClientProvider } from "@tanstack/react-query";
import styles from "./app.module.css";
import { queryClient } from "./lib/react-query/client";
import { TodosListView } from "./presenters/pages/todos-list/todos-list-view";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.app}>
        <TodosListView />
      </div>
    </QueryClientProvider>
  );
}
