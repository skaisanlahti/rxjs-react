import { useStateSubject } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../App.context";
import { Input } from "../../App.styles";
import { HiddenField } from "../hidden-field/HiddenField.view";

export function TodoInputs() {
  const app = useApp();
  const title = useStateSubject(app.todos.title);
  const description = useStateSubject(app.todos.description);
  const isDelayFieldHidden = useStateSubject(app.hidden.isDelayFieldHidden);

  return (
    <>
      <HiddenField />
      <Input
        onFocus={() => app.todos.isTodoFieldFocused.next(true)}
        onBlur={() => app.todos.isTodoFieldFocused.next(false)}
        autoFocus={isDelayFieldHidden}
        type="text"
        value={title}
        placeholder="Title"
        onChange={(e) => app.todos.title.next(e.target.value)}
      />
      <Input
        onFocus={() => app.todos.isTodoFieldFocused.next(true)}
        onBlur={() => app.todos.isTodoFieldFocused.next(false)}
        type="text"
        value={description}
        placeholder="Description"
        onChange={(e) => app.todos.description.next(e.target.value)}
      />
    </>
  );
}
