import ApiModule from "../shared/Api.mock";
import CounterTodosHandler from "../shared/handlers/CounterTodos.handler";
import { startAll } from "../shared/utils/startAll";
import CounterHandler from "./counter/Counter.handler";
import CounterModule from "./counter/Counter.module";
import RouterHandler from "./router/Router.handler";
import RouterModule from "./router/Router.module";
import TodoHandler from "./todos/Todos.handler";
import TodoModule from "./todos/Todos.module";

export default function AppModule() {
  const api = ApiModule();
  const router = RouterModule();
  const counter = CounterModule();
  const todos = TodoModule({ api });

  const start = startAll([
    RouterHandler({ router }),
    CounterHandler({ counter }),
    TodoHandler({ todos }),
    CounterTodosHandler({ counter, todos }),
  ]);

  return {
    start,
    router,
    counter,
    todos,
  };
}

export type Application = ReturnType<typeof AppModule>;
