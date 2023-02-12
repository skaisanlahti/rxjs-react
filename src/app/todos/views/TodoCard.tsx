import { useApp } from "../../AppContext";
import {
  Button,
  Card,
  Check,
  Description,
  Part,
  TextPart,
  TodoHeading,
} from "../../AppStyles";
import { Todo } from "../TodosFeature";

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
