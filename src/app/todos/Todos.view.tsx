import { useStream } from "../../shared/hooks/useObservableState";
import { Todo } from "../../shared/models/Todo";
import { useApp } from "../App.context";
import {
  Button,
  Card,
  Check,
  Container,
  Description,
  Input,
  Part,
  TextPart,
  Title,
  TodoHeading,
} from "../App.styles";

export default function Todos() {
  return (
    <Container>
      <Title>To do list</Title>
      <div>
        <AddTodo />
        <AddButton />
        <LoadButton />
        <TodoList />
      </div>
    </Container>
  );
}

export function LoadButton() {
  const app = useApp();
  const todosLoading = useStream(app.todos.todosLoading);

  return (
    <Button
      disabled={todosLoading}
      onClick={() => {
        app.todos.resetTodos.next();
      }}
    >
      Load
    </Button>
  );
}

export function TodoList() {
  const app = useApp();
  const { data: todos } = useStream(app.todos.getTodosData);

  return (
    <>
      {todos?.map((item) => (
        <TodoCard key={item.id} item={item} />
      ))}
    </>
  );
}

export function TodoCard({ item }: { item: Todo }) {
  const app = useApp();
  const deleteLoading = useStream(app.todos.deleteTodoData, (s) => s.isLoading);
  const checkLoading = useStream(app.todos.checkTodoData, (s) => s.isLoading);

  return (
    <Card
      onClick={() => {
        if (!checkLoading) {
          app.todos.checkTodo.next({ id: item.id });
        }
      }}
    >
      <Check>
        <div
          style={{
            width: "20px",
            height: "20px",
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
          disabled={deleteLoading}
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

export function AddTodo() {
  const app = useApp();
  const title = useStream(app.todos.title);
  const description = useStream(app.todos.description);

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

export function AddButton() {
  const app = useApp();
  const isLoading = useStream(app.todos.addTodoData, (s) => s.isLoading);
  const title = useStream(app.todos.title);
  const description = useStream(app.todos.description);

  return (
    <>
      <Button
        disabled={isLoading}
        onClick={() => {
          app.todos.addTodo.next({ title, description });
        }}
      >
        Add todo
      </Button>
    </>
  );
}
