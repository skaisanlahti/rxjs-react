import { useStream } from "../../shared/hooks/observable-hooks";
import { Button, Container, Title } from "../AppStyles";
import { useApp } from "../build-application";

export default function Counter() {
  const { counter } = useApp();
  const value = useStream(counter.count, 0);
  const double = useStream(counter.double, 0);

  function handleIncrement() {
    counter.increment(1);
  }

  function handleDecrement() {
    counter.decrement(1);
  }

  return (
    <Container>
      <Title>Counter</Title>
      <p>Count: {value}</p>
      <p>Double: {double}</p>
      <div>
        <Button onClick={handleIncrement}>+</Button>
        <Button onClick={handleDecrement}>-</Button>
      </div>
    </Container>
  );
}
