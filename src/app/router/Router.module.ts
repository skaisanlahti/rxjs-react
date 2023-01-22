import { BehaviorSubject, Subject } from "rxjs";
import { loadFromStorageToState } from "../../shared/utils/storage";
import { Route } from "./Router.core";

export type RouterModuleType = ReturnType<typeof RouterModule>;

interface Dependencies {}

export default function RouterModule({}: Dependencies = {}) {
  const route = new BehaviorSubject<Route>(Route.Home);
  const changeRoute = new Subject<Route>();

  loadFromStorageToState("route", route);

  return {
    route,
    changeRoute,
  };
}
