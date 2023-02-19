import { Container, Title } from "../AppStyles";
import { RemoteAddButton } from "./views/AddButton";
import { RemoteLoadButton } from "./views/LoadButton";
import { RemoteTodoInputs } from "./views/TodoInputs";
import { RemoteTodoList } from "./views/TodoList";

export default function RemoteTodos() {
  return (
    <Container>
      <Title>Remote to do list</Title>
      <div>
        <RemoteTodoInputs />
        <RemoteAddButton />
        <RemoteLoadButton />
        <RemoteTodoList />
      </div>
    </Container>
  );
}
