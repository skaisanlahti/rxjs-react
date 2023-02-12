import { useApp } from "../../AppContext";
import { Button } from "../../AppStyles";

export function AddButton() {
  const { todos } = useApp();

  function handleAdd() {
    todos.add();
  }

  return <Button onClick={handleAdd}>Add todo</Button>;
}
