import { useStream } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../App.context";
import { Button } from "../../App.styles";

export function AddButton() {
  const app = useApp();
  const isProcessing = useStream(app.todos.addTodoData, (s) => s.isLoading);
  const title = useStream(app.todos.title);
  const description = useStream(app.todos.description);

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
