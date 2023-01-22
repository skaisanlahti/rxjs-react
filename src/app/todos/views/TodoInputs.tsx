import { useStateSubject } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../App.context";
import { Input } from "../../App.styles";

export function TodoInputs() {
  const app = useApp();
  const title = useStateSubject(app.todos.title);
  const description = useStateSubject(app.todos.description);

  return (
    <>
      <Input
        type="text"
        value={title}
        placeholder="Title"
        onChange={(e) => app.todos.title.next(e.target.value)}
      />
      <Input
        type="text"
        value={description}
        placeholder="Description"
        onChange={(e) => app.todos.description.next(e.target.value)}
      />
    </>
  );
}
