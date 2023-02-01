import { useStateSubject } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../App.context";
import { Button } from "../../App.styles";

export function LoadButton() {
  const app = useApp();
  const todosLoading = useStateSubject(app.todos.todosLoading);

  return (
    <Button
      disabled={todosLoading}
      onClick={() => {
        app.todos.reset.send();
      }}
    >
      Load
    </Button>
  );
}
