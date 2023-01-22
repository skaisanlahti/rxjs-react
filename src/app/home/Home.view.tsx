import { useApp } from "../App.context";
import { Container, Title, Button } from "../App.styles";
import { Route } from "../router/Router.core";

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
