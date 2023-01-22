import { useApp } from "../../App.context";
import { Container, Title, Button } from "../../App.styles";
import { Route } from "../Router.core";

export function NotFound() {
  const app = useApp();
  return (
    <Container>
      <Title>Not found</Title>
      <p>Route was not found.</p>
      <Button onClick={() => app.router.changeRoute.next(Route.Home)}>
        Go to home
      </Button>
    </Container>
  );
}
