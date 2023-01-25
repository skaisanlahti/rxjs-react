import { tap } from "rxjs";
import { saveToStorage } from "../../shared/utils/storage";
import RouterModule, { RouterModuleType } from "./Router.module";

interface Dependencies {
  router: RouterModuleType;
}
export default function RouterHandler(
  { router }: Dependencies = { router: RouterModule() }
) {
  return function start() {
    const s = router.changeRoute
      .pipe(
        tap((route) => router.route.next(route)),
        tap((route) => saveToStorage("route", route))
      )
      .subscribe();

    return () => {
      s.unsubscribe();
    };
  };
}
