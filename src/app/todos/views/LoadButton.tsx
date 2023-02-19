import { useStream } from "../../../shared/hooks/observable-hooks";
import { Button } from "../../AppStyles";
import { useApp } from "../../build-application";

export function LoadButton() {
  const { todos } = useApp();

  function handleReset() {
    todos.reset();
  }

  return <Button onClick={handleReset}>Reset</Button>;
}

export function RemoteLoadButton() {
  const { remoteTodos } = useApp();
  const loading = useStream(remoteTodos.loading);

  function handleReset() {
    remoteTodos.reset().subscribe(() => console.log("Reset side effect"));
  }

  return (
    <Button disabled={loading} onClick={handleReset}>
      Reset
    </Button>
  );
}
