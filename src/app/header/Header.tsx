import { useStream } from "../../shared/hooks/observable-hooks";
import { loadFromStorage } from "../../shared/utils/storage-utils";
import { useApp } from "../AppContext";
import { Route } from "../router/RouterFeature";
import { NavItem, TopBar } from "./HeaderStyles";

export default function Header() {
  const { router } = useApp();
  const route = useStream(router.route, loadFromStorage("route") ?? Route.Home);

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
