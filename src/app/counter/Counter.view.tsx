import { useStream } from "../../shared/hooks/useObservableState";
import { useApp } from "../App.context";
import { Button, Container, Title } from "../App.styles";

export default function Counter() {
  const app = useApp();
  const count = useStream(app.counter.count, (s) => s.value);

  return (
    <Container>
      <Title>Counter</Title>
      <p>Count: {count}</p>
      <div>
        <Button onClick={() => app.counter.increment.next()}>Inc</Button>
        <Button onClick={() => app.counter.decrement.next()}>Dec</Button>
      </div>
    </Container>
  );
}