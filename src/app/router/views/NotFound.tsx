import { useApp } from "../../AppContext";
import { Button, Container, Title } from "../../AppStyles";
import { Route } from "../RouterFeature";

export function NotFound() {
  const { router } = useApp();
  return (
    <Container>
      <Title>Not found</Title>
      <p>Route was not found.</p>
      <Button onClick={() => router.goTo(Route.Home)}>Go to home</Button>
    </Container>
  );
}
