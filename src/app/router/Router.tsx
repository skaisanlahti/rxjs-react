import { useStream } from "../../shared/hooks/observable-hooks";
import { useApp } from "../AppContext";
import { Route, routes } from "./RouterFeature";
import { NotFound } from "./views/NotFound";

export default function Router() {
  const { router } = useApp();
  const route = useStream(router.route, Route.Home);

  const View = routes.get(route);
  if (!View) return <NotFound />;
  return <View />;
}
