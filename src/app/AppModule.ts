import { createGroupStarter } from "../shared/utils/createGroupStarter";
import CountTodosHandler from "./count-todos/CountTodosHandler";
import CounterHandler from "./counter/CounterHandler";
import CounterModule from "./counter/CounterModule";
import RouterHandler from "./router/RouterHandler";
import RouterModule from "./router/RouterModule";
import TodoHandler from "./todos/TodosHandler";
import TodoModule from "./todos/TodosModule";
import ApiModule from "./todos/api-mock/ApiModule";
import HiddenFieldHandler from "./todos/hidden-field/HiddenFieldHandler";
import HiddenFieldModule from "./todos/hidden-field/HiddenFieldModule";

export type Application = ReturnType<typeof AppModule>;

export default function AppModule() {
  const api = ApiModule();
  const router = RouterModule();
  const counter = CounterModule();
  const todos = TodoModule({ api });
  const hidden = HiddenFieldModule();

  const startHiddenFieldEvents = HiddenFieldHandler({ hidden, todos, api });

  const start = createGroupStarter([
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
    startHiddenFieldEvents,
  };
}
