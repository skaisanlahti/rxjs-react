import { BehaviorSubject, merge, switchMap } from "rxjs";
import { ICounterHandler } from "./counter/CounterFeature";
import { IRouterHandler, Route } from "./router/RouterFeature";
import { ITodosHandler } from "./todos/TodosFeature";

export function buildMainHandler(
  route: BehaviorSubject<Route>,
  routerHandler: IRouterHandler,
  todoHandler: ITodosHandler,
  counterHandler: ICounterHandler
) {
  return route.pipe(
    switchMap((route) => {
      const commonHandler = merge(routerHandler);
      switch (route) {
        case Route.Todos: {
          return merge(commonHandler, todoHandler);
        }
        case Route.Counter: {
          return merge(commonHandler, counterHandler);
        }
        default:
          return commonHandler;
      }
    })
  );
}
