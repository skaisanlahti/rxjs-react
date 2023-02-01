import { useStateSubject } from "../../../shared/hooks/observable-hooks";
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
import { Todo } from "../TodosCore";

export function TodoCard({ item }: { item: Todo }) {
  const app = useApp();
  const isDeleting = useStateSubject(app.todos.remove, (s) => s.isLoading);
  const isChecking = useStateSubject(app.todos.check, (s) => s.isLoading);

  return (
    <Card
      onClick={() => {
        if (!isChecking) {
          app.todos.check.send({ id: item.id });
        }
      }}
    >
      <Check>
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: "1px solid hsla(0,100%,100%,0.4)",
            backgroundColor: item.done ? "green" : "red",
          }}
        />
      </Check>
      <TextPart>
        <TodoHeading>{item.title}</TodoHeading>
        <Description>{item.description}</Description>
      </TextPart>
      <Part>
        <Button
          disabled={isDeleting}
          onClick={(e) => {
            e.stopPropagation();
            app.todos.remove.send({ id: item.id });
          }}
        >
          Remove
        </Button>
      </Part>
    </Card>
  );
}
