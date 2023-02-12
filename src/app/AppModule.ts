import { buildMainHandler } from "./MainHandler";
import { buildCounter } from "./counter/CounterFeature";
import { buildRouter } from "./router/RouterFeature";
import { buildTodos } from "./todos/TodosFeature";
import ApiModule from "./todos/api-mock/ApiModule";

export function buildApplication() {
  // data access
  const api = ApiModule();

  // application layer
  const { counterFacade, counterHandler } = buildCounter();
  const { routerFacade, routerHandler, routerStreams } = buildRouter();
  const { todosFacade, todosHandler } = buildTodos();

  // application logic runner
  buildMainHandler(
    routerStreams.route, // main handler uses current route as switch for activating handlers
    routerHandler,
    todosHandler,
    counterHandler
  ).subscribe();

  // component facade for UI consumption
  return {
    router: routerFacade,
    counter: counterFacade,
    todos: todosFacade,
    api,
  };
}

export type Application = ReturnType<typeof buildApplication>;
