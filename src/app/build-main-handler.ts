import { BehaviorSubject, merge, switchMap } from "rxjs";
import { CountTodosHandler } from "./count-todos/build-count-todos-handler";
import { CounterHandler } from "./counter/counter-feature";
import { Route, RouterHandler } from "./router/router-feature";

export function buildMainHandler(
  route: BehaviorSubject<Route>,
  routerHandler: RouterHandler,
  counterHandler: CounterHandler,
  countTodosHandler: CountTodosHandler
) {
  const commonHandler = merge(routerHandler);
  return route.pipe(
    // only subscribe to one event handling stream whenever route changes
    switchMap((route) => {
      switch (route) {
        case Route.Todos: {
          // handling todos, counter and count todos
          return merge(commonHandler, countTodosHandler);
        }
        case Route.Counter: {
          // handling only counter
          return merge(commonHandler, counterHandler);
        }
        default:
          // always handling common events
          return commonHandler;
      }
    })
  );
}
