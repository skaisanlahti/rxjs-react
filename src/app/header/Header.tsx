import { useStream } from "../../shared/hooks/observable-hooks";
import { useApp } from "../build-application";
import { Route, getInitialRoute } from "../router/router-feature";
import { NavItem, TopBar } from "./HeaderStyles";

export default function Header() {
  const { router } = useApp();
  const route = useStream(router.route, getInitialRoute());

  return (
    <TopBar>
      <NavItem
        selected={route === Route.Home}
        disabled={route === Route.Home}
        onClick={() => {
          router.goTo(Route.Home);
        }}
      >
        Home
      </NavItem>
      <NavItem
        selected={route === Route.Todos}
        disabled={route === Route.Todos}
        onClick={() => {
          router.goTo(Route.Todos);
        }}
      >
        Todos
      </NavItem>
      <NavItem
        selected={route === Route.Remote}
        disabled={route === Route.Remote}
        onClick={() => {
          router.goTo(Route.Remote);
        }}
      >
        Remote Todos
      </NavItem>
      <NavItem
        selected={route === Route.Counter}
        disabled={route === Route.Counter}
        onClick={() => {
          router.goTo(Route.Counter);
        }}
      >
        Counter
      </NavItem>
    </TopBar>
  );
}
