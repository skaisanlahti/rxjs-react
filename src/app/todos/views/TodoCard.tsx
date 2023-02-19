import { useStream } from "../../../shared/hooks/observable-hooks";
import {
  Button,
  Card,
  Check,
  Description,
  Part,
  TextPart,
  TodoHeading,
} from "../../AppStyles";
import { useApp } from "../../build-application";
import { Todo } from "../todos-feature";

export function TodoCard({ item }: { item: Todo }) {
  const { todos } = useApp();

  function handleCheck() {
    todos.check(item.id);
  }

  function handleRemove(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    todos.remove(item.id);
  }

  return (
    <Card onClick={handleCheck}>
      <Check>
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: "1px solid hsla(0,100%,100%,0.4)",
            backgroundColor: item.isDone ? "green" : "red",
          }}
        />
      </Check>
      <TextPart>
        <TodoHeading>{item.title}</TodoHeading>
        <Description>{item.description}</Description>
      </TextPart>
      <Part>
        <Button onClick={handleRemove}>Remove</Button>
      </Part>
    </Card>
  );
}

export function RemoteTodoCard({ item }: { item: Todo }) {
  const { remoteTodos } = useApp();
  const loading = useStream(remoteTodos.loading, false);

  function handleCheck() {
    remoteTodos.check(item.id).subscribe(() => {
      console.log("Check side effect");
    });
  }

  function handleRemove(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation(); // prevents handleCheck from running
    remoteTodos
      .remove(item.id)
      .subscribe(() => console.log("Remove side effect"));
  }

  return (
    <Card onClick={handleCheck}>
      <Check>
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: "1px solid hsla(0,100%,100%,0.4)",
            backgroundColor: item.isDone ? "green" : "red",
          }}
        />
      </Check>
      <TextPart>
        <TodoHeading>{item.title}</TodoHeading>
        <Description>{item.description}</Description>
      </TextPart>
      <Part>
        <Button disabled={loading} onClick={handleRemove}>
          Remove
        </Button>
      </Part>
    </Card>
  );
}
