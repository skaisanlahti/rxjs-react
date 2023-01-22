import { takeUntil, tap } from "rxjs";
import controller from "../../shared/utils/controller";
import { saveToStorage } from "../../shared/utils/storage";
import RouterModule, { RouterModuleType } from "./1Router.module";

interface Dependencies {
  router: RouterModuleType;
}
export default function RouterHandler(
  { router }: Dependencies = { router: RouterModule() }
) {
  return function start() {
    const { stopSignal, stop } = controller();

    router.changeRoute
      .pipe(
        tap((route) => router.route.next(route)),
        tap((route) => saveToStorage("route", route)),
        takeUntil(stopSignal)
      )
      .subscribe();

    return stop;
  };
}
