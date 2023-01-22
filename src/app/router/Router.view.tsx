import { useStream } from "../../shared/hooks/observable-hooks";
import { useApp } from "../App.context";
import { routes } from "./Router.core";
import { NotFound } from "./views/NotFound";

interface Props {}
export default function Router({}: Props = {}) {
  const app = useApp();
  const route = useStream(app.router.route);

  const View = routes.get(route);
  if (!View) return <NotFound />;
  return <View />;
}
