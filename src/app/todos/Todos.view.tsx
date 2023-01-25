import { useEffect } from "react";
import { useApp } from "../App.context";
import { Container, Title } from "../App.styles";
import { AddButton } from "./views/AddButton";
import { LoadButton } from "./views/LoadButton";
import { TodoInputs } from "./views/TodoInputs";
import { TodoList } from "./views/TodoList";

export default function Todos() {
  const app = useApp();

  useEffect(() => {
    const disableToggle = app.enableToggle();
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
