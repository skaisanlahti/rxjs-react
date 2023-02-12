import { useApp } from "../AppContext";
import { Button, Container, Title } from "../AppStyles";
import { Route } from "../router/RouterFeature";

export default function Home() {
  const { router } = useApp();
  return (
    <Container>
      <Title>Home</Title>
      <div>
        <Button
          onClick={() => {
            router.goTo(Route.Todos);
          }}
        >
          Todos
        </Button>
        <Button
          onClick={() => {
            router.goTo(Route.Counter);
          }}
        >
          Counter
        </Button>
      </div>
    </Container>
  );
}
