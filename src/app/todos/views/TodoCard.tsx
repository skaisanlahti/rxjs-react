import { useStream } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../App.context";
import {
  Button,
  Card,
  Check,
  Description,
  Part,
  TextPart,
  TodoHeading,
} from "../../App.styles";
import { Todo } from "../Todos.core";

export function TodoCard({ item }: { item: Todo }) {
  const app = useApp();
  const isDeleting = useStream(app.todos.deleteTodoData, (s) => s.isLoading);
  const isChecking = useStream(app.todos.checkTodoData, (s) => s.isLoading);

  return (
    <Card
      onClick={() => {
        if (!isChecking) {
          app.todos.checkTodo.next({ id: item.id });
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
            app.todos.deleteTodo.next({ id: item.id });
          }}
        >
          Remove
        </Button>
      </Part>
    </Card>
  );
}
