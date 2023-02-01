import Counter from "../counter/Counter";
import Home from "../home/Home";
import Todos from "../todos/Todos";

export enum Route {
  Home = "home",
  Todos = "todos",
  Counter = "counter",
}

export const routes = new Map<Route, React.FC>();

routes.set(Route.Home, Home);
routes.set(Route.Counter, Counter);
routes.set(Route.Todos, Todos);
