import { useApp } from "../../AppContext";
import { Button } from "../../AppStyles";

export function LoadButton() {
  const { todos } = useApp();

  function handleReset() {
    todos.reset();
  }

  return <Button onClick={handleReset}>Reset</Button>;
}
