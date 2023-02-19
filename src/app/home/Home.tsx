import { Button, Container, Title } from "../AppStyles";
import { useApp } from "../build-application";
import { Route } from "../router/router-feature";

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
            router.goTo(Route.Remote);
          }}
        >
          Remote Todos
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
