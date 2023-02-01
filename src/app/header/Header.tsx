import { useStateSubject } from "../../shared/hooks/observable-hooks";
import { useApp } from "../AppContext";
import { Route } from "../router/RouterCore";
import { NavItem, TopBar } from "./HeaderStyles";

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
