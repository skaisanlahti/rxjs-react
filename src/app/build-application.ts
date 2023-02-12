import { createCtx } from "../shared/hooks/createCtx";
import { buildMainHandler } from "./build-main-handler";
import { buildCountTodosHandler } from "./count-todos/build-count-todos-handler";
import { buildCounter } from "./counter/counter-feature";
import { buildRouter } from "./router/router-feature";
import ApiModule from "./todos/api-mock/ApiModule";
import { buildTodos } from "./todos/todos-feature";

export function buildApplication() {
  // TODO: improve data access pattern
  const api = ApiModule();

  // application layer
  const { counterFacade, counterHandler, counterStreams } = buildCounter();
  const { routerFacade, routerHandler, routerStreams } = buildRouter();
  const { todosFacade, todosHandler, todoStreams } = buildTodos();

  // composite handler
  const countTodosHandler = buildCountTodosHandler(
    counterStreams,
    todoStreams,
    // dependencies
    { todosHandler, counterHandler }
  );

  // application logic runner
  const mainHandler = buildMainHandler(
    // main handler uses current route as switch for activating handlers
    routerStreams.route,
    routerHandler,
    counterHandler,
    countTodosHandler
  );

  // start handling events
  mainHandler.subscribe();

  // component facade for UI consumption
  return {
    router: routerFacade,
    counter: counterFacade,
    todos: todosFacade,
    api,
  };
}

export type Application = ReturnType<typeof buildApplication>;

export const [useApp, AppProvider] = createCtx<Application>();
