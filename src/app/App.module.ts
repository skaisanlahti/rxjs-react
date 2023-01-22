import { startAll } from "../shared/utils/startAll";
import ApiModule from "./api-mock/Api.module";
import CountTodosHandler from "./count-todos/CountTodos.handler";
import CounterHandler from "./counter/Counter.handler";
import CounterModule from "./counter/Counter.module";
import RouterHandler from "./router/Router.handler";
import RouterModule from "./router/Router.module";
import TodoHandler from "./todos/Todos.handler";
import TodoModule from "./todos/Todos.module";
import HiddenFieldHandler from "./todos/hidden-field/HiddenField.handler";
import HiddenFieldModule from "./todos/hidden-field/HiddenField.module";

export type Application = ReturnType<typeof AppModule>;

export default function AppModule() {
  const api = ApiModule();
  const router = RouterModule();
  const counter = CounterModule();
  const todos = TodoModule({ api });
  const hidden = HiddenFieldModule();

  const enableToggle = HiddenFieldHandler({ hidden, todos, api });

  const start = startAll([
    RouterHandler({ router }),
    CounterHandler({ counter }),
    TodoHandler({ todos }),
    CountTodosHandler({ counter, todos }),
  ]);

  return {
    start,
    router,
    counter,
    todos,
    hidden,
    api,
    enableToggle,
  };
}
