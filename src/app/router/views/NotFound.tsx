import { useApp } from "../../AppContext";
import { Button, Container, Title } from "../../AppStyles";
import { Route } from "../RouterCore";

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
