import { Button } from "../../AppStyles";
import { useApp } from "../../build-application";

export function AddButton() {
  const { todos } = useApp();

  function handleAdd() {
    todos.add();
  }

  return <Button onClick={handleAdd}>Add todo</Button>;
}
