import { useStream } from "../../../shared/hooks/observable-hooks";
import { Input } from "../../AppStyles";
import { useApp } from "../../build-application";

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

export function RemoteTodoInputs() {
  const { remoteTodos } = useApp();
  const title = useStream(remoteTodos.title, "");
  const description = useStream(remoteTodos.description, "");

  function handleTitle(e: React.ChangeEvent<HTMLInputElement>) {
    remoteTodos.setTitle(e.target.value);
  }

  function handleDescription(e: React.ChangeEvent<HTMLInputElement>) {
    remoteTodos.setDescription(e.target.value);
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
