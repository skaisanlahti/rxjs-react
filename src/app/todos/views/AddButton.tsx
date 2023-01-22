import { useStateSubject } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../App.context";
import { Button } from "../../App.styles";

export function AddButton() {
  const app = useApp();
  const isProcessing = useStateSubject(
    app.todos.addTodoData,
    (s) => s.isLoading
  );
  const title = useStateSubject(app.todos.title);
  const description = useStateSubject(app.todos.description);

  return (
    <>
      <Button
        disabled={isProcessing}
        onClick={() => {
          app.todos.addTodo.next({ title, description });
        }}
      >
        Add todo
      </Button>
    </>
  );
}
