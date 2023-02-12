import { BehaviorSubject, Subject, merge, tap } from "rxjs";
import {
  loadFromStorage,
  saveToStorage,
} from "../../shared/utils/storage-utils";
import Counter from "../counter/Counter";
import Home from "../home/Home";
import Todos from "../todos/Todos";

export enum Route {
  Home = "home",
  Todos = "todos",
  Counter = "counter",
}

export const routes = new Map<Route, React.FC>();

routes.set(Route.Home, Home);
routes.set(Route.Counter, Counter);
routes.set(Route.Todos, Todos);

export function getInitialRoute(): Route {
  return loadFromStorage("route") ?? Route.Home;
}

export type RouterStreams = ReturnType<typeof buildRouterStreams>;

export function buildRouterStreams() {
  return {
    route: new BehaviorSubject<Route>(getInitialRoute()),
    changeRoute: new Subject<Route>(),
  };
}

function buildChangeRouteHandler(
  changeRoute: Subject<Route>,
  route: BehaviorSubject<Route>
) {
  return changeRoute.pipe(tap((nextRoute) => route.next(nextRoute)));
}

function buildRouteHandler(route: BehaviorSubject<Route>) {
  return route.pipe(
    tap((currentRoute) => {
      saveToStorage("route", currentRoute);
    })
  );
}

export function buildRouterHandler(streams: RouterStreams) {
  return merge(
    buildChangeRouteHandler(streams.changeRoute, streams.route),
    buildRouteHandler(streams.route)
  );
}

export type RouterHandler = ReturnType<typeof buildRouterHandler>;

export function buildRouterFacade(streams: RouterStreams) {
  return {
    route: streams.route.asObservable(),
    goTo: (route: Route) => {
      streams.changeRoute.next(route);
    },
  };
}

export function buildRouter() {
  const routerStreams = buildRouterStreams();
  return {
    routerStreams,
    routerFacade: buildRouterFacade(routerStreams),
    routerHandler: buildRouterHandler(routerStreams),
  };
}
