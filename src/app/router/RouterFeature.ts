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

export type IRouterStreams = ReturnType<typeof RouterStreams>;

export function RouterStreams() {
  return {
    route: new BehaviorSubject<Route>(loadFromStorage("route") ?? Route.Home),
    changeRoute: new Subject<Route>(),
  };
}

function ChangeRouteHandler(
  changeRoute: Subject<Route>,
  route: BehaviorSubject<Route>
) {
  return changeRoute.pipe(tap((nextRoute) => route.next(nextRoute)));
}

function RouteHandler(route: BehaviorSubject<Route>) {
  return route.pipe(
    tap((currentRoute) => {
      saveToStorage("route", currentRoute);
    })
  );
}

export function RouterHandler(streams: IRouterStreams) {
  return merge(
    ChangeRouteHandler(streams.changeRoute, streams.route),
    RouteHandler(streams.route)
  );
}

export type IRouterHandler = ReturnType<typeof RouterHandler>;

export function RouterFacade(streams: IRouterStreams) {
  return {
    route: streams.route.asObservable(),
    goTo: (route: Route) => {
      streams.changeRoute.next(route);
    },
  };
}

export function buildRouter() {
  const routerStreams = RouterStreams();
  return {
    routerStreams,
    routerFacade: RouterFacade(routerStreams),
    routerHandler: RouterHandler(routerStreams),
  };
}
