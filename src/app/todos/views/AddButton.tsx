import { useStream } from "../../../shared/hooks/observable-hooks";
import { Button } from "../../AppStyles";
import { useApp } from "../../build-application";

export function AddButton() {
  const { todos } = useApp();

  function handleAdd() {
    todos.add();
  }

  return <Button onClick={handleAdd}>Add todo</Button>;
}

export function RemoteAddButton() {
  const { remoteTodos } = useApp();
  const loading = useStream(remoteTodos.loading);

  function handleAdd() {
    remoteTodos.add().subscribe(() => console.log("Add side effect"));
  }

  return (
    <Button disabled={loading} onClick={handleAdd}>
      Add todo
    </Button>
  );
}
