import { BehaviorSubject, Subject } from "rxjs";
import { loadFromStorageToState } from "../../shared/utils/storage";
import { Route } from "./Router.core";

export type RouterModuleType = ReturnType<typeof RouterModule>;

interface Dependencies {}

export default function RouterModule({}: Dependencies = {}) {
  const route = new BehaviorSubject<Route>(Route.Home);
  loadFromStorageToState("route", route);
  return {
    route,
    changeRoute: new Subject<Route>(),
  };
}
