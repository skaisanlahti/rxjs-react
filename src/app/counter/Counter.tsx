import { useStream } from "../../shared/hooks/observable-hooks";
import { useApp } from "../AppContext";
import { Button, Container, Title } from "../AppStyles";

export default function Counter() {
  const { counter } = useApp();
  const value = useStream(counter.count, 0);
  const double = useStream(counter.double, 0);

  return (
    <Container>
      <Title>Counter</Title>
      <p>Count: {value}</p>
      <p>Double: {double}</p>
      <div>
        <Button
          onClick={() => {
            counter.inc();
          }}
        >
          +
        </Button>
        <Button onClick={() => counter.dec()}>-</Button>
      </div>
    </Container>
  );
}
