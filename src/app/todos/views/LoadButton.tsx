import { useSubscribe } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../AppContext";
import { Button } from "../../AppStyles";

export function LoadButton() {
  const app = useApp();
  const todosLoading = useSubscribe(app.todos.todosLoading);

  return (
    <Button
      disabled={todosLoading}
      onClick={() => {
        app.todos.reset.send().subscribe();
      }}
    >
      Load
    </Button>
  );
}
