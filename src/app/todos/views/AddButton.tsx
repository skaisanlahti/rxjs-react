import { useStateSubject } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../AppContext";
import { Button } from "../../AppStyles";

export function AddButton() {
  const app = useApp();
  const title = useStateSubject(app.todos.title);
  const description = useStateSubject(app.todos.description);
  const isProcessing = useStateSubject(app.todos.add, (s) => s.isLoading);

  return (
    <>
      <Button
        disabled={isProcessing}
        onClick={() => {
          app.todos.add.send({ title, description });
        }}
      >
        Add todo
      </Button>
    </>
  );
}
