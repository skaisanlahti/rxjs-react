import { useStateSubject } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../App.context";
import { Button } from "../../App.styles";

export function AddButton() {
  const app = useApp();
  const title = useStateSubject(app.todos.title);
  const description = useStateSubject(app.todos.description);
  const isProcessing = useStateSubject(
    app.todos.addRequest,
    (s) => s.isLoading
  );

  return (
    <>
      <Button
        disabled={isProcessing}
        onClick={() => {
          app.todos.add.next({ title, description });
        }}
      >
        Add todo
      </Button>
    </>
  );
}
