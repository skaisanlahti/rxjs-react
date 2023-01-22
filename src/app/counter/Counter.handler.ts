import { map, merge, takeUntil, tap, withLatestFrom } from "rxjs";
import controller from "../../shared/utils/controller";
import { loadFromStorage, saveToStorage } from "../../shared/utils/storage";
import { Count, decrement, increment, setCount } from "./Counter.core";
import { CounterModuleType } from "./Counter.module";

interface Dependencies {
  counter: CounterModuleType;
}

export default function CounterHandler({ counter }: Dependencies) {
  return function start() {
    const { stopSignal, stop } = controller();
    const { log } = console;

    const inc = counter.increment.pipe(
      tap(() => log("increment count")),
      withLatestFrom(counter.count),
      map(([input, count]) => increment(count, input))
    );

    const dec = counter.decrement.pipe(
      tap(() => log("decrement count")),
      withLatestFrom(counter.count),
      map(([input, count]) => decrement(count, input))
    );

    const reset = counter.reset.pipe(
      tap(() => log("reset count")),
      withLatestFrom(counter.count),
      map(([_, count]) => setCount(count, 0))
    );

    const actions = merge(inc, dec, reset).pipe(
      tap((count) => counter.count.next(count)),
      tap((count) => counter.saveCount.next(count))
    );

    const load = counter.loadCount.pipe(
      map(() => loadFromStorage<Count>("count")),
      tap((count) => {
        if (count !== null) counter.count.next(count);
      })
    );

    const save = counter.saveCount.pipe(
      map((count) => saveToStorage("count", count))
    );

    merge(actions, load, save).pipe(takeUntil(stopSignal)).subscribe();

    return stop;
  };
}
