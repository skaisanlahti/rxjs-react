import { takeUntil, tap } from "rxjs";
import createController from "../../shared/utils/createController";
import { saveToStorage } from "../../shared/utils/storage";
import RouterModule, { RouterModuleType } from "./Router.module";

interface Dependencies {
  router: RouterModuleType;
}
export default function RouterHandler(
  { router }: Dependencies = { router: RouterModule() }
) {
  return function start() {
    const { stopSignal, stop } = createController();

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
