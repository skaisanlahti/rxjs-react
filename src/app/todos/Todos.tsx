import { useEffect } from "react";
import { useStream } from "../../shared/hooks/observable-hooks";
import { getTodos } from "../../shared/utils/api-utils";
import { Container, Title } from "../AppStyles";
import { AddButton } from "./views/AddButton";
import { LoadButton } from "./views/LoadButton";
import { TodoInputs } from "./views/TodoInputs";
import { TodoList } from "./views/TodoList";

export default function Todos() {
  const data = useStream(getTodos.data(1000));
  useEffect(() => {
    console.log("1", data);
  }, [data]);

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
