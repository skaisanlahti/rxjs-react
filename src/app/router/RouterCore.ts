import Counter from "../counter/Counter.view";
import Home from "../home/Home.view";
import Todos from "../todos/Todos.view";

export enum Route {
  Home = "home",
  Todos = "todos",
  Counter = "counter",
}

export const routes = new Map<Route, React.FC>();

routes.set(Route.Home, Home);
routes.set(Route.Counter, Counter);
routes.set(Route.Todos, Todos);
