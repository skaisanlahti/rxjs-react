import { useApp } from "../AppContext";
import { Button, Container, Title } from "../AppStyles";
import { Route } from "../router/RouterCore";

export default function Home() {
  const app = useApp();
  return (
    <Container>
      <Title>Home</Title>
      <div>
        <Button
          onClick={() => {
            app.router.changeRoute.next(Route.Todos);
          }}
        >
          Todos
        </Button>
        <Button
          onClick={() => {
            app.router.changeRoute.next(Route.Counter);
          }}
        >
          Counter
        </Button>
      </div>
    </Container>
  );
}
