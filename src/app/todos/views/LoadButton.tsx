import { useStateSubject } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../AppContext";
import { Button } from "../../AppStyles";

export function LoadButton() {
  const app = useApp();
  const todosLoading = useStateSubject(app.todos.todosLoading);

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
