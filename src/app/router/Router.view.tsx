import { useStream } from "../../shared/hooks/useObservableState";
import { useApp } from "../App.context";
import { Button, Container, Title } from "../App.styles";
import { Route, routes } from "./Router.core";

interface Props {}
export default function Router({}: Props = {}) {
  const app = useApp();
  const route = useStream(app.router.route);

  const View = routes.get(route);
  if (!View) return <NotFound />;
  return <View />;
}

function NotFound() {
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