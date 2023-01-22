import { Subject } from "rxjs";

export default function createController() {
  const stopSignal = new Subject<void>();
  function stop() {
    stopSignal.next();
    stopSignal.complete();
  }
  return { stopSignal, stop };
}
