import CounterTodosHandler from "../shared/handlers/CountTodos.handler";
import { startAll } from "../shared/utils/startAll";
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
