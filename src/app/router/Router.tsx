import { useStream } from "../../shared/hooks/observable-hooks";
import { useApp } from "../build-application";
import { getInitialRoute, routes } from "./router-feature";
import { NotFound } from "./views/NotFound";

export default function Router() {
  const { router } = useApp();
  const route = useStream(router.route, getInitialRoute());
  const View = routes.get(route);
  if (!View) return <NotFound />;
  return <View />;
}
