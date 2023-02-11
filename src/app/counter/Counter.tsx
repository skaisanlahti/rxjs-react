import { useSubscribe } from "../../shared/hooks/observable-hooks";
import { useApp } from "../AppContext";
import { Button, Container, Title } from "../AppStyles";

export default function Counter() {
  const app = useApp();
  const count = useSubscribe(app.counter.count, (s) => s.value);

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
