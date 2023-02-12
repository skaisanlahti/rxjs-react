import { useStream } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../AppContext";
import { Input } from "../../AppStyles";

export function TodoInputs() {
  const { todos } = useApp();
  const title = useStream(todos.title, "");
  const description = useStream(todos.description, "");

  function handleTitle(e: React.ChangeEvent<HTMLInputElement>) {
    todos.setTitle(e.target.value);
  }

  function handleDescription(e: React.ChangeEvent<HTMLInputElement>) {
    todos.setDescription(e.target.value);
  }

  return (
    <>
      <Input
        type="text"
        value={title}
        placeholder="Title"
        onChange={handleTitle}
      />
      <Input
        type="text"
        value={description}
        placeholder="Description"
        onChange={handleDescription}
      />
    </>
  );
}
