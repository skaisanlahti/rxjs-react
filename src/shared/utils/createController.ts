import { Subject } from "rxjs";

// useful helper for cleaning up multiple subscriptions with takeUntil(stopSignal)
export default function createController() {
  const stopSignal = new Subject<void>();
  function stop() {
    stopSignal.next();
    stopSignal.complete();
  }
  return { stopSignal, stop };
}
