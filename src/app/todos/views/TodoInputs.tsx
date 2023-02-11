import { useSubscribe } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../AppContext";
import { Input } from "../../AppStyles";
import { HiddenField } from "../hidden-field/HiddenField";

export function TodoInputs() {
  const app = useApp();
  const title = useSubscribe(app.todos.title);
  const description = useSubscribe(app.todos.description);
  const isDelayFieldHidden = useSubscribe(app.hidden.isDelayFieldHidden);

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
