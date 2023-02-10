import { useEffect } from "react";
import { useApp } from "../AppContext";
import { Container, Title } from "../AppStyles";
import { AddButton } from "./views/AddButton";
import { LoadButton } from "./views/LoadButton";
import { TodoInputs } from "./views/TodoInputs";
import { TodoList } from "./views/TodoList";

export default function Todos() {
  const app = useApp();

  useEffect(() => {
    app.todos.get.send().subscribe();
    const disableToggle = app.startHiddenFieldEvents();
    return () => disableToggle();
  }, []);

  return (
    <Container>
      <Title>To do list</Title>
      <div>
        <TodoInputs />
        <AddButton />
        <LoadButton />
        <TodoList />
      </div>
    </Container>
  );
}
