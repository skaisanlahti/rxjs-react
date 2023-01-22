import { useStateSubject } from "../../shared/hooks/observable-hooks";
import { useApp } from "../App.context";
import { Route } from "../router/Router.core";
import { NavItem, TopBar } from "./Header.styles";

export default function Header() {
  const app = useApp();
  const route = useStateSubject(app.router.route);

  return (
    <TopBar>
      <NavItem
        selected={route === Route.Home}
        disabled={route === Route.Home}
        onClick={() => {
          app.router.changeRoute.next(Route.Home);
        }}
      >
        Home
      </NavItem>
      <NavItem
        selected={route === Route.Todos}
        disabled={route === Route.Todos}
        onClick={() => {
          app.router.changeRoute.next(Route.Todos);
        }}
      >
        Todos
      </NavItem>
      <NavItem
        selected={route === Route.Counter}
        disabled={route === Route.Counter}
        onClick={() => {
          app.router.changeRoute.next(Route.Counter);
        }}
      >
        Counter
      </NavItem>
    </TopBar>
  );
}
