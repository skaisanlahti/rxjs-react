import { Container, Title } from "../AppStyles";
import { AddButton } from "./views/AddButton";
import { LoadButton } from "./views/LoadButton";
import { TodoInputs } from "./views/TodoInputs";
import { TodoList } from "./views/TodoList";

export default function Todos() {
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
