import { createCtx } from "../shared/hooks/createCtx";
import { CounterModule } from "./counter/counter-feature";
import { RouterModule } from "./router/router-feature";
import ApiModule from "./todos/api-mock/ApiModule";
import { RemoteTodosModule } from "./todos/remote-todos";
import { TodosModule } from "./todos/todos-feature";

export function buildApplication() {
  const api = ApiModule();

  // application layer
  const router = RouterModule();
  const todos = TodosModule();
  const remoteTodos = RemoteTodosModule(api);
  const counter = CounterModule(remoteTodos);

  // component facades for UI consumption
  return {
    router,
    counter,
    todos,
    remoteTodos,
    api,
  };
}

export type Application = ReturnType<typeof buildApplication>;

export const [useApp, AppProvider] = createCtx<Application>();
