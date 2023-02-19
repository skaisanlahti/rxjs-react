import { tap } from "rxjs";
import { State } from "../../shared/utils/renaming";
import {
  loadFromStorage,
  saveToStorage,
} from "../../shared/utils/storage-utils";
import Counter from "../counter/Counter";
import Home from "../home/Home";
import RemoteTodos from "../todos/RemoteTodos";
import Todos from "../todos/Todos";

export enum Route {
  Home = "home",
  Todos = "todos",
  Counter = "counter",
  Remote = "remote",
}

export const routes = new Map<Route, React.FC>();

routes.set(Route.Home, Home);
routes.set(Route.Counter, Counter);
routes.set(Route.Todos, Todos);
routes.set(Route.Remote, RemoteTodos);

export function getInitialRoute(): Route {
  return loadFromStorage("route") ?? Route.Home;
}

export function RouterModule() {
  const route = new State<Route>(getInitialRoute());

  const saveRoute = route.pipe(
    tap((currentRoute) => {
      saveToStorage("route", currentRoute);
    })
  );

  saveRoute.subscribe();

  return {
    route: route.asObservable(),
    goTo(destination: Route) {
      route.next(destination);
    },
  };
}
export type Router = ReturnType<typeof RouterModule>;
