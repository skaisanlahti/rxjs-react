import { useSubscribe } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../AppContext";
import { Button } from "../../AppStyles";

export function AddButton() {
  const app = useApp();
  const title = useSubscribe(app.todos.title);
  const description = useSubscribe(app.todos.description);
  const isProcessing = useSubscribe(app.todos.add, (s) => s.isLoading);

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
