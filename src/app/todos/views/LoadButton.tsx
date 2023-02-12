import { Button } from "../../AppStyles";
import { useApp } from "../../build-application";

export function LoadButton() {
  const { todos } = useApp();

  function handleReset() {
    todos.reset();
  }

  return <Button onClick={handleReset}>Reset</Button>;
}
